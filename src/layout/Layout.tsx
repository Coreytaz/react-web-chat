import type { ReactNode } from 'react'
import Footer from '../components/Footer/Footer'
import Header from '../components/Header/Header'
import Toast from '../components/Toast/Toast'
import { useTypedSelector } from '../hooks/useTypedSelector'
export default function Layout({ children }: { children: ReactNode }) {
  const toasts = useTypedSelector((state) => state.toastSlice.toastlist)
  return (
    <>
      <Header />
      <Toast position="top-right" toastlist={toasts} />
      <div className="container">{children}</div>
      <Footer />
    </>
  )
}
