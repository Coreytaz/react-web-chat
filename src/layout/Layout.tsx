/* eslint-disable react/display-name */
import React from 'react'
import { Footer, Header } from '../components'
import Toast from '../components/Toast/Toast'
import { useTypedSelector } from '../hooks/useTypedSelector'

interface LayoutProps {
  children: React.ReactNode
}
const Layout = React.memo(({ children }: LayoutProps): JSX.Element => {
  const { toastlist } = useTypedSelector((state) => state.toastSlice)

  return (
    <>
      <Header />
      <Toast position="top-right" toastlist={toastlist} />
      <div className="container">{children}
      </div>
      <Footer />
    </>
  )
})

export default Layout
