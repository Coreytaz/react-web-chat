import React from 'react'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import { Routes, Route } from 'react-router-dom'

import './style/index.scss'
import Layout from './layout/Layout'
import Auth from './pages/Auth'

function App (): JSX.Element {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}

export default App
