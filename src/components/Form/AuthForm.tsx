import { useState, type InputHTMLAttributes } from 'react'
import { useAuthenticate, type AuthMode, type Credentials } from '../../hooks/auth/useAuthenticate'
import Button from '../UI/Button/Button'
import Input from '../UI/Input/Input'
import styles from '../../style/Page/Home.module.scss'
interface AuthFormProps {
  mode: AuthMode
}
interface AuthField {
  name: keyof Credentials
  label: string
  type?: InputHTMLAttributes<HTMLInputElement>['type']
  autoComplete: string
}
const loginFields: AuthField[] = [
  { name: 'email', label: 'E-mail или Логин', autoComplete: 'username' },
  { name: 'password', label: 'Пароль', type: 'password', autoComplete: 'current-password' }
]
const registerFields: AuthField[] = [
  { name: 'email', label: 'Почта', type: 'email', autoComplete: 'email' },
  { name: 'login', label: 'Логин', autoComplete: 'username' },
  { name: 'password', label: 'Пароль', type: 'password', autoComplete: 'new-password' }
]
export default function AuthForm({ mode }: AuthFormProps) {
  const [credentials, setCredentials] = useState<Credentials>({
    email: '',
    password: '',
    login: ''
  })
  const { mutate, isPending } = useAuthenticate(mode, credentials)
  const registering = mode === 'register'
  const fields = registering ? registerFields : loginFields
  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault()
        if (!isPending) mutate()
      }}
    >
      <h2 className={styles.title}>{registering ? 'Регистрация' : 'Вход'} React Chat</h2>
      <div className={styles.inputs}>
        {fields.map(({ name, label, ...props }) => (
          <Input
            key={name}
            name={name}
            {...props}
            value={credentials[name]}
            placeholder={label}
            required
            onChange={(event) => setCredentials((old) => ({ ...old, [name]: event.target.value }))}
          />
        ))}
      </div>
      <Button appearance="primary" type="submit" disabled={isPending}>
        {registering ? 'Зарегистрироваться' : 'Войти'}
      </Button>
    </form>
  )
}
