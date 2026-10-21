import ThemeButton from '../UI/ThemeButton/ThemeButton'
import { useTheme } from '../../hooks/useTheme'
import styles from './Footer.module.scss'

export default function Footer() {
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
      <ThemeButton
        aria-label="Переключить тему"
        appearance={theme === 'light' ? 'light' : 'dark'}
        onClick={changeTheme}
      />
    </footer>
  )
}
