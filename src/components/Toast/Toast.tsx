import React, { useCallback } from 'react'
import { deleteList } from '../../redux/slice/toastSlice'
import { useAppDispatch } from '../../redux/store'
import styles from './Toast.module.scss'

interface toastList {
  id: number
  title: string
  description: string
  backgroundColor: string
}

interface ToastProps {
  toastlist: toastList[]
  position: 'top-left' | 'top-right' | 'buttom-left' | 'buttom-right'
  setList: any
}

const Toast: React.FC<ToastProps> = ({ position, toastlist, setList }) => {
  const dispatch = useAppDispatch()
  const deleteToast = useCallback((id: any): void => {
    dispatch(deleteList(id))
  }, [dispatch])

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (toastlist.length > 0) {
        deleteToast(toastlist[0].id)
      }
    }, 3000)

    return () => {
      clearInterval(interval)
    }
  }, [toastlist, deleteToast])

  return (
    <div className={`${styles.container} ${styles[position]}`}>
      {
        toastlist.map((toast, i) => (
          <div
            onClick={() => deleteToast(toast.id)}
            key={toast.id}
            className={`${styles.notification} ${styles.toast} ${styles[position]}`}
            style={{ backgroundColor: toast.backgroundColor }}
          >
            <button>X</button>
            <div>
              <p className={styles.title}>{toast.title}</p>
              <p className={styles.description}>{toast.description}</p>
            </div>
          </div>
        ))
      }
    </div>
  )
}

export default Toast
