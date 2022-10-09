/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React from 'react'
import style from './Header.module.scss'
import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'

const Header = (): JSX.Element => {
  const { auth, user } = useSelector((state: RootState) => state.authSlice)
  const location = useLocation()

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
                : <h3>{user?.email}</h3>}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
