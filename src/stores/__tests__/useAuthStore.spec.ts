import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/useAuthStore'
import api from '@/api/api'

// Мокаем модуль api
vi.mock('@/api/api', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}))

describe('useAuthStore', () => {
  let store: ReturnType<typeof useAuthStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useAuthStore()
    vi.clearAllMocks()
  })

  // ────────────────────────────────
  // registerUser()
  // ────────────────────────────────
  it('успешно регистрирует пользователя', async () => {
    const userMock = { id: 1, name: 'John', email: 'john@mail.com' }
    vi.mocked(api.post).mockResolvedValueOnce({ data: userMock })

    const result = await store.registerUser({
      email: 'john@mail.com',
      password: '123456',
      name: 'John',
      surname: 'Doe',
    })

    expect(result).toBe(true)
    expect(store.user).toEqual(userMock)
    expect(store.error).toBeNull()
    expect(store.loading).toBe(false)
  })

  it('обрабатывает ошибку при регистрации', async () => {
    vi.mocked(api.post).mockRejectedValueOnce({
      response: { data: { message: 'Пользователь уже существует' } },
    })

    const result = await store.registerUser({
      email: 'exists@mail.com',
      password: '123456',
      name: 'Jane',
      surname: 'Doe',
    })

    expect(result).toBe(false)
    expect(store.error).toBe('Пользователь уже существует')
    expect(store.user).toBeNull()
    expect(store.loading).toBe(false)
  })

  // ────────────────────────────────
  // login()
  // ────────────────────────────────
  it('успешно логинит пользователя и вызывает fetchProfile', async () => {
    const userMock = { id: 2, name: 'Alex', email: 'alex@mail.com' }
    vi.mocked(api.post).mockResolvedValueOnce({}) // /auth/login
    vi.mocked(api.get).mockResolvedValueOnce({ data: userMock }) // /profile

    const result = await store.login({ email: 'alex@mail.com', password: 'qwerty' })

    expect(result).toBe(true)
    expect(store.user).toEqual(userMock)
    expect(api.post).toHaveBeenCalledExactlyOnceWith(
      '/auth/login',
      { email: 'alex@mail.com', password: 'qwerty' },
      { withCredentials: true },
    )
    expect(api.get).toHaveBeenCalledExactlyOnceWith('/profile', { withCredentials: true })
  })

  it('обрабатывает ошибку при логине', async () => {
    vi.mocked(api.post).mockRejectedValueOnce({
      response: { data: { message: 'Неверные данные' } },
    })

    const result = await store.login({ email: 'fail@mail.com', password: 'wrong' })

    expect(result).toBe(false)
    expect(store.error).toBe('Неверные данные')
    expect(store.user).toBeNull()
  })

  // ────────────────────────────────
  // logout()
  // ────────────────────────────────
  it('успешно выходит из аккаунта', async () => {
    store.user = { id: 5, name: 'Kate', email: 'kate@mail.com' }
    vi.mocked(api.get).mockResolvedValueOnce({}) // /auth/logout

    await store.logout()

    expect(api.get).toHaveBeenCalledExactlyOnceWith('/auth/logout', { withCredentials: true })
    expect(store.user).toBeNull()
    expect(store.error).toBeNull()
  })

  it('обрабатывает ошибку при logout', async () => {
    vi.mocked(api.get).mockRejectedValueOnce({
      response: { data: { message: 'Ошибка выхода' } },
    })

    await store.logout()

    expect(store.error).toBe('Ошибка выхода')
    expect(store.loading).toBe(false)
  })

  // ────────────────────────────────
  // fetchProfile()
  // ────────────────────────────────
  it('успешно получает профиль', async () => {
    const userMock = { id: 3, name: 'Bob', email: 'bob@mail.com' }
    vi.mocked(api.get).mockResolvedValueOnce({ data: userMock })

    await store.fetchProfile()

    expect(store.user).toEqual(userMock)
    expect(store.error).toBeNull()
  })

  it('устанавливает user = null, если запрос профиля неуспешен', async () => {
    vi.mocked(api.get).mockRejectedValueOnce(new Error('Unauthorized'))

    await store.fetchProfile()

    expect(store.user).toBeNull()
    expect(store.loading).toBe(false)
  })

  // ────────────────────────────────
  // getters
  // ────────────────────────────────
  it('isAuthenticated возвращает true, если user задан', () => {
    store.user = { id: 99, name: 'Test' } as any
    expect(store.isAuthenticated).toBe(true)
  })

  it('isAuthenticated возвращает false, если user = null', () => {
    store.user = null
    expect(store.isAuthenticated).toBe(false)
  })
})
