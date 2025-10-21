import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useMoviesStore } from '../useMoviesStore'

// Мокаем модуль API
vi.mock('@/api/api', () => ({
  default: {
    get: vi.fn(),
  },
}))

import api from '@/api/api'

describe('useMoviesStore', () => {
  let store: ReturnType<typeof useMoviesStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useMoviesStore()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  // --- Getter ---
  it('getMovieById возвращает фильм по ID', () => {
    store.allMovies = [
      { id: 1, title: 'A' },
      { id: 2, title: 'B' },
    ] as any
    expect(store.getMovieById(2)?.title).toBe('B')
    expect(store.getMovieById(3)).toBeNull()
  })

  // --- fetchRandomMovie ---
  it('fetchRandomMovie сохраняет случайный фильм', async () => {
    const movie = { id: 42, title: 'Random Movie' }
    ;(api.get as vi.Mock).mockResolvedValueOnce({ data: movie })

    await store.fetchRandomMovie()

    expect(api.get).toHaveBeenCalledExactlyOnceWith('/movie/random')
    expect(store.randomMovie).toEqual(movie)
    expect(store.allMovies).toContainEqual(movie)
    expect(store.errorRandom).toBeNull()
  })

  it('fetchRandomMovie обрабатывает ошибку', async () => {
    ;(api.get as vi.Mock).mockRejectedValueOnce(new Error('Ошибка'))

    await store.fetchRandomMovie()

    expect(store.errorRandom).toBe('Не удалось загрузить фильм. Попробуйте позже.')
    expect(store.loadingRandom).toBe(false)
  })

  it('fetchRandomMovie не делает запрос, если уже загружен фильм и force = false', async () => {
    store.randomMovie = { id: 5 } as any
    await store.fetchRandomMovie()
    expect(api.get).not.toHaveBeenCalled()
  })

  // --- fetchMovieById ---
  it('fetchMovieById возвращает фильм из allMovies, если он уже есть', async () => {
    store.allMovies = [{ id: 10, title: 'In store' }] as any
    await store.fetchMovieById(10)
    expect(api.get).not.toHaveBeenCalled()
    expect(store.selectedMovie?.title).toBe('In store')
  })

  it('fetchMovieById делает запрос и сохраняет фильм', async () => {
    const movie = { id: 99, title: 'Fetched Movie' }
    ;(api.get as vi.Mock).mockResolvedValueOnce({ data: movie })

    await store.fetchMovieById(99)

    expect(api.get).toHaveBeenCalledExactlyOnceWith('/movie/99')
    expect(store.selectedMovie).toEqual(movie)
    expect(store.allMovies).toContainEqual(movie)
  })

  it('fetchMovieById обрабатывает ошибку', async () => {
    ;(api.get as vi.Mock).mockRejectedValueOnce(new Error('Ошибка'))
    await store.fetchMovieById(77)
    expect(store.errorSelected).toBe('Не удалось загрузить фильм. Попробуйте позже.')
    expect(store.loadingSelected).toBe(false)
  })

  // --- fetchAllMovies ---
  it('fetchAllMovies загружает список фильмов', async () => {
    const movies = [{ id: 1 }, { id: 2 }]
    ;(api.get as vi.Mock).mockResolvedValueOnce({ data: movies })

    await store.fetchAllMovies()

    expect(api.get).toHaveBeenCalledExactlyOnceWith('/movie')
    expect(store.allMovies).toEqual(movies)
  })

  it('fetchAllMovies обрабатывает ошибку', async () => {
    ;(api.get as vi.Mock).mockRejectedValueOnce(new Error('Ошибка'))
    await store.fetchAllMovies()
    expect(store.errorAllMovies).toBe('Не удалось загрузить фильмы. Попробуйте позже.')
  })

  // --- fetchTop10 ---
  it('fetchTop10 загружает топ фильмов', async () => {
    const top = [{ id: 1 }, { id: 2 }]
    ;(api.get as vi.Mock).mockResolvedValueOnce({ data: top })

    await store.fetchTop10()

    expect(api.get).toHaveBeenCalledExactlyOnceWith('/movie/top10')
    expect(store.top10).toEqual(top)
  })

  it('fetchTop10 обрабатывает ошибку', async () => {
    ;(api.get as vi.Mock).mockRejectedValueOnce(new Error('Ошибка'))
    await store.fetchTop10()
    expect(store.errorTop10).toBe('Не удалось загрузить топ фильмов. Попробуйте позже.')
  })

  // --- fetchGenres ---
  it('fetchGenres загружает жанры', async () => {
    const genres = ['Комедия', 'Драма']
    ;(api.get as vi.Mock).mockResolvedValueOnce({ data: genres })

    await store.fetchGenres()

    expect(api.get).toHaveBeenCalledExactlyOnceWith('/movie/genres')
    expect(store.genres).toEqual(genres)
  })

  it('fetchGenres обрабатывает ошибку', async () => {
    ;(api.get as vi.Mock).mockRejectedValueOnce(new Error('Ошибка'))
    await store.fetchGenres()
    expect(store.errorGenres).toBe('Не удалось загрузить жанры. Попробуйте позже.')
  })
})
