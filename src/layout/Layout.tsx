import React from 'react'
import { useSelector } from 'react-redux'
import { Footer, Header } from '../components'
import Toast from '../components/Toast/Toast'
import { RootState } from '../redux/store'

interface LayoutProps {
  children: React.ReactNode
}
const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { toastlist } = useSelector((state: RootState) => state.toastSlice)

  return (
    <>
      <Header />
      <Toast position="top-right" toastlist={toastlist} />
      <div className="container">{children}
      </div>
      <Footer />
    </>
  )
}

export default Layout
