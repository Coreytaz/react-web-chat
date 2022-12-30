import { FC } from 'react'
import { createPortal } from 'react-dom'
import { ReactComponent as Close } from '../../assets/close.svg'
import styles from './Modal.module.scss'

interface ModalProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
}

const Modal: FC<ModalProps> = ({ open, children, onClose }) => {
  if (!open) return null

  return createPortal(
    <>
        <div className={styles.modal_overlay} onClick={onClose} />
        <div className={styles.modal_window}>
            <Close className={styles.modal_close} onClick={onClose}/>
            {children}
        </div>
    </>
    , document.getElementById('modal') as Element)
}

export default Modal
