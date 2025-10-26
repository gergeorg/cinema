import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
	plugins: [vue(), vueDevTools()],
	define: {
		__VUE_PROD_DEVTOOLS__: false,
	},
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
	server: {
		proxy: {
			'/api': {
				target: 'https://cinemaguide.skillbox.cc/',
				changeOrigin: true,
				secure: true,
				rewrite: (path) => path.replace(/^\/api/, ''),
			},
		},
	},
	test: {
		globals: true,
		environment: 'jsdom',
	},
})
