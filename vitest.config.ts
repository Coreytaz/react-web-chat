import { defineConfig, mergeConfig } from 'vitest/config'
import vite from './vite.config.ts'
export default mergeConfig(
  typeof vite === 'function' ? vite({ mode: 'test', command: 'serve' }) : vite,
  defineConfig({
    test: { environment: 'jsdom', setupFiles: ['./src/test/setup.ts'], restoreMocks: true }
  })
)
