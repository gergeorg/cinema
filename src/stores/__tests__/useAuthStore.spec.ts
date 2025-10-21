import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Mock } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/useAuthStore'
import api from '@/api/api'

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

  it('успешно регистрирует пользователя', async () => {
  const userMock: { id: number; name: string; email: string; surname: string } = { id: 1, name: 'John', email: 'john@mail.com', surname: 'Doe' }
    const mockPost = api.post as Mock
    mockPost.mockResolvedValueOnce({ data: userMock })

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
    (api.post as Mock).mockRejectedValueOnce({
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

  it('успешно логинит пользователя и вызывает fetchProfile', async () => {
  const userMock: { id: number; name: string; email: string; surname: string } = { id: 2, name: 'Alex', email: 'alex@mail.com', surname: 'Smith' }
    const mockPost = api.post as Mock
    mockPost.mockResolvedValueOnce({})
    const mockGet = api.get as Mock
    mockGet.mockResolvedValueOnce({ data: userMock })

    const result = await store.login({ email: 'alex@mail.com', password: 'qwerty' })

    expect(result).toBe(true)
    expect(store.user).toEqual(userMock)
  expect((mockPost as Mock).mock.calls.length).toBeGreaterThan(0)
  expect((mockPost as Mock).mock.calls[0]![0]).toBe('/auth/login')
  expect((mockPost as Mock).mock.calls[0]![1]).toEqual({ email: 'alex@mail.com', password: 'qwerty' })
  expect((mockPost as Mock).mock.calls[0]![2]).toEqual({ withCredentials: true })
  expect((mockGet as Mock).mock.calls.length).toBeGreaterThan(0)
  expect((mockGet as Mock).mock.calls[0]![0]).toBe('/profile')
  expect((mockGet as Mock).mock.calls[0]![1]).toEqual({ withCredentials: true })
  })

  it('обрабатывает ошибку при логине', async () => {
    const mockPost = api.post as Mock
    mockPost.mockRejectedValueOnce({
      response: { data: { message: 'Неверные данные' } },
    })

    const result = await store.login({ email: 'fail@mail.com', password: 'wrong' })

    expect(result).toBe(false)
    expect(store.error).toBe('Неверные данные')
    expect(store.user).toBeNull()
  })

  it('успешно выходит из аккаунта', async () => {
  store.user = { id: 5, name: 'Kate', email: 'kate@mail.com', surname: 'Johnson' }
  const mockGet = api.get as Mock
  mockGet.mockResolvedValueOnce({})

    await store.logout()

  expect((mockGet as Mock).mock.calls.length).toBeGreaterThan(0)
  expect((mockGet as Mock).mock.calls[0]![0]).toBe('/auth/logout')
  expect((mockGet as Mock).mock.calls[0]![1]).toEqual({ withCredentials: true })
    expect(store.user).toBeNull()
    expect(store.error).toBeNull()
  })

  it('обрабатывает ошибку при logout', async () => {
    const mockGet = api.get as Mock
    mockGet.mockRejectedValueOnce({
      response: { data: { message: 'Ошибка выхода' } },
    })

    await store.logout()

    expect(store.error).toBe('Ошибка выхода')
    expect(store.loading).toBe(false)
  })

  it('успешно получает профиль', async () => {
  const userMock: { id: number; name: string; email: string; surname: string } = { id: 3, name: 'Bob', email: 'bob@mail.com', surname: 'Builder' }
  const mockGet = api.get as Mock
  mockGet.mockResolvedValueOnce({ data: userMock })

    await store.fetchProfile()

    expect(store.user).toEqual(userMock)
    expect(store.error).toBeNull()
  })

  it('устанавливает user = null, если запрос профиля неуспешен', async () => {
  const mockGet = api.get as Mock
  mockGet.mockRejectedValueOnce(new Error('Unauthorized'))

    await store.fetchProfile()

    expect(store.user).toBeNull()
    expect(store.loading).toBe(false)
  })

  it('isAuthenticated возвращает true, если user задан', () => {
  store.user = { id: 99, name: 'Test', email: 'test@mail.com', surname: 'T' }
    expect(store.isAuthenticated).toBe(true)
  })

  it('isAuthenticated возвращает false, если user = null', () => {
    store.user = null
    expect(store.isAuthenticated).toBe(false)
  })
})
