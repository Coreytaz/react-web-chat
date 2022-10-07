import React from 'react'
import styles from './theme-button.module.scss'
import cn from 'classnames'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  appearance?: 'light' | 'dark'
}

const ThemeButton: React.FC<ButtonProps> = ({
  children,
  className,
  appearance,
  ...props
}) => {
  return (
      <button
        className={cn(styles.button, className, {
          [styles.light]: appearance === 'light',
          [styles.dark]: appearance === 'dark'
        })}
        {...props}
      >
        {children}
      </button>
  )
}

export default ThemeButton
