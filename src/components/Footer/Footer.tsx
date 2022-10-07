import React from 'react'
import { Button } from '..'
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
      <Button appearance="primary" onClick={changeTheme}>
        Сменить тему
      </Button>
    </footer>
  )
}

export default Footer
