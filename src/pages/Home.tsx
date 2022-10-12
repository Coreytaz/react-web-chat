import axios from 'axios'
import React from 'react'
import { useMutation } from 'react-query'
import { useSelector } from 'react-redux'
import { Button, Form } from '../components'
import Input from '../components/UI/Input/Input'
import { isAuth } from '../redux/slice/authSlice'
import { RootState, useAppDispatch } from '../redux/store'
import { AuthService } from '../service/auth.service'
import styles from '../style/Page/Home.module.scss'

const Home = (): JSX.Element => {
  const { auth } = useSelector((state: RootState) => state.authSlice)
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const dispatch = useAppDispatch()
  const { mutateAsync: loginAsync, isLoading } = useMutation('login', async () => await AuthService.login(email, password), {
    onError: (err: Error) => alert(err),
    onSuccess: ({ data }) => {
      console.log(data)
      localStorage.setItem('token', data.accessToken)
      dispatch(isAuth(data))
    }
  })

  React.useEffect(() => {
    const token = localStorage.getItem('token')
    if (token !== null) {
      void refresh(token)
    }
  }, [])

  const refresh = async (token: string): Promise<void> => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/auth/refresh', { headers: { Authorization: `Bearer ${token}` } })
      dispatch(isAuth(data))
    } catch (error) {
      console.log(error)
    }
  }

  const onHandleSubmit = (): void => {
    void loginAsync()
  }

  if (!auth) {
    return (
      <Form className={styles.form} onSubmit={(e) => e.preventDefault()}>
        <h2 className={styles.title}>Вход React Chat</h2>
        <div className={styles.inputs}>
          <Input name="Почта" value={email} onChange={(e => setEmail(e.target.value))} placeholder="Почта" required />
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
        <aside>
          <ul>
            <li>
              <img src="https://via.placeholder.com/45" alt="avatar" />
              <p>Lorem ipsum</p>
            </li>
            <li>
              <img src="https://via.placeholder.com/45" alt="avatar" />
              <p>Lorem ipsum</p>
            </li>
            <li>
              <img src="https://via.placeholder.com/45" alt="avatar" />
              <p>Lorem ipsum</p>
            </li>
          </ul>
        </aside>
        <main>
          <div className={styles.messages_wrap}>
            <div className="message">
              <p></p>
              <img src="" alt="" />
            </div>
            <div className="message">
              <p></p>
              <img src="" alt="" />
            </div>
            <div className="message">
              <p></p>
              <img src="" alt="" />
            </div>
          </div>
          <div className={styles.messges_input}>
            <Input
              name="message"
              placeholder="Напишите сообщение..."
              required
            />
            <Button appearance="primary">Отправить</Button>
          </div>
        </main>
      </div>
    </>
  )
}

export default Home
