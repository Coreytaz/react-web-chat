/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { AxiosError } from 'axios'
import React from 'react'
import { useMutation } from 'react-query'
import { Button, DragDropFile, Form, Input } from '../components'
import { useAction } from '../hooks/useAction'
import { useTypedSelector } from '../hooks/useTypedSelector'
import { UserService } from '../service/user/user.service'
import styles from '../style/Page/Profile.module.scss'
import { ErrorResData } from '../types/Error.interface'

const Profile = (): JSX.Element => {
  const { user } = useTypedSelector((state) => state.authSlice)
  const [email, setEmail] = React.useState(user?.email)
  const [userName, setUserName] = React.useState(user?.username)
  const { setAvatar, updateUser, setError, setSuccess } = useAction()
  const formDataRef = React.useRef<FormData>()

  React.useEffect(() => {
    setEmail(user?.email)
    setUserName(user?.username)
  }, [user?.email, user?.username])

  const { mutateAsync: avatarAsync } = useMutation('avatar', async () => await UserService.avatar(formDataRef.current as FormData), {
    onError: (err: AxiosError) => {
      const { message, error } = err.response?.data as ErrorResData
      setError({ message, error })
    },
    onSuccess: ({ data }: any) => {
      setAvatar(data.avatar)
      setSuccess(data.message)
      formDataRef.current?.delete('avatar')
    }
  })

  const { mutateAsync: userAsync } = useMutation('updateUser', async () => await UserService.updateUser({ email, username: userName }), {
    onError: (err: AxiosError) => {
      const { message, error } = err.response?.data as ErrorResData
      setError({ message, error })
    },
    onSuccess: () => {
      updateUser({ email, username: userName })
      setSuccess('Данные изменены')
    }
  })

  const onSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    if (formDataRef.current?.get('avatar')) {
      void avatarAsync()
    }
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
