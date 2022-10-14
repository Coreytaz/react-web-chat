import React from 'react'

export const useTheme = (): {
  theme: string
  setTheme: React.Dispatch<React.SetStateAction<string>>
} => {
  const [theme, setTheme] = React.useState(String(localStorage.getItem('theme')))

  React.useLayoutEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  return { theme, setTheme }
}
