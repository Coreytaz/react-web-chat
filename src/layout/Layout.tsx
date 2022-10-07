import React from 'react'
import { Footer, Header } from '../components'

interface LayoutProps {
  children: React.ReactNode
}
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <div className="container">{children}</div>
      <Footer />
    </>
  )
}

export default Layout
