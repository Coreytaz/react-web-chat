import React from 'react'
import { Button, Form } from '../components'
import Input from '../components/UI/Input/Input'
import styles from '../style/Page/Home.module.scss'

const Auth = (): JSX.Element => {
  return (
    <Form className={styles.form}>
        <h2 className={styles.title}>Регистрация React Chat</h2>
        <div className={styles.inputs}>
            <Input name="Почта" placeholder="Почта" required />
            <Input name="Пароль" placeholder="Пароль" required />
        </div>
        <Button appearance="primary">Зарегистрироваться</Button>
    </Form>
  )
}

export default Auth
