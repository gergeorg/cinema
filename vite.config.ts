import { fileURLToPath, URL } from 'node:url'
import { defineConfig, type UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import axios from 'axios'

async function getConfig(mode: string): Promise<UserConfig> {
	// Проверка API только в dev
	if (mode === 'development') {
		try {
			const res = await axios.get('https://cinemaguide.skillbox.cc/api/movies', { timeout: 3000 })
			console.log(`✅ API доступен (${res.status})`)
		} catch {
			console.warn('⚠️  Не удалось подключиться к API https://cinemaguide.skillbox.cc')
		}
	}

	// Динамическая загрузка vueDevTools
	const devPlugins = []
	if (mode === 'development') {
		const { default: vueDevTools } = await import('vite-plugin-vue-devtools')
		devPlugins.push(vueDevTools())
	}

	return {
		plugins: [vue(), ...devPlugins],
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
					rewrite: (path: string) => path.replace(/^\/api/, ''),
				},
			},
		},
		test: {
			globals: true,
			environment: 'jsdom',
		},
	}
}

export default defineConfig(async ({ mode }) => await getConfig(mode))
