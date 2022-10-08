import React from 'react'
import { Button, Form } from '../components'
import Input from '../components/UI/Input/Input'
import styles from '../style/Page/Home.module.scss'

const Home = (): JSX.Element => {
  const [auth, setAuth] = React.useState(false)

  if (!auth) {
    return (
      <Form className={styles.form}>
        <h2 className={styles.title}>Вход React Chat</h2>
        <div className={styles.inputs}>
          <Input name="Почта" placeholder="Почта" required />
          <Input name="Пароль" placeholder="Пароль" required />
        </div>
        <Button appearance="primary" onClick={() => setAuth(!auth)}>
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