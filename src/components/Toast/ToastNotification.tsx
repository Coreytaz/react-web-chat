import { useEffect } from 'react'
import cn from 'classnames'
import { useAction } from '../../hooks/useAction'
import type { ToastItem } from '../../redux/slice/toastSlice'
import type { ToastPosition } from './Toast'
import styles from './Toast.module.scss'
interface ToastNotificationProps extends ToastItem {
  position: ToastPosition
}
export default function ToastNotification({
  id,
  position,
  backgroundColor,
  description,
  title
}: ToastNotificationProps) {
  const { deleteList } = useAction()
  useEffect(() => {
    const timeout = setTimeout(() => deleteList(id), 3500)
    return () => clearTimeout(timeout)
  }, [deleteList, id])
  return (
    <div
      onClick={() => deleteList(id)}
      className={cn(styles.notification, styles.toast, styles[position])}
      style={{ backgroundColor }}
    >
      <button type="button" aria-label="Закрыть уведомление">
        X
      </button>
      <div>
        <p className={styles.title}>{title}</p>
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  )
}
