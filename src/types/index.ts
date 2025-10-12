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
