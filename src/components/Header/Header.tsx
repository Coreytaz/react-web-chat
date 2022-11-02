/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React from 'react'
import style from './Header.module.scss'
import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { useLogout } from '../../hooks/auth/useLogout'
import Avatar from '../../assets/defaultAvatar.jpg'
import { ReactComponent as Exit } from '../../assets/Exit.svg'
import { ReactComponent as Profile } from '../../assets/Profile.svg'
import cn from 'classnames'

type PopupClick = MouseEvent & {
  path: Node[]
}

const Header = (): JSX.Element => {
  const [popup, setPopup] = React.useState(false)
  const { auth, user } = useSelector((state: RootState) => state.authSlice)
  const sortRef = React.useRef<HTMLDivElement>(null)
  const { asyncLogout } = useLogout()
  const location = useLocation()

  const onLogout = (): void => {
    void asyncLogout()
  }

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      const _event = event as PopupClick
      if (sortRef.current && !_event.path.includes(sortRef.current)) {
        setPopup(false)
      }
    }

    document.body.addEventListener('click', handleClickOutside)

    return () => {
      document.body.removeEventListener('click', handleClickOutside)
    }
  }, [])

  return (
    <header>
      <div className="container">
        <div className={style.header__inner}>
          <div className={style.logo}>
            <Link to="/">
              <h2>
                React <span>Chat</span>
              </h2>
            </Link>
          </div>
          <nav className={style.nav}>
            <ul>
              {!auth
                ? (location.pathname !== '/auth'
                    ? (
                  <li>
                    <Link to="/auth">Регистрация</Link>
                  </li>
                      )
                    : (
                  <li>
                    <Link to="/">Авторизация</Link>
                  </li>
                      ))

                : <div className={cn(style.message_dropdown, { [style.active]: popup })} ref={sortRef} onClick={() => setPopup(!popup)}>
                      <div className={style.user}><img src={user?.avatar !== null ? user?.avatar : Avatar} alt="avatar" />
                    <p>{user?.username}</p></div>
                        {popup && <div className={style.message_dropdown_content}>
                       <Link to="/profile"><Profile/> Профиль</Link>
                       <a onClick={() => onLogout()}><Exit/> Выход</a>
                    </div>}
                    </div> }
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
