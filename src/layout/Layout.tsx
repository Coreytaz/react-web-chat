import React from 'react'
import Header from '../components/Header/Header'

type LayoutProps = {
    children: React.ReactNode
}
const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <>
            <Header />
            <div>{children}</div>
        </>
    )
}

export default Layout;