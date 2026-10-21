import { useEffect, useRef, type Dispatch, type SetStateAction } from 'react'
import type { Attachment } from '../../types/Chat.interface'
import { ChatService } from '../../service/chat/chat.service'
import { useAction } from '../useAction'
import { errorMessage } from '../../utils/errors'
import { isImage, MAX_ATTACHMENTS } from '../../utils/files'
interface AttachmentOptions {
  attachments: Attachment[]
  setAttachments: Dispatch<SetStateAction<Attachment[]>>
  savedIds: string[]
  disabled?: boolean
}
export function useMessageAttachments({
  attachments,
  setAttachments,
  savedIds,
  disabled
}: AttachmentOptions) {
  const pending = useRef(new Map<string, AbortController>())
  const count = useRef(attachments.length)
  const { setError } = useAction()
  const mounted = useRef(true)
  useEffect(() => {
    count.current = attachments.length
  }, [attachments.length])
  useEffect(() => {
    mounted.current = true
    const requests = pending.current
    return () => {
      mounted.current = false
      requests.forEach((controller) => controller.abort())
      requests.clear()
    }
  }, [])
  const upload = (files: File[]) => {
    if (disabled) return
    if (files.some((file) => !isImage(file))) {
      setError({ error: 'Ошибка', message: 'Допустимы только JPEG и PNG' })
      return
    }
    if (count.current + files.length > MAX_ATTACHMENTS) {
      setError({ error: 'Ошибка', message: 'Можно прикрепить не более 9 изображений' })
      return
    }
    count.current += files.length
    const drafts = files.map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      url: '',
      status: 'uploading' as const
    }))
    setAttachments((old) => [...old, ...drafts])
    for (const [index, file] of files.entries()) {
      const id = drafts[index].id
      const controller = new AbortController()
      pending.current.set(id, controller)
      void ChatService.uploadFile(file, controller.signal)
        .then(({ data }) => {
          if (!controller.signal.aborted && mounted.current)
            setAttachments((old) =>
              old.map((item) => (item.id === id ? { ...item, url: data, status: 'done' } : item))
            )
        })
        .catch((error) => {
          if (!controller.signal.aborted && mounted.current) {
            setAttachments((old) =>
              old.map((item) => (item.id === id ? { ...item, status: 'error' } : item))
            )
            setError(errorMessage(error))
          }
        })
        .finally(() => pending.current.delete(id))
    }
  }
  const remove = (file: Attachment) => {
    pending.current.get(file.id)?.abort()
    count.current = Math.max(0, count.current - 1)
    setAttachments((old) => old.filter((item) => item.id !== file.id))
    if (file.url && !savedIds.includes(file.id))
      void ChatService.removeFile(file.url).catch((error) => setError(errorMessage(error)))
  }
  return { upload, remove }
}
