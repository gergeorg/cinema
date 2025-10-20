import { defineStore } from 'pinia'
import api from '@/api/api'
import type { IAuthState, IUser, ILoginPayload, IRegisterPayload } from '@/types'

export const useAuthStore = defineStore('auth', {
  state: (): IAuthState => ({
    user: null,
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state): boolean => !!state.user,
  },

  actions: {
    // --- Регистрация пользователя ---
    async registerUser(payload: IRegisterPayload): Promise<boolean> {
      this.loading = true
      this.error = null

      try {
        const res = await api.post<IUser>(
          '/user',
          {
            email: payload.email,
            password: payload.password,
            name: payload.name,
            surname: payload.surname,
          },
          { withCredentials: true }
        )

        this.user = res.data
        return true
      } catch (err: unknown) {
        if (typeof err === 'object' && err !== null && 'response' in err) {
          const axiosErr = err as { response?: { data?: { message?: string } } }
          this.error = axiosErr.response?.data?.message || 'Ошибка регистрации'
        } else {
          this.error = 'Ошибка регистрации'
        }
        return false
      } finally {
        this.loading = false
      }
    },

    // --- Логин пользователя ---
    async login({ email, password }: ILoginPayload): Promise<boolean> {
      this.loading = true
      this.error = null

      try {
        await api.post('/auth/login', { email, password }, { withCredentials: true })
        await this.fetchProfile()
        return true
      } catch (err: unknown) {
        if (typeof err === 'object' && err !== null && 'response' in err) {
          const axiosErr = err as { response?: { data?: { message?: string } } }
          this.error = axiosErr.response?.data?.message || 'Не верный логин или пароль'
        } else {
          this.error = 'Не верный логин или пароль'
        }
        return false
      } finally {
        this.loading = false
      }
    },

    // --- Выход из системы ---
    async logout(): Promise<void> {
      this.loading = true
      this.error = null

      try {
        await api.get('/auth/logout', { withCredentials: true })
        this.user = null
      } catch (err: unknown) {
        if (typeof err === 'object' && err !== null && 'response' in err) {
          const axiosErr = err as { response?: { data?: { message?: string } } }
          this.error = axiosErr.response?.data?.message || 'Ошибка при выходе'
        } else {
          this.error = 'Ошибка при выходе'
        }
      } finally {
        this.loading = false
      }
    },

    // --- Получение профиля ---
    async fetchProfile(): Promise<void> {
      this.loading = true
      this.error = null

      try {
        const res = await api.get<IUser>('/profile', { withCredentials: true })
        this.user = res.data
      } catch {
        this.user = null // cookie истекла
      } finally {
        this.loading = false
      }
    },
  },
})
