import { fileURLToPath, URL } from 'node:url'
import { defineConfig, type UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig(({ mode }) => {
	const isDev = mode === 'development'

	const config: UserConfig = {
		plugins: [vue(), isDev ? vueDevTools() : undefined].filter(Boolean) as any,

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
					rewrite: (path: string) => path.replace(/^\/api/, ''),
				},
			},
		},

		test: {
			globals: true,
			environment: 'jsdom',
		},
	}

	return config
})
