import { defineStore } from 'pinia'
import api from '@/api/api'
import type { AxiosError } from 'axios'
import type { IMovie } from '@/types'
import { useMoviesStore } from './useMoviesStore'

interface FavoritesState {
  favorites: string[]
  loading: boolean
  error: string | null
}

export const useFavoritesStore = defineStore('favorites', {
  state: (): FavoritesState => ({
    favorites: [],
    loading: false,
    error: null,
  }),

  actions: {
    extractResponseData(err?: AxiosError): unknown {
      const resp = err?.response as unknown
      return resp && typeof resp === 'object' && 'data' in (resp as Record<string, unknown>)
        ? (resp as Record<string, unknown>).data
        : undefined
    },

    getErrorMessage(err?: unknown): string | undefined {
      const e = err as AxiosError | undefined
      const data = this.extractResponseData(e)
      return typeof data === 'string' ? data : e?.message
    },
    async fetchFavorites() {
      this.loading = true
      this.error = null
      try {
        const res = await api.get('/favorites')
        const data = res.data

        const moviesStore = useMoviesStore()

        let items: Array<unknown> = []
        if (Array.isArray(data)) items = data
        else if (data && Array.isArray((data as Record<string, unknown>).favorites)) {
          items = (data as Record<string, unknown>).favorites as Array<unknown>
        }

        this.favorites = items.map((it) => String((it as Record<string, unknown>).id))

        for (const it of items) {
          const movieObj = it as IMovie
          if (movieObj && movieObj.id != null && !moviesStore.allMovies.some((mm) => String(mm.id) === String(movieObj.id))) {
            moviesStore.allMovies.push(movieObj)
          }
        }
      } catch (err: unknown) {
        this.error = this.getErrorMessage(err) ?? 'Не удалось загрузить избранные.'
      } finally {
        this.loading = false
      }
    },

    async addFavorite(movieId: number | string) {
      this.error = null
      const idNum = Number(movieId)
      try {
        const body = new URLSearchParams({ id: String(idNum) })
        await api.post('/favorites', body, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
        if (!this.favorites.includes(String(movieId))) this.favorites.push(String(movieId))
      } catch (err: unknown) {
        this.error = this.getErrorMessage(err) ?? 'Не удалось добавить в избранное.'
      }
    },

    async removeFavorite(movieId: number | string) {
      this.error = null
      try {
        await api.delete(`/favorites/${movieId}`)
        this.favorites = this.favorites.filter(f => f !== String(movieId))
      } catch (err: unknown) {
        this.error = this.getErrorMessage(err) ?? 'Не удалось удалить из избранного.'
      }
    },

    async toggleFavorite(movieId: number | string) {
      if (this.favorites.includes(String(movieId))) {
        await this.removeFavorite(movieId)
      } else {
        await this.addFavorite(movieId)
      }
    },
  },
})
