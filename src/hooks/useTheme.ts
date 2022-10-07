import React from 'react'

export const useTheme = (): {
  theme: string
  setTheme: React.Dispatch<React.SetStateAction<string>>
} => {
  const [theme, setTheme] = React.useState('light')

  React.useLayoutEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return { theme, setTheme }
}
