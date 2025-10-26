import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import axios from 'axios'

// Проверка соединения с API при старте dev-сервера
async function checkApiConnection() {
	try {
		const res = await axios.get('https://cinemaguide.skillbox.cc/api/movies', { timeout: 3000 })
		console.log(`✅ API доступен (${res.status})`)
	} catch (error) {
		console.warn('⚠️  Не удалось подключиться к API https://cinemaguide.skillbox.cc')
		if (error.code === 'ECONNREFUSED' || error.message.includes('ENOTFOUND')) {
			console.warn('Проверь, что у тебя есть интернет или сервер доступен.')
		}
	}
}

export default defineConfig(async () => {
	if (process.env.NODE_ENV === 'development') {
		await checkApiConnection()
	}

	return {
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
					target: 'https://cinemaguide.skillbox.cc',
					changeOrigin: true,
					secure: false,
					rewrite: (path) => path.replace(/^\/api/, ''),
				},
			},
		},
		test: {
			globals: true,
			environment: 'jsdom',
		},
	}
})
