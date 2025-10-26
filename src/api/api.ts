import axios from 'axios'

const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
	},
})

// (опционально) можно добавить перехватчик ошибок
api.interceptors.response.use(
	(response) => response,
	(error) => {
		console.error('Ошибка API:', error?.response?.status, error?.message)
		return Promise.reject(error)
	},
)

export default api
