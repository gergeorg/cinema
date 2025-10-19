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

				<div class="top-film__controls">
					<BaseButton type="button" variant="blue" size="big" @click="openTrailer">
						Трейлер
					</BaseButton>

					<BaseButton
						v-if="!props.movieId"
						variant="dark"
						size="big"
						type="button"
						@click="goToMovie"
					>
						О фильме
					</BaseButton>

					<BaseButton
						variant="dark"
						size="small"
						:icon="isFavorite ? 'favorite-filled' : 'favorite'"
						type="button"
						aria-label="Добавить фильм в избранное"
						@click.stop="toggleFavoriteHandler"
					/>

					<BaseButton
						v-if="!props.movieId"
						variant="dark"
						size="small"
						icon="change"
						type="button"
						aria-label="Показать случайный фильм"
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

		&__container {
			display: grid;
			grid-template-columns: 1fr 680px;
			align-items: center;
			gap: 20px;
		}

		&__info-header {
			display: flex;
			align-items: center;
			gap: 16px;
			margin-bottom: 16px;
			font-weight: 400;
			font-size: 18px;
			color: rgba(255, 255, 255, 0.7);
		}

		&__name {
			margin-bottom: 16px;
			font-weight: 700;
			font-size: 48px;
			color: #fff;
			transition: color 0.3s ease-in-out;

			&:hover {
				color: #b4a9ff;
			}

			&:focus-within {
				outline: 1px solid #b4a9ff;
				outline-offset: 1px;
				border-radius: 2px;
			}
		}

		&__descr {
			margin-bottom: 60px;
			font-weight: 400;
			font-size: 24px;
			color: rgba(255, 255, 255, 0.7);
		}

		&__controls {
			display: flex;
			gap: 16px;
			align-items: center;
		}

		&__poster {
			max-width: 680px;
		}

		&__img {
			width: 100%;
			max-height: 552px;
			border-radius: 16px;
		}

		&__error {
			text-align: center;
			color: rgba(255, 255, 255, 0.7);
			font-size: 18px;
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 16px;
		}
	}
</style>
