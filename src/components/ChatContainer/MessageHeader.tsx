import UserBlock from '../UserBlock/UserBlock'
import { useRef, useState } from 'react'
import { useDismissPopup } from '../../hooks/useDismissPopup'
import type { PublicUser } from '../../types/User.interface'
import { useTypedSelector } from '../../hooks/useTypedSelector'
import socket from '../../service/chat/socket.service'
import styles from './ChatContainer.module.scss'
import Trash from './Trash.svg?react'
import Point from '../../assets/point.svg'
export default function MessageHeader({ user }: { user: PublicUser }) {
  const from = useTypedSelector((s) => s.authSlice.user._id)
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  useDismissPopup(menuRef, open, () => setOpen(false))
  return (
    <div className={styles.mesage_header}>
      <div className={styles.message_user}>
        <UserBlock {...user} />
      </div>
      <div className={styles.message_dropdown} ref={menuRef}>
        <button
          type="button"
          className={styles.message_menu_trigger}
          aria-label="Действия с перепиской"
          aria-expanded={open}
          aria-controls="conversation-dropdown"
          onClick={() => setOpen(!open)}
        >
          <img src={Point} alt="" className={styles.dropBtn} />
        </button>
        {open && (
          <div id="conversation-dropdown" className={styles.message_dropdown_content}>
            <button
              type="button"
              onClick={() => {
                socket.emit('messages:clear', { from, to: user._id })
                setOpen(false)
              }}
            >
              Удалить мои сообщения <Trash />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
