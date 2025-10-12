<template>
	<section class="genres">
		<div class="container genres__container">
			<h1 class="genres__title">Жанры фильмов</h1>
			<TheError v-if="error" :message="error" />

			<ul v-else-if="loading" class="genres__list">
				<li v-for="n in 12" :key="n" class="genres__item">
					<div class="skeleton genre-card-skeleton"></div>
				</li>
			</ul>

			<ul v-else class="genres__list">
				<li v-for="genre in genres" :key="genre" class="genres__item">
					<RouterLink :to="`/genres/${genre}`" class="genre-card">
						<img :src="getPoster(genre)" :alt="genre" class="genre-card__img" loading="lazy" />
						<span class="genre-card__name">{{ genre }}</span>
					</RouterLink>
				</li>
			</ul>
		</div>
	</section>
</template>

<script setup lang="ts">
	import { onMounted, computed } from 'vue'
	import { RouterLink } from 'vue-router'
	import { storeToRefs } from 'pinia'
	import { useMoviesStore } from '@/stores/useMoviesStore'
	import placeholder from '@/assets/no-poster.png'
	import TheError from '@/components/TheError.vue'

	const moviesStore = useMoviesStore()
	const { genres, loadingGenres, errorGenres, allMovies, loadingAllMovies, errorAllMovies } =
		storeToRefs(moviesStore)

	const loading = computed(() => loadingGenres.value || loadingAllMovies.value)
	const error = computed(() => errorGenres.value || errorAllMovies.value)

	const fetchData = () => {
		moviesStore.fetchGenres()
		moviesStore.fetchAllMovies()
	}

	onMounted(fetchData)

	// Берём последнее изображение backdropUrl для фильм жанра
	const getPoster = (genre: string) => {
		const moviesOfGenre = allMovies.value.filter((m) => m.genres.includes(genre))
		const lastMovie = moviesOfGenre[moviesOfGenre.length - 1]
		return lastMovie?.backdropUrl ?? placeholder
	}

	// Берём первое изображение backdropUrl для фильм жанра

	// const getPoster = (genre: string) => {
	// 	const movie = allMovies.value.find((m) => m.genres.includes(genre))
	// 	return movie?.backdropUrl ?? placeholder
	// }
</script>

<style scoped lang="scss">
	.genres {
		padding: 40px 0;

		&__title {
			margin-bottom: 64px;
			font-weight: 700;
			font-size: 48px;
			line-height: 117%;
			color: #fff;
		}

		&__list {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
			gap: 40px;
		}

		&__item {
			max-height: 304px;
			list-style: none;
		}

		.genre-card {
			display: flex;
			flex-direction: column;
			align-items: center;
			border: 1px solid rgba(255, 255, 255, 0.25);
			border-radius: 24px;
			background-color: #0a0b0b;
			box-shadow: 0 0 80px 0 rgba(255, 255, 255, 0.33);
			transition:
				box-shadow 0.3s ease-in-out,
				transform 0.3s ease-in-out,
				color 0.3s ease-in-out;

			&:hover,
			&:focus-visible {
				box-shadow: 0 0 130px 0 rgba(180, 169, 255, 0.33);
				transform: scale(1.04);
			}

			&:hover {
				.genre-card__name {
					color: #b4a9ff;
				}
			}

			&:focus-visible {
				outline: none;
				outline: 1px solid #b4a9ff;
				outline-offset: 4px;
				border-radius: 16px;
			}

			&__img {
				width: 290px;
				height: 220px;
				border-radius: 24px;
				background-color: #616161;
			}

			&__name {
				padding-top: 22px;
				padding-bottom: 30px;
				font-weight: 700;
				font-size: 24px;
				line-height: 133%;
				text-align: center;
				color: #fff;
				text-transform: capitalize;
			}
		}

		.genre-card-skeleton {
			border-radius: 24px;
			width: 290px;
			height: 304px;
		}

		.skeleton {
			position: relative;
			overflow: hidden;
			background: rgba(255, 255, 255, 0.08);
			border-radius: 8px;
			margin-bottom: 12px;

			&::after {
				content: '';
				position: absolute;
				top: 0;
				left: -150px;
				height: 100%;
				width: 150px;
				background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
				animation: shimmer 1.2s infinite;
			}
		}

		@keyframes shimmer {
			100% {
				transform: translateX(100%);
			}
		}
	}
</style>
