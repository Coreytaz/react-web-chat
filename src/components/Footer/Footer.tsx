import React from 'react'
import { ThemeButton } from '..'
import { useTheme } from '../../hooks/useTheme'
import styles from './Footer.module.scss'

const Footer = (): JSX.Element => {
  const { theme, setTheme } = useTheme()

  const changeTheme = (): void => {
    if (theme === 'light') {
      setTheme('dark')
    } else {
      setTheme('light')
    }
  }
  return (
    <footer className={styles.footer}>
      <h3>Copyright © УрФУ, 2022</h3>
      <ThemeButton appearance={theme === 'light' ? 'light' : 'dark'} onClick={changeTheme}/>
    </footer>
  )
}

export default Footer
