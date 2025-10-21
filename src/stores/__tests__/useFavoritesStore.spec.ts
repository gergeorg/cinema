import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { Mock } from 'vitest'
import type { AxiosError } from 'axios'
import { setActivePinia, createPinia } from 'pinia'
import { useFavoritesStore } from '../useFavoritesStore'
import { useMoviesStore } from '../useMoviesStore'

vi.mock('@/api/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}))

import api from '@/api/api'

vi.mock('../useMoviesStore', () => ({
  useMoviesStore: vi.fn(),
}))

describe('useFavoritesStore', () => {
  let store: ReturnType<typeof useFavoritesStore>
  let moviesStoreMock: { allMovies: Array<Record<string, unknown>> }

  beforeEach(() => {
    setActivePinia(createPinia())
    moviesStoreMock = { allMovies: [] }
    const useMoviesMock = useMoviesStore as unknown as Mock
    useMoviesMock.mockReturnValue(moviesStoreMock)

    store = useFavoritesStore()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('extractResponseData возвращает data из объекта ответа', () => {
  const err = { response: { data: { message: 'Ошибка' } } } as unknown as AxiosError
  const result = store.extractResponseData(err)
    expect(result).toEqual({ message: 'Ошибка' })
  })

  it('extractResponseData возвращает undefined при некорректном ответе', () => {
  const result = store.extractResponseData(undefined)
    expect(result).toBeUndefined()
  })

  it('getErrorMessage возвращает строку из data, если data — строка', () => {
  const err = { response: { data: 'Ошибка сервера' } } as unknown as AxiosError
  const result = store.getErrorMessage(err)
    expect(result).toBe('Ошибка сервера')
  })

  it('getErrorMessage возвращает сообщение ошибки, если нет data', () => {
  const err = { message: 'Что-то пошло не так' } as unknown as AxiosError
  const result = store.getErrorMessage(err)
    expect(result).toBe('Что-то пошло не так')
  })

  it('fetchFavorites загружает избранные фильмы и сохраняет их в состоянии', async () => {
    const mockGet = api.get as Mock
    mockGet.mockResolvedValueOnce({
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
  const mockGet = api.get as Mock
  mockGet.mockRejectedValueOnce({ message: 'Ошибка сети' })

    await store.fetchFavorites()

    expect(store.error).toBe('Ошибка сети')
    expect(store.favorites).toEqual([])
    expect(store.loading).toBe(false)
  })

  it('addFavorite добавляет фильм в избранное', async () => {
  const mockPost = api.post as Mock
  mockPost.mockResolvedValueOnce({ data: {} })
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
  const mockPost = api.post as Mock
  mockPost.mockRejectedValueOnce({ message: 'Ошибка запроса' })

    await store.addFavorite(123)
    expect(store.error).toBe('Ошибка запроса')
  })

  it('removeFavorite удаляет фильм из избранного', async () => {
  const mockDelete = api.delete as Mock
  mockDelete.mockResolvedValueOnce({})
    store.favorites = ['1', '2', '3']

    await store.removeFavorite(2)
    expect(store.favorites).toEqual(['1', '3'])
  })

  it('removeFavorite сохраняет ошибку при неудаче', async () => {
  const mockDelete = api.delete as Mock
  mockDelete.mockRejectedValueOnce({ message: 'Ошибка удаления' })
    store.favorites = ['1']

    await store.removeFavorite(1)
    expect(store.error).toBe('Ошибка удаления')
  })

  it('toggleFavorite вызывает addFavorite, если фильма нет в избранном', async () => {
  const addSpy = vi.spyOn(store, 'addFavorite').mockResolvedValueOnce()
  const removeSpy = vi.spyOn(store, 'removeFavorite').mockResolvedValueOnce()

    store.favorites = ['1']
    await store.toggleFavorite(2)

  expect(addSpy).toHaveBeenCalled()
  expect((addSpy as Mock).mock.calls.length).toBeGreaterThan(0)
  expect((addSpy as Mock).mock.calls[0]![0]).toBe(2)
    expect(removeSpy).not.toHaveBeenCalled()
  })

  it('toggleFavorite вызывает removeFavorite, если фильм есть в избранном', async () => {
  const addSpy = vi.spyOn(store, 'addFavorite').mockResolvedValueOnce()
  const removeSpy = vi.spyOn(store, 'removeFavorite').mockResolvedValueOnce()

    store.favorites = ['1']
    await store.toggleFavorite(1)

  expect(removeSpy).toHaveBeenCalled()
  expect((removeSpy as Mock).mock.calls.length).toBeGreaterThan(0)
  expect((removeSpy as Mock).mock.calls[0]![0]).toBe(1)
    expect(addSpy).not.toHaveBeenCalled()
  })
})
