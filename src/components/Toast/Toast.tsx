import type { ToastItem } from '../../redux/slice/toastSlice'
import ToastNotification from './ToastNotification'
import styles from './Toast.module.scss'
export type ToastPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
interface ToastProps {
  toastlist: ToastItem[]
  position: ToastPosition
}
export default function Toast({ position, toastlist }: ToastProps) {
  return (
    <div className={styles.container}>
      {toastlist.map((toast) => (
        <ToastNotification key={toast.id} {...toast} position={position} />
      ))}
    </div>
  )
}
