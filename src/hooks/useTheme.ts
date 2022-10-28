import React from 'react'

export const useTheme = (): {
  theme: string
  setTheme: React.Dispatch<React.SetStateAction<string>>
} => {
  const [theme, setTheme] = React.useState(localStorage.getItem('theme') !== null
    ? String(localStorage.getItem('theme'))
    : window.matchMedia?.('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light')

  React.useLayoutEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  return { theme, setTheme }
}
