import { useMessageAttachments } from '../../hooks/chat/useMessageAttachments'
import { useState, type Dispatch, type SetStateAction, type ReactNode } from 'react'
import styles from './DragDropFile.module.scss'
import Trash from '../ChatContainer/Trash.svg?react'
import Eye from '../../assets/eye.svg?react'
import Loading from './Loading.svg?react'
import Modal from '../Modal/Modal'
import type { Attachment } from '../../types/Chat.interface'
interface Props {
  children: ReactNode
  attachments: Attachment[]
  setAttachments: Dispatch<SetStateAction<Attachment[]>>
  disabled?: boolean
  savedIds?: string[]
}
export default function DragDropMessage({
  children,
  attachments,
  setAttachments,
  disabled,
  savedIds = []
}: Props) {
  const [drag, setDrag] = useState(false)
  const [preview, setPreview] = useState('')
  const { upload, remove } = useMessageAttachments({
    attachments,
    setAttachments,
    savedIds,
    disabled
  })

  return (
    <div className={styles.inner_file}>
      <div
        className={drag ? styles.DragDropMessage__active : styles.DragDropMessage}
        onDragOver={(e) => {
          e.preventDefault()
          if (!disabled) setDrag(true)
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDrag(false)
          upload([...e.dataTransfer.files])
        }}
      >
        {drag ? <span>Отпустите файл, чтобы загрузить его</span> : children}
      </div>
      <div className={styles.files}>
        {attachments.map((file) => (
          <div className={styles.file} key={file.id}>
            {file.status === 'uploading' ? (
              <div className={styles.Loading_wrapper}>
                <Loading className={styles.Loading} />
                <span>Загрузка</span>
              </div>
            ) : file.status === 'error' ? (
              <span role="alert">Ошибка загрузки</span>
            ) : (
              <img src={file.url} alt={file.name} />
            )}
            <Trash
              role="button"
              aria-label="Удалить вложение"
              className={styles.Trash}
              onClick={() => remove(file)}
            />
            {file.status === 'done' ? (
              <Eye
                role="button"
                aria-label="Открыть вложение"
                className={styles.eye}
                onClick={() => setPreview(file.url)}
              />
            ) : null}
          </div>
        ))}
      </div>
      <Modal open={!!preview} onClose={() => setPreview('')}>
        <img src={preview} alt="Вложение" />
      </Modal>
    </div>
  )
}
