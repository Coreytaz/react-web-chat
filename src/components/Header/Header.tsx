import { Link, useLocation } from 'react-router-dom'
import { useTypedSelector } from '../../hooks/useTypedSelector'
import UserMenu from './UserMenu'
import styles from './Header.module.scss'
export default function Header() {
  const { auth, user } = useTypedSelector((state) => state.authSlice)
  const registering = useLocation().pathname === '/auth'
  return (
    <header>
      <div className="container">
        <div className={styles.header__inner}>
          <div className={styles.logo}>
            <Link to="/">
              <h2>
                React <span>Chat</span>
              </h2>
            </Link>
          </div>
          <nav className={styles.nav}>
            <ul>
              {auth ? (
                <UserMenu user={user} />
              ) : (
                <li>
                  <Link to={registering ? '/' : '/auth'}>
                    {registering ? 'Авторизация' : 'Регистрация'}
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}
