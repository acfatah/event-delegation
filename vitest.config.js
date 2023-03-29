import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    include: ['src/**/*.spec.js'],
    environment: 'jsdom'
  },
})
