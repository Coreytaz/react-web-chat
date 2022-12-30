/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { FC, useEffect, useState } from 'react'
import styles from './DragDropFile.module.scss'
import { ReactComponent as Trash } from '../ChatContainer/Trash.svg'
import { ReactComponent as Eye } from '../../assets/eye.svg'
import { ReactComponent as Loading } from './Loading.svg'
import { Modal } from '..'
import { ChatService } from '../../service/chat/chat.service'

interface DragDropMessageProps {
  children: React.ReactNode
}

const DragDropMessage: FC<DragDropMessageProps> = ({ children }) => {
  const [attachments, setAttachments] = useState([] as any)
  const [drag, setDrag] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')

  useEffect(() => {
    if (attachments.length > 10) {
      setAttachments(attachments.slice(0, 10))
    }
  }, [attachments])

  const dragStartHandler = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault()
    setDrag(true)
  }

  const dragLeaveHandler = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault()
    setDrag(false)
  }

  const onDropHandler = async (e: React.DragEvent<HTMLDivElement>): Promise<void> => {
    e.preventDefault()
    const file = [...e.dataTransfer.files]
    if (attachments.length > 9 || file.length > 9) {
      setDrag(false)
      return
    }
    for (let i = 0; i < file.length; i++) {
      if (!(/\.(jpe?g?|png|)$/).test(file[i].name)) {
        setDrag(false)
        return
      }
      const id = crypto.randomUUID()
      setAttachments((uploaded: any) => [
        ...uploaded,
        {
          id,
          name: file[i].name,
          status: 'uploading'
        }
      ])
      const { data } = await ChatService.uploadFile(file[i])
      setAttachments((uploaded: any) => uploaded.map((file: any) => {
        if (file.id === id) {
          return {
            ...file,
            src: data,
            status: 'done'
          }
        }
        return file
      }))
    }
    setDrag(false)
  }

  const handlePreview = (file: any): void => {
    setPreviewImage(file.src)
    setPreviewOpen(true)
  }

  const removePreview = async (id: string, src: string): Promise<void> => {
    setAttachments(attachments.filter((file: any) => file.id !== id))
    await ChatService.removeFile(src)
  }

  return (
    <div className={styles.inner_file}>
    {drag
      ? (
          <div className={styles.DragDropMessage__active}
            onDragStart={e => dragStartHandler(e)}
            onDragLeave={e => dragLeaveHandler(e)}
            onDragOver={e => dragStartHandler(e)}
            onDrop={async e => await onDropHandler(e)}
          ><span>Отпустите файл, чтобы загрузить его</span>
          </div>
        )
      : (
          <div className={styles.DragDropMessage}
            onDragStart={e => dragStartHandler(e)}
            onDragLeave={e => dragLeaveHandler(e)}
            onDragOver={e => dragStartHandler(e)}
            onDrop={async e => await onDropHandler(e)}
          >{children}
          </div>
        )
    }
    <div className={styles.files}>
        {
            attachments.map((file: any) => {
              return (
                    <div className={styles.file} key={file.id}>
                          {file.status === 'uploading' &&
                          <div className={styles.Loading_wrapper}>
                            <Loading className={styles.Loading} />
                            <span>Загрузка</span>
                          </div>
                          }
                          {file.status === 'done' && <img src={file.src} alt={file.name} />}
                        <Trash className={styles.Trash} onClick={async () => await removePreview(file.id, file.src)}/>
                        <Eye className={styles.eye} onClick={() => handlePreview(file)}/>
                    </div>
              )
            })
        }
    </div>
    <Modal open={previewOpen} onClose={() => setPreviewOpen(!previewOpen)}>
        <img src={previewImage} alt="Image" />
    </Modal>
    </div>
  )
}

export default DragDropMessage
