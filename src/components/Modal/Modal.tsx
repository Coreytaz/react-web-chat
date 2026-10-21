import type { ReactNode } from 'react'
import { useDialogFocus } from '../../hooks/useDialogFocus'
import { createPortal } from 'react-dom'
import Close from '../../assets/close.svg?react'
import styles from './Modal.module.scss'
export default function Modal({
  open,
  onClose,
  children
}: {
  open: boolean
  onClose: () => void
  children: ReactNode
}) {
  const dialog = useDialogFocus(open, onClose)
  if (!open) return null
  return createPortal(
    <>
      <div className={styles.modal_overlay} onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Просмотр изображения"
        tabIndex={-1}
        ref={dialog}
        className={styles.modal_window}
      >
        <button type="button" aria-label="Закрыть" className={styles.modal_close} onClick={onClose}>
          <Close />
        </button>
        {children}
      </div>
    </>,
    document.getElementById('modal') ?? document.body
  )
}
