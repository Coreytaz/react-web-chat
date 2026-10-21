import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import store from './redux/store'
import { queryClient } from './service/query'
import './style/index.scss'
const root = document.getElementById('root')
if (!root) throw new Error('Root element is missing')
createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <App />
        </Provider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
)
