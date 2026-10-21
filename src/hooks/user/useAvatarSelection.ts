import { useEffect, useState, type RefObject } from 'react'
import { useTypedSelector } from '../useTypedSelector'
import { useRemoveAvatar } from './useRemoveAvatar'
import { useAction } from '../useAction'
import { isImage } from '../../utils/files'
export function useAvatarSelection(
  formDataRef: RefObject<FormData | undefined>,
  disabled: boolean
) {
  const avatar = useTypedSelector((s) => s.authSlice.user.avatar)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const { removeAvatar, isPending } = useRemoveAvatar()
  const { setError } = useAction()
  useEffect(() => {
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])
  const select = (next?: File) => {
    if (!next || disabled) return
    if (!isImage(next)) {
      setError({ error: 'Ошибка', message: 'Допустимы только JPEG и PNG' })
      return
    }
    const form = new FormData()
    form.append('avatar', next)
    formDataRef.current = form
    setFile(next)
  }
  const cancel = () => {
    formDataRef.current = undefined
    setFile(null)
    setPreview('')
  }
  const selected = !!file && !!formDataRef.current
  return { avatar, preview, selected, isPending, select, cancel, removeAvatar }
}
