import { useLayoutEffect, useState } from 'react'
type Theme = 'light' | 'dark'
export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const stored = localStorage.getItem('theme')
      if (stored === 'light' || stored === 'dark') return stored
    } catch {
      /* Storage may be disabled by the browser. */
    }
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })
  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      localStorage.setItem('theme', theme)
    } catch {
      /* Theme remains usable without storage. */
    }
  }, [theme])
  return { theme, setTheme }
}
