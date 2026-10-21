import axios from 'axios'
import type { ToastError } from '../redux/slice/toastSlice'
export function errorMessage(error: unknown): ToastError {
  if (axios.isAxiosError(error)) {
    const data: unknown = error.response?.data
    if (data && typeof data === 'object' && 'message' in data) {
      const message = data.message
      if (
        typeof message === 'string' ||
        (Array.isArray(message) && message.every((m) => typeof m === 'string'))
      )
        return { message, error: 'Ошибка' }
    }
  }
  return {
    message:
      error instanceof Error ? error.message : 'Не удалось выполнить запрос. Попробуйте ещё раз.',
    error: 'Ошибка'
  }
}
