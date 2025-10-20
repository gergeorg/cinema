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

export interface IMoviesState {
  randomMovie: IMovie | null
  loadingRandom: boolean
  errorRandom: string | null

  selectedMovie: IMovie | null
  loadingSelected: boolean
  errorSelected: string | null

  top10: IMovie[]
  loadingTop10: boolean
  errorTop10: string | null

  genres: string[]
  loadingGenres: boolean
  errorGenres: string | null

  allMovies: IMovie[]
  loadingAllMovies: boolean
  errorAllMovies: string | null
}

export type IGenres = string[]

export interface IUser {
  id: number
  email: string
  name: string
  surname: string
  favorites?: number[]
}

export interface IRegisterPayload {
  email: string
  password: string
  name: string
  surname: string
}

export interface ILoginPayload {
  email: string
  password: string
}

export interface IAuthState {
  user: IUser | null
  loading: boolean
  error: string | null
}

export interface IFavoritesState {
  favorites: string[]
  loading: boolean
  error: string | null
}
