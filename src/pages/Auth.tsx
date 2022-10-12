import React from 'react'
import { useMutation } from 'react-query'
import { Button, Form } from '../components'
import Input from '../components/UI/Input/Input'
import { isAuth } from '../redux/slice/authSlice'
import { useAppDispatch } from '../redux/store'
import { AuthService } from '../service/auth.service'
import styles from '../style/Page/Home.module.scss'

const Auth = (): JSX.Element => {
  const dispatch = useAppDispatch()
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const { mutateAsync: registerAsync, isLoading } = useMutation('register', async () => await AuthService.register(email, password), {
    onError: (err: Error) => alert(err),
    onSuccess: ({ data }) => {
      console.log(data)
      localStorage.setItem('token', data.accessToken)
      dispatch(isAuth({ ...data }))
    }
  })

  const onHandleSubmit = (): void => {
    void registerAsync()
  }
  return (
    <Form className={styles.form} onSubmit={e => e.preventDefault()}>
        <h2 className={styles.title}>Регистрация React Chat</h2>
        <div className={styles.inputs}>
        <Input name="Почта" value={email} onChange={(e => setEmail(e.target.value))} placeholder="Почта" required />
          <Input name="Пароль" type="password" value={password} onChange={(e => setPassword(e.target.value))} placeholder="Пароль" required />
        </div>
        <Button appearance="primary" onClick={() => onHandleSubmit()} disabled={isLoading}>Зарегистрироваться</Button>
    </Form>
  )
}

export default Auth
