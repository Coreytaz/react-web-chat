import { useState } from 'react'
import type { Attachment, MessageUpdatePayload } from '../../types/Chat.interface'
import { useRecorder } from '../useRecorder'
import { useTypedSelector } from '../useTypedSelector'
import { useAction } from '../useAction'
import socket from '../../service/chat/socket.service'
export interface ChatComposerOptions {
  to: string
  editing: MessageUpdatePayload | null
  onCancel: () => void
}
export function useChatComposer({ to, editing, onCancel }: ChatComposerOptions) {
  const [input, setInput] = useState(editing?.message ?? '')
  const [attachments, setAttachments] = useState<Attachment[]>(() => editing?.attachments ?? [])
  const id = useTypedSelector((s) => s.authSlice.user._id)
  const { setError } = useAction()
  const recorder = useRecorder((url) => {
    if (!socket.connected) {
      setError({ error: 'Ошибка', message: 'Нет соединения с чатом. Запись не отправлена.' })
      return
    }
    socket.emit('SEND-MESG', { from: id, to, message: null, attachments: [], voiceMessage: url })
  })
  const pending = attachments.some((file) => file.status !== 'done')
  const submit = () => {
    if (recorder.isRecording) {
      recorder.stop()
      return
    }
    if (recorder.isBusy || pending || (!input.trim() && !attachments.length)) return
    if (!socket.connected) {
      setError({ error: 'Ошибка', message: 'Нет соединения с чатом. Дождитесь подключения.' })
      return
    }
    if (editing) {
      socket.emit('message:update', { id: editing.id, message: input, attachments })
      onCancel()
    } else {
      socket.emit('SEND-MESG', { from: id, to, message: input, attachments })
      setInput('')
      setAttachments([])
    }
  }

  return { input, setInput, attachments, setAttachments, recorder, pending, submit }
}
