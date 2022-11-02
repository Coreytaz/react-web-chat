import React from 'react'
import { useMutation } from 'react-query'
import { useSelector } from 'react-redux'
import { Button, DragDropFile, Form, Input } from '../components'
import { setAvatar, updateUser } from '../redux/slice/authSlice'
import { setList } from '../redux/slice/toastSlice'
import { RootState, useAppDispatch } from '../redux/store'
import { UserService } from '../service/user/user.service'
import styles from '../style/Page/Profile.module.scss'

const Profile = (): JSX.Element => {
  const { user } = useSelector((state: RootState) => state.authSlice)
  const [email, setEmail] = React.useState(user?.email)
  const [userName, setUserName] = React.useState(user?.username)
  const dispatch = useAppDispatch()
  const formDataRef = React.useRef<FormData>()

  React.useEffect(() => {
    setEmail(user?.email)
    setUserName(user?.username)
  }, [user?.email, user?.username])

  const { mutateAsync: avatarAsync } = useMutation('avatar', async () => await UserService.avatar(formDataRef.current as FormData), {
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
    onSuccess: ({ data }: any) => {
      dispatch(setAvatar(data.avatar))
      dispatch(setList({
        id: Date.now(),
        title: 'Success',
        description: data.message,
        backgroundColor: '#5cb85c'
      }))
      formDataRef.current?.delete('avatar')
    }
  })

  const { mutateAsync: userAsync } = useMutation('updateUser', async () => await UserService.updateUser({ email, username: userName }), {
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
    onSuccess: () => {
      dispatch(updateUser({ email, username: userName }))
      dispatch(setList({
        id: Date.now(),
        title: 'Success',
        description: 'Данные изменены',
        backgroundColor: '#5cb85c'
      }))
    }
  })

  const onSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    void avatarAsync()
    if (!(email === user?.email && userName === user?.username)) {
      void userAsync()
    }
  }

  return (
    <>
    <Form className={styles.form} onSubmit={e => onSubmit(e)} encType='multipart/form-data'>
        <h2 className={styles.title}>Профиль: {user?.username}</h2>
        <div className={styles.inputs}>
          <Input name="Почта" value={email} onChange={(e => setEmail(e.target.value))} placeholder="Почта" required/>
          <Input name="Имя пользователя" value={userName} onChange={(e => setUserName(e.target.value))} placeholder="Имя пользователя" required/>
          <DragDropFile formDataRef={formDataRef}/>
            <Button appearance="primary" type="submit">Обновить</Button>
        </ div>
    </Form>
    </>
  )
}

export default Profile
