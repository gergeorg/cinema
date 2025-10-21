import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useFavoritesStore } from '../useFavoritesStore'
import { useMoviesStore } from '../useMoviesStore'

// Мокаем api-модуль
vi.mock('@/api/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}))

// Импортируем замоканный api
import api from '@/api/api'

// Мокаем зависимый store useMoviesStore
vi.mock('../useMoviesStore', () => ({
  useMoviesStore: vi.fn(),
}))

describe('useFavoritesStore', () => {
  let store: ReturnType<typeof useFavoritesStore>
  let moviesStoreMock: { allMovies: any[] }

  beforeEach(() => {
    setActivePinia(createPinia())

    // Подделываем moviesStore
    moviesStoreMock = { allMovies: [] }
    ;(useMoviesStore as unknown as vi.Mock).mockReturnValue(moviesStoreMock)

    store = useFavoritesStore()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  // --- extractResponseData ---
  it('extractResponseData возвращает data из объекта ответа', () => {
    const err = { response: { data: { message: 'Ошибка' } } } as any
    const result = store.extractResponseData(err)
    expect(result).toEqual({ message: 'Ошибка' })
  })

  it('extractResponseData возвращает undefined при некорректном ответе', () => {
    const result = store.extractResponseData(undefined)
    expect(result).toBeUndefined()
  })

  // --- getErrorMessage ---
  it('getErrorMessage возвращает строку из data, если data — строка', () => {
    const err = { response: { data: 'Ошибка сервера' } } as any
    const result = store.getErrorMessage(err)
    expect(result).toBe('Ошибка сервера')
  })

  it('getErrorMessage возвращает сообщение ошибки, если нет data', () => {
    const err = { message: 'Что-то пошло не так' } as any
    const result = store.getErrorMessage(err)
    expect(result).toBe('Что-то пошло не так')
  })

  // --- fetchFavorites ---
  it('fetchFavorites загружает избранные фильмы и сохраняет их в состоянии', async () => {
    ;(api.get as vi.Mock).mockResolvedValueOnce({
      data: [
        { id: 1, title: 'Movie 1' },
        { id: 2, title: 'Movie 2' },
      ],
    })

    await store.fetchFavorites()

    expect(store.favorites).toEqual(['1', '2'])
    expect(moviesStoreMock.allMovies).toHaveLength(2)
    expect(store.error).toBeNull()
    expect(store.loading).toBe(false)
  })

  it('fetchFavorites обрабатывает ошибку корректно', async () => {
    ;(api.get as vi.Mock).mockRejectedValueOnce({ message: 'Ошибка сети' })

    await store.fetchFavorites()

    expect(store.error).toBe('Ошибка сети')
    expect(store.favorites).toEqual([])
    expect(store.loading).toBe(false)
  })

  // --- addFavorite ---
  it('addFavorite добавляет фильм в избранное', async () => {
    ;(api.post as vi.Mock).mockResolvedValueOnce({ data: {} })
    store.favorites = ['1']

    await store.addFavorite(2)

    expect(api.post).toHaveBeenCalledExactlyOnceWith(
      '/favorites',
      expect.any(URLSearchParams),
      expect.objectContaining({
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
    )
    expect(store.favorites).toContain('2')
  })

  it('addFavorite сохраняет ошибку при неудаче', async () => {
    ;(api.post as vi.Mock).mockRejectedValueOnce({ message: 'Ошибка запроса' })

    await store.addFavorite(123)
    expect(store.error).toBe('Ошибка запроса')
  })

  // --- removeFavorite ---
  it('removeFavorite удаляет фильм из избранного', async () => {
    ;(api.delete as vi.Mock).mockResolvedValueOnce({})
    store.favorites = ['1', '2', '3']

    await store.removeFavorite(2)
    expect(store.favorites).toEqual(['1', '3'])
  })

  it('removeFavorite сохраняет ошибку при неудаче', async () => {
    ;(api.delete as vi.Mock).mockRejectedValueOnce({ message: 'Ошибка удаления' })
    store.favorites = ['1']

    await store.removeFavorite(1)
    expect(store.error).toBe('Ошибка удаления')
  })

  // --- toggleFavorite ---
  it('toggleFavorite вызывает addFavorite, если фильма нет в избранном', async () => {
    const addSpy = vi.spyOn(store, 'addFavorite').mockResolvedValueOnce()
    const removeSpy = vi.spyOn(store, 'removeFavorite').mockResolvedValueOnce()

    store.favorites = ['1']
    await store.toggleFavorite(2)

    expect(addSpy).toHaveBeenCalledExactlyOnceWith(2)
    expect(removeSpy).not.toHaveBeenCalled()
  })

  it('toggleFavorite вызывает removeFavorite, если фильм есть в избранном', async () => {
    const addSpy = vi.spyOn(store, 'addFavorite').mockResolvedValueOnce()
    const removeSpy = vi.spyOn(store, 'removeFavorite').mockResolvedValueOnce()

    store.favorites = ['1']
    await store.toggleFavorite(1)

    expect(removeSpy).toHaveBeenCalledExactlyOnceWith(1)
    expect(addSpy).not.toHaveBeenCalled()
  })
})
