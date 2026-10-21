import type { ReactNode } from 'react'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { render } from '@testing-library/react'
import authSlice, { authActions } from '../redux/slice/authSlice'
import toastSlice from '../redux/slice/toastSlice'
import userSlice from '../redux/slice/userSlice'
export const user = {
  _id: 'me',
  email: 'me@example.test',
  login: 'tester',
  username: 'Тест',
  avatar: null
}
export function harness(auth = true, path = '/') {
  const store = configureStore({ reducer: { authSlice, toastSlice, userSlice } })
  if (auth) store.dispatch(authActions.isAuth({ user }))
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity },
      mutations: { retry: false, gcTime: Infinity }
    }
  })
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={[path]}>
      <QueryClientProvider client={client}>
        <Provider store={store}>{children}</Provider>
      </QueryClientProvider>
    </MemoryRouter>
  )
  return {
    store,
    client,
    wrapper: Wrapper,
    render: (element: ReactNode) => render(element, { wrapper: Wrapper })
  }
}
