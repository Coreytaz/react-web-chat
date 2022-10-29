import React from 'react'
import { useMutation } from 'react-query'
import { useSelector } from 'react-redux'
import { setList } from '../../redux/slice/toastSlice'
import { RootState, useAppDispatch } from '../../redux/store'
import { UserService } from '../../service/user/user.service'
import styles from './DragDropFile.module.scss'

interface DragDropFileProps {
  formDataRef: React.MutableRefObject<FormData | undefined>
}

const DragDropFile: React.FC<DragDropFileProps> = ({ formDataRef }) => {
  const avatar = useSelector((state: RootState) => state.authSlice.user?.avatar)
  const dispatch = useAppDispatch()
  const [drag, setDrag] = React.useState(false)
  const [selectAvatar, setSelectedAvatar] = React.useState(false)
  const avatarRef = React.useRef<HTMLImageElement>(null)
  const formData = new FormData()

  React.useEffect(() => {
    if (avatarRef.current != null) {
      avatarRef.current.src = avatar as string
    }
  }, [avatar, formDataRef])

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
    if (!(/\.(jpe?g?|png|)$/).test(file[0].name)) {
      setDrag(false)
      return
    }
    formData.append('avatar', file[0])
    formDataRef.current = formData
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
    const file = e.target.files
    if (file != null) {
      formData.append('avatar', file[0])
      const reader = new FileReader()
      formDataRef.current = formData
      reader.readAsDataURL(file[0])
      reader.onload = function (event) {
        if (avatarRef.current != null) {
          avatarRef.current.src = event.target?.result as string
        }
      }
    }
    setSelectedAvatar(true)
  }

  const { mutateAsync: removeAvatar } = useMutation('removeAvatar', async () => await UserService.removeAvatar(), {
    onError: (err: any) => {
      const res: any = err.response?.data
      if (Array.isArray(res.message)) {
        res.message.map((data: any) => dispatch(setList({
          id: Date.now(),
          title: 'Error',
          description: data,
          backgroundColor: '#bd362f'
        })))
      } else {
        dispatch(setList({
          id: Date.now(),
          title: 'Error',
          description: res.message,
          backgroundColor: '#bd362f'
        }))
      }
    },
    onSuccess: ({ data }) => {
      dispatch(setList({
        id: Date.now(),
        title: 'Success',
        description: data.message,
        backgroundColor: '#5cb85c'
      }))
    }
  })

  const onRemoveAvatar = (): void => {
    formData.delete('avatar')
    formDataRef.current = formData
    setSelectedAvatar(false)
    void removeAvatar()
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
      <input type="file" accept=".jpg, .jpeg, .png" onChange={e => onChangeInput(e)}/><span>Выберите файл</span></label><div className={styles.input_file_list}></div>
    </div>
  }
  {(avatar != null)
    ? <div className={styles.newAvatar_wrapper}>
    <img ref={avatarRef} src={avatarRef.current?.src} className={styles.newAvatar} alt="avatar" />
    <span onClick={() => onRemoveAvatar()} className={styles.newAvatar_remove}>x</span>
  </div>
    : selectAvatar && <div className={styles.newAvatar_wrapper}>
    <img ref={avatarRef} className={styles.newAvatar} alt="avatar" />
    <span onClick={() => onRemoveAvatar()} className={styles.newAvatar_remove}>x</span>
  </div>}
  </>
  )
}

export default DragDropFile
