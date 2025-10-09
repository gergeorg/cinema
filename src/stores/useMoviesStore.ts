import { defineStore } from 'pinia'
import api from '@/api/api'
import type { IMovie } from '@/types'

interface IMoviesState {
  randomMovie: IMovie | null
  loadingRandom: boolean
  errorRandom: string | null

  top10: IMovie[]
  loadingTop10: boolean
  errorTop10: string | null
}

export const useMoviesStore = defineStore('movies', {
  state: (): IMoviesState => ({
    randomMovie: null,
    loadingRandom: false,
    errorRandom: null,

    top10: [],
    loadingTop10: false,
    errorTop10: null
  }),

  getters: {
    hasRandomMovie: (state) => !!state.randomMovie,
    hasTop10: (state) => state.top10.length > 0
  },

  actions: {
    // --- Случайный фильм ---
    async fetchRandomMovie(force = false) {
      if (this.loadingRandom || (this.randomMovie && !force)) return

      this.loadingRandom = true
      this.errorRandom = null
      try {
        const res = await api.get<IMovie>('/movie/random')
        this.randomMovie = res.data
      } catch (err) {
        console.error('Ошибка загрузки случайного фильма', err)
        this.errorRandom = 'Не удалось загрузить фильм. Попробуйте позже.'
      } finally {
        this.loadingRandom = false
      }
    },

    // --- Топ 10 фильмов ---
    async fetchTop10(force = false) {
      if (this.loadingTop10 || (this.top10.length && !force)) return

      this.loadingTop10 = true
      this.errorTop10 = null
      try {
        const res = await api.get<IMovie[]>('/movie/top10')
        this.top10 = res.data
      } catch (err) {
        console.error('Ошибка загрузки топ-10 фильмов', err)
        this.errorTop10 = 'Не удалось загрузить топ фильмов. Попробуйте позже.'
      } finally {
        this.loadingTop10 = false
      }
    }
  }
})
