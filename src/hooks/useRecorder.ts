import { useCallback, useEffect, useRef, useState } from 'react'
import { ChatService } from '../service/chat/chat.service'
import { useAction } from './useAction'
import { errorMessage } from '../utils/errors'
export const useRecorder = (send: (url: string) => void) => {
  const [isRecording, setRecording] = useState(false)
  const [isBusy, setBusy] = useState(false)
  const recorder = useRef<MediaRecorder | null>(null)
  const stream = useRef<MediaStream | null>(null)
  const generation = useRef(0)
  const controller = useRef<AbortController | null>(null)
  const { setError } = useAction()
  const callback = useRef(send)
  useEffect(() => {
    callback.current = send
  }, [send])
  const release = useCallback(() => {
    stream.current?.getTracks().forEach((track) => track.stop())
    stream.current = null
  }, [])
  const cancel = useCallback(() => {
    generation.current++
    controller.current?.abort()
    const current = recorder.current
    recorder.current = null
    if (current && current.state !== 'inactive') {
      current.ondataavailable = null
      current.onstop = null
      current.stop()
    }
    release()
    setRecording(false)
    setBusy(false)
  }, [release])
  useEffect(
    () => () => {
      generation.current++
      controller.current?.abort()
      const current = recorder.current
      if (current && current.state !== 'inactive') {
        current.ondataavailable = null
        current.onstop = null
        current.stop()
      }
      release()
    },
    [release]
  )
  const start = async () => {
    if (isBusy || isRecording) return
    const attempt = ++generation.current
    setBusy(true)
    try {
      if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined')
        throw new Error('Запись звука не поддерживается. Используйте HTTPS и современный браузер.')
      const media = await navigator.mediaDevices.getUserMedia({ audio: true })
      if (attempt !== generation.current) {
        media.getTracks().forEach((track) => track.stop())
        return
      }
      stream.current = media
      const mime = ['audio/webm;codecs=opus', 'audio/ogg;codecs=opus', 'audio/mp4'].find((type) =>
        MediaRecorder.isTypeSupported(type)
      )
      const current = new MediaRecorder(media, mime ? { mimeType: mime } : undefined)
      recorder.current = current
      const chunks: Blob[] = []
      current.ondataavailable = (event) => {
        if (event.data.size) chunks.push(event.data)
      }
      current.onerror = () => {
        if (attempt !== generation.current) return
        cancel()
        setError({ error: 'Ошибка', message: 'Не удалось записать звук' })
      }
      current.onstop = () => {
        release()
        if (attempt !== generation.current) return
        setRecording(false)
        setBusy(true)
        const type = current.mimeType || mime || 'audio/webm'
        const file = new File(
          chunks,
          'audio.' + (type.includes('ogg') ? 'ogg' : type.includes('mp4') ? 'm4a' : 'webm'),
          { type }
        )
        if (!file.size) {
          setBusy(false)
          return
        }
        const abort = new AbortController()
        controller.current = abort
        void ChatService.recordMessage(file, abort.signal)
          .then(({ data }) => {
            if (attempt === generation.current) callback.current(data)
          })
          .catch((error) => {
            if (attempt === generation.current) setError(errorMessage(error))
          })
          .finally(() => {
            if (attempt === generation.current) setBusy(false)
          })
      }
      current.start()
      setRecording(true)
    } catch (error) {
      release()
      if (attempt === generation.current) setError(errorMessage(error))
    } finally {
      if (attempt === generation.current) setBusy(false)
    }
  }
  const stop = () => {
    if (recorder.current?.state === 'recording') recorder.current.stop()
  }
  return { start, stop, cancel, isRecording, isBusy }
}
