/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useState } from 'react'
import { ChatService } from '../service/chat/chat.service'
import { useAction } from './useAction'

export const useRecorder = (): any => {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder>(null!)
  const [isRecording, setIsRecording] = useState(false)
  const { onClickSendRecordMessage } = useAction()

  navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia ||
    navigator.webkitGetUserMedia

  const onRecord = (): void => {
    if (navigator.getUserMedia) {
      navigator.getUserMedia({ audio: true }, onRecording, onError)
    }
  }

  const onHideRecording = (): void => {
    setIsRecording(false)
  }

  const onError = (err: MediaStreamError): void => {
    console.log('The following error occured: ' + err.message)
  }

  const onRecording = (stream: MediaStream): void => {
    const recorder = new MediaRecorder(stream)
    setMediaRecorder(recorder)

    recorder.start()

    recorder.onstart = () => {
      setIsRecording(true)
    }

    recorder.onstop = () => {
      setIsRecording(false)
    }

    recorder.ondataavailable = async (e) => {
      const file = new File([e.data], 'audio.webm')
      const { data } = await ChatService.recordMessage(file)
      onClickSendRecordMessage((data as unknown) as string)
    }
  }

  return { onRecord, mediaRecorder, isRecording, setIsRecording, onHideRecording }
}
