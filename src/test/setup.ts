import '@testing-library/jest-dom/vitest'
import { afterEach, beforeAll, afterAll, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import { setupServer } from 'msw/node'
import api from '../service/api.service'
export const server = setupServer()
api.defaults.baseURL = 'http://localhost/api/'
beforeAll(() => server.listen({ onUnhandledFrame: 'error' }))
afterEach(() => {
  cleanup()
  server.resetHandlers()
  if (typeof document !== 'undefined') {
    document.cookie = 'tokenIncd=; Max-Age=0; Path=/'
    localStorage.clear()
  }
})
afterAll(() => server.close())
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn((query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    }))
  })
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', { value: vi.fn(), writable: true })
  class Observer {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  vi.stubGlobal('IntersectionObserver', Observer)
  Object.defineProperty(URL, 'createObjectURL', {
    value: vi.fn(() => 'blob:preview'),
    writable: true
  })
  Object.defineProperty(URL, 'revokeObjectURL', { value: vi.fn(), writable: true })
}
