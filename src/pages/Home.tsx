/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React from 'react'
import { Button, ChatContainer, Form, UserBlock, UserBlockSkeleton } from '../components'
import Input from '../components/UI/Input/Input'
import { useLogin } from '../hooks/auth/useLogin'
import styles from '../style/Page/Home.module.scss'
import { useTypedSelector } from '../hooks/useTypedSelector'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import socket from '../service/chat/socket.service'
import { useSearchUsers } from '../hooks/user/useSearchUsers'

const Home = (): JSX.Element => {
  const { auth } = useTypedSelector((state) => state.authSlice)
  const [emailOrLogin, setEmailOrLogin] = React.useState('')
  const [password, setPassword] = React.useState('')
  const { loginAsync, isLoading } = useLogin(emailOrLogin, password)
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || location.search || '/'
  const { refetch, isFetching, userList } = useSearchUsers()

  const onHandleSubmit = (): void => {
    void loginAsync()
    setEmailOrLogin('')
    setPassword('')
  }

  React.useEffect(() => {
    if (auth) {
      navigate(from, { replace: true })
      void refetch()
      socket.connect()
    }
  }, [auth, from, navigate, refetch])

  if (!auth) {
    return (
      <Form className={styles.form} onSubmit={(e) => e.preventDefault()}>
        <h2 className={styles.title}>Вход React Chat</h2>
        <div className={styles.inputs}>
          <Input name="Почта" value={emailOrLogin} onChange={(e => setEmailOrLogin(e.target.value))} placeholder="E-mail или Логин" required />
          <Input name="Пароль" type="password" value={password} onChange={(e => setPassword(e.target.value))} placeholder="Пароль" required />
        </div>
        <Button appearance="primary" onClick={() => onHandleSubmit()} disabled={isLoading}>
          Войти
        </Button>
      </Form>
    )
  }

  return (
    <>
      <div className={styles.inbox}>
        <aside className={styles.aside}>
          <ul>
          {isFetching
            ? [...new Array(9)].map((_, i) => <li key={i}>
              <UserBlockSkeleton/>
          </li>)
            : userList?.items.map((user) =>
            <Link to={`/?sel=${user._id}`} key={user.email}>
              <li>
              <UserBlock _id={user._id} avatar={user.avatar} username={user.username}/>
              </li>
            </Link>)}
          </ul>
        </aside>
        <main>
          <ChatContainer/>
        </main>
      </div>
    </>
  )
}

export default Home
