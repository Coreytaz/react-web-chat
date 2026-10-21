import type { ChatMessage } from '../../types/Chat.interface'
import api from '../api.service'
export const ChatService = {
  getAllMessage: (from: string, to: string, page = 0, limit = 30, signal?: AbortSignal) =>
    api.post<ChatMessage[]>('chat/getMessages', { from, to }, { params: { page, limit }, signal }),
  recordMessage: (file: File, signal?: AbortSignal) => {
    const form = new FormData()
    form.append('recordMessage', file)
    return api.postForm<string>('chat/recordMessage', form, { signal })
  },
  uploadFile: (file: File, signal?: AbortSignal) => {
    const form = new FormData()
    form.append('file', file)
    return api.postForm<string>('chat/file', form, { signal })
  },
  removeFile: (url: string) =>
    api.delete<void>('chat/file/' + encodeURIComponent(url.split('/').at(-1) || ''))
}
