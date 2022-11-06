import React from 'react'
import styles from './Toast.module.scss'
import TostList from './TostList'

export interface toastList {
  id: string
  title: string
  description: string
  backgroundColor: string
}

interface ToastProps {
  toastlist: toastList[]
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

const Toast: React.FC<ToastProps> = ({ position, toastlist }) => {
  return (
    <div className={`${styles.container}`}>
      {
        toastlist.map((toast) => (
          <TostList key={toast.id} {...toast} position={position}/>
        ))
      }
    </div>
  )
}

export default Toast
