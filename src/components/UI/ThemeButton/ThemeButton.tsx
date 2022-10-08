import React from 'react'
import styles from './ThemeButton.module.scss'
import cn from 'classnames'
import Dark from './dark.svg'
import Light from './light.svg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  appearance?: 'light' | 'dark'
}

const ThemeButton: React.FC<ButtonProps> = ({
  children,
  className,
  appearance,
  ...props
}) => {
  return (
    <div className={styles.toggle}>
      <button
        className={cn(styles.button)}
        {...props}
      >
        <img className={cn(styles.theme, {
          [styles.dark]: appearance === 'dark'
        })} src={Dark} alt="Dark" />
        <img className={cn(styles.theme, {
          [styles.dark]: appearance === 'light'
        })} src={Light} alt="Light" />
      </button>
      </div>
  )
}

export default ThemeButton
