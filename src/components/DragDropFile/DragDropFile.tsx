import React from 'react'
import styles from './DragDropFile.module.scss'

const DragDropFile = (): JSX.Element => {
  const [drag, setDrag] = React.useState(false)
  const [selectAvatar, setSelectedAvatar] = React.useState(false)
  const avatarRef = React.useRef<HTMLImageElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const dragStartHandler = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault()
    setDrag(true)
  }

  const dragLeaveHandler = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault()
    setDrag(false)
  }

  const onDropHandler = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault()
    const file = [...e.dataTransfer.files]
    const formData = new FormData()
    formData.append('file', file[0])
    const reader = new FileReader()
    reader.readAsDataURL(file[0])
    reader.onload = function (event) {
      if (avatarRef.current != null) {
        avatarRef.current.src = event.target?.result as string
      }
    }
    setDrag(false)
    setSelectedAvatar(true)
  }

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault()
    const file = inputRef.current?.files
    const formData = new FormData()
    if (file != null) {
      formData.append('file', file[0])
      const reader = new FileReader()
      reader.readAsDataURL(file[0])
      reader.onload = function (event) {
        if (avatarRef.current != null) {
          avatarRef.current.src = event.target?.result as string
        }
      }
    }
    setSelectedAvatar(true)
  }
  return (
    <>{drag
      ? <div className={styles.drop_area}
      onDragStart={e => dragStartHandler(e)}
      onDragLeave={e => dragLeaveHandler(e)}
      onDragOver={e => dragStartHandler(e)}
      onDrop={e => onDropHandler(e)}
    >Отпустите файл, чтобы загрузить его</div>
      : <div className={styles.drop_area_active}
      onDragStart={e => dragStartHandler(e)}
      onDragLeave={e => dragLeaveHandler(e)}
      onDragOver={e => dragStartHandler(e)}
    ><label className={styles.input_file}>
      <input type="file" ref={inputRef} onChange={e => onChangeInput(e)}/><span>Выберите файл</span></label><div className={styles.input_file_list}></div>
    </div>
  }
  {selectAvatar && <img ref={avatarRef} className={styles.newAvatar} alt="avatar" />}</>
  )
}

export default DragDropFile
