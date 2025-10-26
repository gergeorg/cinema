<template>
	<TheError :message="errorRandom" v-if="errorRandom" />

	<TopFilmSkeleton v-else-if="loading" />

	<section class="top-film">
		<div v-if="!loading && movie" class="container top-film__container">
			<div class="top-film__info">
				<div class="top-film__info-header">
					<TheRating :value="movie.tmdbRating" />
					<span class="top-film__year">{{ movie.releaseYear }}</span>
					<span class="top-film__genre">{{ movie.genres?.[0] || '—' }}</span>
					<span class="top-film__duration">{{ formattedRuntime }}</span>
				</div>

				<RouterLink :to="`/movies/${movie.id}`" class="top-film__name">
					{{ movie.title }}
				</RouterLink>

				<p class="top-film__descr">{{ movie.plot }}</p>

				<div :class="['top-film__controls', { 'top-film__controls--movie': isMovieView }]">
					<BaseButton
						class="top-film__trailer"
						type="button"
						variant="blue"
						size="big"
						@click="openTrailer"
					>
						Трейлер
					</BaseButton>

					<BaseButton
						v-if="!props.movieId"
						variant="dark"
						size="big"
						type="button"
						@click="goToMovie"
						class="top-film__about"
					>
						О фильме
					</BaseButton>

					<BaseButton
						variant="dark"
						size="small"
						:icon="isFavorite ? 'favoriteFilled' : 'favorite'"
						type="button"
						aria-label="Добавить фильм в избранное"
						@click.stop="toggleFavoriteHandler"
						class="top-film__favorite"
					/>

					<BaseButton
						v-if="!props.movieId"
						variant="dark"
						size="small"
						icon="change"
						type="button"
						aria-label="Показать случайный фильм"
						class="top-film__change"
						@click="getRandomMovie"
					/>
				</div>
			</div>

			<div class="top-film__poster">
				<img
					:src="movie.backdropUrl ?? placeholder"
					:alt="movie.title"
					class="top-film__img"
					loading="lazy"
				/>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
	import { onMounted, computed } from 'vue'
	import { RouterLink, useRouter } from 'vue-router'
	import { storeToRefs } from 'pinia'
	import { useMoviesStore } from '@/stores/useMoviesStore'
	import { useFavoritesStore } from '@/stores/useFavoritesStore'
	import { useAuthStore } from '../stores/useAuthStore'
	import TheRating from './ui/TheRating.vue'
	import BaseButton from './ui/BaseButton.vue'
	import TopFilmSkeleton from './TopFilmSkeleton.vue'
	import placeholder from '@/assets/no-poster.png'
	import TheError from './TheError.vue'

	const props = defineProps<{ movieId?: string }>()
	const moviesStore = useMoviesStore()
	const favoritesStore = useFavoritesStore()
	const authStore = useAuthStore()

	const { randomMovie, loadingRandom, errorRandom, selectedMovie, loadingSelected } =
		storeToRefs(moviesStore)
	const { favorites } = storeToRefs(favoritesStore)

	const router = useRouter()
	const isMovieView = computed(() => !!props.movieId)

	onMounted(async () => {
		if (!moviesStore.allMovies.length) await moviesStore.fetchAllMovies()

		if (props.movieId) {
			await moviesStore.fetchMovieById(props.movieId)
		} else {
			await moviesStore.fetchRandomMovie()
		}

		await favoritesStore.fetchFavorites()
	})

	const movie = computed(() => (isMovieView.value ? selectedMovie.value : randomMovie.value))
	const loading = computed(() => (isMovieView.value ? loadingSelected.value : loadingRandom.value))

	const isFavorite = computed(() =>
		movie.value ? favorites.value.includes(String(movie.value.id)) : false,
	)

	const formattedRuntime = computed(() => {
		const minutes = movie.value?.runtime
		if (!minutes) return '—'
		const hours = Math.floor(minutes / 60)
		const mins = minutes % 60
		return `${hours > 0 ? `${hours} ч ` : ''}${mins} мин`
	})

	const getRandomMovie = async (force = true) => {
		if (!isMovieView.value) await moviesStore.fetchRandomMovie(force)
	}

	const goToMovie = () => {
		const m = movie.value
		if (m) router.push(`/movies/${m.id}`)
	}

	const openTrailer = () => {
		const m = movie.value
		if (m?.trailerUrl) {
			window.dispatchEvent(new CustomEvent('open-trailer', { detail: m.trailerUrl }))
		}
	}

	const toggleFavoriteHandler = async () => {
		if (!movie.value?.id) return
		if (!authStore.isAuthenticated) {
			window.dispatchEvent(new CustomEvent('open-auth', { detail: { mode: 'login' } }))
			return
		}

		await favoritesStore.toggleFavorite(movie.value.id)
	}
</script>

<style scoped lang="scss">
	.top-film {
		padding-top: 32px;
		padding-bottom: 40px;

		@media (max-width: 640px) {
			padding-top: 0;
			padding-bottom: 24px;
		}

		&__container {
			display: grid;
			grid-template-columns: minmax(0, 580px) minmax(0, 680px);
			align-items: center;
			gap: 20px;

			@media (max-width: 1200px) {
				display: flex;
				flex-direction: column;
			}
		}

		&__info {
			@media (max-width: 1200px) {
				order: 2;
			}
		}

		&__info-header {
			display: flex;
			align-items: center;
			gap: 16px;
			margin-bottom: 16px;
			font-weight: 400;
			color: var(--color-white-07);

			@media (max-width: 640px) {
				gap: 12px;
			}
		}

		&__name {
			display: block;
			margin-bottom: 16px;
			font-weight: 700;
			font-size: 48px;
			line-height: 113%;
			color: var(--color-white);
			transition: color 0.3s ease-in-out;

			@media (max-width: 640px) {
				font-size: 24px;
			}

			&:hover {
				color: var(--color-hover);
			}

			&:focus-within {
				outline: 1px solid var(--color-hover);
				outline-offset: 1px;
				border-radius: 2px;
			}
		}

		&__descr {
			margin-bottom: 60px;
			font-weight: 400;
			font-size: 24px;
			color: var(--color-white-07);

			@media (max-width: 640px) {
				font-size: 18px;
				margin-bottom: 32px;
			}
		}

		&__controls {
			display: flex;
			gap: 16px;
			align-items: center;

			@media (max-width: 640px) {
				display: grid;
				grid-template-columns: 1fr 68px 68px;
				grid-template-rows: 1fr 1fr;
				gap: 16px 16px;
				grid-template-areas:
					'trailer trailer trailer'
					'about_button favorite_button change_button';
			}

			&--movie {
				display: flex;
				flex-direction: row;
				align-items: center;
				gap: 12px;
			}
		}

		&__poster {
			max-width: 680px;

			@media (max-width: 1200px) {
				max-width: 100%;
				order: 1;
			}
		}

		&__img {
			width: 100%;
			max-height: 552px;
			border-radius: 16px;

			@media (max-width: 640px) {
				max-height: 338px;
			}
		}

		@media (max-width: 640px) {
			&__trailer {
				grid-area: trailer;
			}

			&__about {
				grid-area: about_button;
				padding: 16px;
			}

			&__favorite {
				grid-area: favorite_button;
			}

			&__change {
				grid-area: change_button;
			}
		}
	}
</style>
