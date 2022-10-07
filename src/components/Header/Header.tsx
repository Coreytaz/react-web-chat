import React from 'react'
import style from './Header.module.scss'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../../hooks/useTheme'
import Button from '../UI/Button/Button'

const Header = (): JSX.Element => {
  const location = useLocation()
  const { theme, setTheme } = useTheme()

  const changeTheme = (): void => {
    if (theme === 'light') {
      setTheme('dark')
    } else {
      setTheme('light')
    }
  }

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
            <Button appearance="primary" onClick={changeTheme}>
        Сменить тему
      </Button>
          </div>
          <nav className={style.nav}>
            <ul>
              {location.pathname !== '/auth' && (
                <li>
                  <Link to="/auth">Регистрация</Link>
                </li>
              )}
              {location.pathname !== '/' && (
                <li>
                  <Link to="/">Авторизация</Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
