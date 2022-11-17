/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React from 'react'
import { Button, DragDropFile, Form, Input } from '../components'
import { useAvatar } from '../hooks/user/useAvatar'
import { useUpdateUser } from '../hooks/user/useUpdateUser'
import { useTypedSelector } from '../hooks/useTypedSelector'
import styles from '../style/Page/Profile.module.scss'

const Profile = (): JSX.Element => {
  const { user } = useTypedSelector((state) => state.authSlice)
  const [email, setEmail] = React.useState(user?.email)
  const [userName, setUserName] = React.useState(user?.username)
  const formDataRef = React.useRef<FormData>()

  React.useEffect(() => {
    setEmail(user?.email)
    setUserName(user?.username)
  }, [user?.email, user?.username])

  const { avatarAsync } = useAvatar(formDataRef)

  const { userAsync } = useUpdateUser(email, userName)

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
