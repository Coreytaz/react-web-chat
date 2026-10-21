import { useAvatarSelection } from '../../hooks/user/useAvatarSelection'
import { useState, type RefObject } from 'react'
import styles from './DragDropFile.module.scss'
export default function DragDropFile({
  formDataRef,
  disabled = false
}: {
  formDataRef: RefObject<FormData | undefined>
  disabled?: boolean
}) {
  const { avatar, preview, selected, isPending, select, cancel, removeAvatar } = useAvatarSelection(
    formDataRef,
    disabled
  )
  const [drag, setDrag] = useState(false)
  return (
    <>
      <div
        className={drag ? styles.drop_area : styles.drop_area_active}
        onDragOver={(e) => {
          e.preventDefault()
          if (!disabled) setDrag(true)
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDrag(false)
          select(e.dataTransfer.files[0])
        }}
      >
        <label className={styles.input_file}>
          <input
            type="file"
            aria-label="Аватар"
            accept=".jpg,.jpeg,.png"
            disabled={disabled || isPending}
            onChange={(e) => {
              select(e.target.files?.[0])
              e.target.value = ''
            }}
          />
          <span>Выберите файл</span>
        </label>
      </div>
      {selected || avatar ? (
        <div className={styles.newAvatar_wrapper}>
          <img
            className={styles.newAvatar}
            src={selected ? preview : (avatar ?? '')}
            alt="Аватар"
          />
          <button
            type="button"
            aria-label={selected ? 'Отменить выбор аватара' : 'Удалить аватар'}
            className={styles.newAvatar_remove}
            disabled={disabled || isPending}
            onClick={() => (selected ? cancel() : removeAvatar())}
          >
            ×
          </button>
        </div>
      ) : null}
    </>
  )
}
