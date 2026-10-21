import type { ButtonHTMLAttributes } from 'react'
import cn from 'classnames'
import styles from './Button.module.scss'
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  appearance?: 'primary' | 'ghost'
}
export default function Button({ className, appearance, ...props }: ButtonProps) {
  return (
    <button className={cn(styles.button, className, appearance && styles[appearance])} {...props} />
  )
}
