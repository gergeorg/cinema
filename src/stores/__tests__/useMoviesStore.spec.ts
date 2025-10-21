import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { Mock } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useMoviesStore } from '../useMoviesStore'
import type { IMovie } from '@/types'

vi.mock('@/api/api', () => ({
  default: {
    get: vi.fn(),
  },
}))

import api from '@/api/api'

const makeMovie = (overrides?: Partial<IMovie>): IMovie => ({
  id: 0,
  title: 'Untitled',
  plot: '',
  releaseYear: 2000,
  genres: [],
  tmdbRating: 0,
  runtime: 100,
  backdropUrl: '',
  trailerUrl: '',
  posterUrl: '',
  language: 'en',
  budget: 0,
  revenue: 0,
  director: '',
  production: '',
  awardsSummary: '',
  ...overrides,
})

describe('useMoviesStore', () => {
  let store: ReturnType<typeof useMoviesStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useMoviesStore()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('getMovieById возвращает фильм по ID', () => {
    store.allMovies = [
      makeMovie({ id: 1, title: 'A' }),
      makeMovie({ id: 2, title: 'B' }),
    ]

    expect(store.getMovieById(2)?.title).toBe('B')
    expect(store.getMovieById(3)).toBeNull()
  })

  it('fetchRandomMovie сохраняет случайный фильм', async () => {
    const movie = makeMovie({ id: 42, title: 'Random Movie' })
    const mockGet = api.get as Mock
    mockGet.mockResolvedValueOnce({ data: movie })

    await store.fetchRandomMovie()

  expect((api.get as Mock).mock.calls.length).toBeGreaterThan(0)
  expect((api.get as Mock).mock.calls[0]![0]).toBe('/movie/random')
    expect(store.randomMovie).toEqual(movie)
    expect(store.allMovies).toContainEqual(movie)
    expect(store.errorRandom).toBeNull()
  })

  it('fetchRandomMovie обрабатывает ошибку', async () => {
    const mockGet = api.get as Mock
    mockGet.mockRejectedValueOnce(new Error('Ошибка'))

    await store.fetchRandomMovie()

    expect(store.errorRandom).toBe('Не удалось загрузить фильм. Попробуйте позже.')
    expect(store.loadingRandom).toBe(false)
  })

  it('fetchRandomMovie не делает запрос, если уже загружен фильм и force = false', async () => {
    store.randomMovie = makeMovie({ id: 5 })
    await store.fetchRandomMovie()
    expect(api.get).not.toHaveBeenCalled()
  })

  it('fetchMovieById возвращает фильм из allMovies, если он уже есть', async () => {
    const movie = makeMovie({ id: 10, title: 'In store' })
    store.allMovies = [movie]

    await store.fetchMovieById(10)

    expect(api.get).not.toHaveBeenCalled()
    expect(store.selectedMovie?.title).toBe('In store')
  })

  it('fetchMovieById делает запрос и сохраняет фильм', async () => {
    const movie = makeMovie({ id: 99, title: 'Fetched Movie' })
    const mockGet = api.get as Mock
    mockGet.mockResolvedValueOnce({ data: movie })

    await store.fetchMovieById(99)

    expect((api.get as Mock).mock.calls.length).toBeGreaterThan(0)
    expect((api.get as Mock).mock.calls[0]![0]).toBe('/movie/99')
    expect(store.selectedMovie).toEqual(movie)
    expect(store.allMovies).toContainEqual(movie)
  })

  it('fetchMovieById обрабатывает ошибку', async () => {
    const mockGet = api.get as Mock
    mockGet.mockRejectedValueOnce(new Error('Ошибка'))
    await store.fetchMovieById(77)
    expect(store.errorSelected).toBe('Не удалось загрузить фильм. Попробуйте позже.')
    expect(store.loadingSelected).toBe(false)
  })

  it('fetchAllMovies загружает список фильмов', async () => {
    const movies: IMovie[] = [
      makeMovie({ id: 1, title: 'A' }),
      makeMovie({ id: 2, title: 'B' }),
    ]
    const mockGet = api.get as Mock
    mockGet.mockResolvedValueOnce({ data: movies })

    await store.fetchAllMovies()

    expect((api.get as Mock).mock.calls.length).toBeGreaterThan(0)
    expect((api.get as Mock).mock.calls[0]![0]).toBe('/movie')
    expect(store.allMovies).toEqual(movies)
  })

  it('fetchAllMovies обрабатывает ошибку', async () => {
    const mockGet = api.get as Mock
    mockGet.mockRejectedValueOnce(new Error('Ошибка'))
    await store.fetchAllMovies()
    expect(store.errorAllMovies).toBe('Не удалось загрузить фильмы. Попробуйте позже.')
  })

  it('fetchTop10 загружает топ фильмов', async () => {
    const top: IMovie[] = [
      makeMovie({ id: 1, title: 'Top1' }),
      makeMovie({ id: 2, title: 'Top2' }),
    ]
    const mockGet = api.get as Mock
    mockGet.mockResolvedValueOnce({ data: top })

    await store.fetchTop10()

    expect((api.get as Mock).mock.calls.length).toBeGreaterThan(0)
    expect((api.get as Mock).mock.calls[0]![0]).toBe('/movie/top10')
    expect(store.top10).toEqual(top)
  })

  it('fetchTop10 обрабатывает ошибку', async () => {
    const mockGet = api.get as Mock
    mockGet.mockRejectedValueOnce(new Error('Ошибка'))
    await store.fetchTop10()
    expect(store.errorTop10).toBe('Не удалось загрузить топ фильмов. Попробуйте позже.')
  })

  it('fetchGenres загружает жанры', async () => {
    const genres = ['Комедия', 'Драма']
    const mockGet = api.get as Mock
    mockGet.mockResolvedValueOnce({ data: genres })

    await store.fetchGenres()

    expect((api.get as Mock).mock.calls.length).toBeGreaterThan(0)
    expect((api.get as Mock).mock.calls[0]![0]).toBe('/movie/genres')
    expect(store.genres).toEqual(genres)
  })

  it('fetchGenres обрабатывает ошибку', async () => {
    const mockGet = api.get as Mock
    mockGet.mockRejectedValueOnce(new Error('Ошибка'))
    await store.fetchGenres()
    expect(store.errorGenres).toBe('Не удалось загрузить жанры. Попробуйте позже.')
  })
})
