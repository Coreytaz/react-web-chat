import React from 'react'
import { useAction } from '../../hooks/useAction'
import { toastList } from './Toast'
import styles from './Toast.module.scss'

interface ToastList extends toastList {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

const TostList: React.FC<ToastList> = ({ id, position, backgroundColor, description, title }) => {
  const { deleteList } = useAction()
  const deleteToast = React.useCallback((id: string): void => {
    deleteList(id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      deleteToast(id)
    }, 3500)

    return () => {
      clearTimeout(timeout)
    }
  }, [deleteToast, id])
  return (
    <div
    onClick={() => deleteToast(id)}
    className={`${styles.notification} ${styles.toast} ${styles[position]}`}
    style={{ backgroundColor }}
  >
    <button>X</button>
    <div>
      <p className={styles.title}>{title}</p>
      <p className={styles.description}>{description}</p>
    </div>
  </div>
  )
}

export default TostList
