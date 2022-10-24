/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-tabs */
import React from 'react'
import { useSelector } from 'react-redux'
import { Button, Form } from '../components'
import Input from '../components/UI/Input/Input'
import { useLogin } from '../hooks/auth/useLogin'
import { RootState } from '../redux/store'
import styles from '../style/Page/Home.module.scss'
import Point from '../assets/point.svg'
import cn from 'classnames'

const Home = (): JSX.Element => {
  const { auth } = useSelector((state: RootState) => state.authSlice)
  const [emailOrLogin, setEmailOrLogin] = React.useState('')
  const [password, setPassword] = React.useState('')
  const { loginAsync, isLoading } = useLogin(emailOrLogin, password)

  const onHandleSubmit = (): void => {
    void loginAsync()
  }

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
          <div>
            <div className={styles.mesage_header}>
              <div className={styles.message_user}>
              <img src="https://via.placeholder.com/45" alt="avatar" />
              <p>Lorem ipsum</p>
              </div>
              <div className={styles.message_dropdown}>
                  <img src={Point} className={styles.dropBtn}/>
                     <div className={styles.message_dropdown_content}>
                       <a href="#">Link 1</a>
                       <a href="#">Link 2</a>
                       <a href="#">Link 3</a>
                </div>
              </div>
            </div>
            <div className={styles.message_inner}>
            <div className={cn(styles.row, styles.no_gutters)}>
			  <div className={cn(styles.chat_bubble, styles.chat_bubble__left)}>
				Hello dude!
			</div>
		  </div>
		  <div className={cn(styles.row, styles.no_gutters)}>
			  <div className={cn(styles.chat_bubble, styles.chat_bubble__right)}>
				Hello
			  </div>
			</div>
      <div className={cn(styles.row, styles.no_gutters)}>
			  <div className={cn(styles.chat_bubble, styles.chat_bubble__right)}>
				Hello
			  </div>
			</div>
      <div className={cn(styles.row, styles.no_gutters)}>
			  <div className={cn(styles.chat_bubble, styles.chat_bubble__right)}>
				Hello
			  </div>
			</div>
      <div className={cn(styles.row, styles.no_gutters)}>
			  <div className={cn(styles.chat_bubble, styles.chat_bubble__right)}>
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae facere magnam laboriosam assumenda aperiam esse obcaecati error odio. Cupiditate, maiores nihil reiciendis provident itaque praesentium eveniet ea nulla? Vel, assumenda.
			  </div>
			</div>
		  <div className={cn(styles.row, styles.no_gutters)}>
			  <div className={cn(styles.chat_bubble, styles.chat_bubble__right)}>
				Hello dude!
			  </div>
			</div>
		  <div className={cn(styles.row, styles.no_gutters)}>
			  <div className={cn(styles.chat_bubble, styles.chat_bubble__left)}>
				Hello dude!
			  </div>
			</div>
		  <div className={cn(styles.row, styles.no_gutters)}>
			  <div className={cn(styles.chat_bubble, styles.chat_bubble__left)}>
				Hello dude!
			  </div>
			</div>
		  <div className={cn(styles.row, styles.no_gutters)}>
			  <div className={cn(styles.chat_bubble, styles.chat_bubble__left)}>
				Lorem ipsum dolor, sit amet consectetur adipisicing elit. Similique, hic fugit suscipit possimus provident aut voluptatum numquam saepe dignissimos dolore perferendis facilis maiores magnam tempora sed impedit unde. Aut, veniam.
			  </div>
			</div>
		  <div className={cn(styles.row, styles.no_gutters)}>
			  <div className={cn(styles.chat_bubble, styles.chat_bubble__right)}>
				Hello dude!
			  </div>
			</div>
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
