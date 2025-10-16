export interface IMovie {
  id: number
  title: string
  plot: string
  releaseYear: number
  genres: string[]
  tmdbRating: number
  runtime: number
  backdropUrl: string
  trailerUrl: string
  posterUrl: string
  language: string
  budget: number
  revenue: number
  director: string
  production: string
  awardsSummary: string
}

export type IGenres = string[]

export interface IUser {
  id: number
  email: string
  name: string
  surname: string
  favorites?: number[]
}

export interface RegisterPayload {
  email: string
  password: string
  name: string
  surname: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface AuthState {
  user: IUser | null
  loading: boolean
  error: string | null
}
