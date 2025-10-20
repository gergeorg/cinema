import { defineStore } from 'pinia'
import api from '@/api/api'
import type { IMovie, IMoviesState } from '@/types'

export const useMoviesStore = defineStore('movies', {
  state: (): IMoviesState => ({
    randomMovie: null,
    loadingRandom: false,
    errorRandom: null,

    selectedMovie: null,
    loadingSelected: false,
    errorSelected: null,

    top10: [],
    loadingTop10: false,
    errorTop10: null,

    genres: [],
    loadingGenres: false,
    errorGenres: null,

    allMovies: [],
    loadingAllMovies: false,
    errorAllMovies: null,
  }),

  getters: {
    getMovieById: (state) => (id: string | number) =>
      state.allMovies.find(m => String(m.id) === String(id)) || null,
  },

  actions: {
    async fetchRandomMovie(force = false) {
      if (this.loadingRandom || (this.randomMovie && !force)) return
      this.loadingRandom = true
      this.errorRandom = null
      try {
        const res = await api.get<IMovie>('/movie/random')
        this.randomMovie = res.data
        if (!this.allMovies.some(m => String(m.id) === String(res.data.id))) {
          this.allMovies.push(res.data)
        }
      } catch {
        this.errorRandom = 'Не удалось загрузить фильм. Попробуйте позже.'
      } finally {
        this.loadingRandom = false
      }
    },

    async fetchMovieById(movieId: string | number, force = false) {
      const movieFromAll = this.allMovies.find(m => String(m.id) === String(movieId))
      if (!force && movieFromAll) {
        this.selectedMovie = movieFromAll
        return
      }

      if (this.loadingSelected) return
      this.loadingSelected = true
      this.errorSelected = null
      try {
        const res = await api.get<IMovie>(`/movie/${movieId}`)
        this.selectedMovie = res.data
        if (!this.allMovies.some(m => String(m.id) === String(res.data.id))) {
          this.allMovies.push(res.data)
        }
      } catch {
        this.errorSelected = 'Не удалось загрузить фильм. Попробуйте позже.'
      } finally {
        this.loadingSelected = false
      }
    },

    async fetchAllMovies(force = false) {
      if (this.loadingAllMovies || (this.allMovies.length && !force)) return
      this.loadingAllMovies = true
      this.errorAllMovies = null
      try {
        const res = await api.get<IMovie[]>('/movie')
        this.allMovies = res.data
      } catch {
        this.errorAllMovies = 'Не удалось загрузить фильмы. Попробуйте позже.'
      } finally {
        this.loadingAllMovies = false
      }
    },

    async fetchTop10(force = false) {
      if (this.loadingTop10 || (this.top10.length && !force)) return
      this.loadingTop10 = true
      this.errorTop10 = null
      try {
        const res = await api.get<IMovie[]>('/movie/top10')
        this.top10 = res.data
      } catch {
        this.errorTop10 = 'Не удалось загрузить топ фильмов. Попробуйте позже.'
      } finally {
        this.loadingTop10 = false
      }
    },

    async fetchGenres(force = false) {
      if (this.loadingGenres || (this.genres.length && !force)) return
      this.loadingGenres = true
      this.errorGenres = null
      try {
        const res = await api.get<string[]>('/movie/genres')
        this.genres = res.data
      } catch {
        this.errorGenres = 'Не удалось загрузить жанры. Попробуйте позже.'
      } finally {
        this.loadingGenres = false
      }
    },
  },
})
