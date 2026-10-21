import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import cn from 'classnames'
import type { SessionUser } from '../../types/User.interface'
import { useLogout } from '../../hooks/auth/useLogout'
import { useDismissPopup } from '../../hooks/useDismissPopup'
import UserBlock from '../UserBlock/UserBlock'
import Exit from '../../assets/Exit.svg?react'
import Profile from '../../assets/Profile.svg?react'
import Friends from '../../assets/friends.svg?react'
import style from './Header.module.scss'
export default function UserMenu({ user }: { user: SessionUser }) {
  const [popup, setPopup] = useState(false)
  const sortRef = useRef<HTMLLIElement>(null)
  const { asyncLogout, isLoading } = useLogout()
  useDismissPopup(sortRef, popup, () => setPopup(false))
  return (
    <li className={cn(style.message_dropdown, { [style.active]: popup })} ref={sortRef}>
      <button
        type="button"
        className={style.user}
        aria-label="Меню пользователя"
        aria-expanded={popup}
        aria-controls="user-dropdown"
        onClick={() => setPopup(!popup)}
      >
        <UserBlock {...user} />
      </button>
      {popup && (
        <div id="user-dropdown" className={style.message_dropdown_content}>
          <Link to="/profile" onClick={() => setPopup(false)}>
            <Profile /> Профиль
          </Link>
          <Link to="/friends" onClick={() => setPopup(false)}>
            <Friends /> Друзья
          </Link>
          <button type="button" disabled={isLoading} onClick={asyncLogout}>
            <Exit /> Выход
          </button>
        </div>
      )}
    </li>
  )
}
