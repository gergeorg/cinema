import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Подключаем devtools только в dev-режиме
const plugins = [vue()]
if (process.env.NODE_ENV === 'development') {
  const vueDevTools = require('vite-plugin-vue-devtools').default
  plugins.push(vueDevTools())
}

export default defineConfig({
  plugins,
  define: {
    __VUE_PROD_DEVTOOLS__: false,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  test: {
    globals: true,
    environment: 'jsdom'
  }
})
