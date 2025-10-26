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
	const { genres, loadingGenres, errorGenres, loadingAllMovies, errorAllMovies } =
		storeToRefs(moviesStore)

	const loading = computed(() => loadingGenres.value || loadingAllMovies.value)
	const error = computed(() => errorGenres.value || errorAllMovies.value)

	const fetchData = () => {
		moviesStore.fetchGenres()
		moviesStore.fetchAllMovies()
	}

	onMounted(fetchData)

	const getPoster = (genre: string) => {
		try {
			return new URL(`../assets/genres/${genre}.jpg`, import.meta.url).href
		} catch {
			return placeholder
		}
	}
</script>

<style scoped lang="scss">
	.genres {
		padding: 40px 0;

		&__title {
			margin-top: 0;
			margin-bottom: 64px;
			font-weight: 700;
			font-size: 48px;
			line-height: 117%;
			color: var(--color-white);

			@media (max-width: 768px) {
				font-size: 24px;
				margin-bottom: 40px;
			}
		}

		&__list {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
			gap: 40px;

			@media (max-width: 678px) {
				gap: 24px;
			}
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
					color: var(--color-hover);
				}
			}

			&:focus-visible {
				outline: none;
				outline: 1px solid var(--color-hover);
				outline-offset: 4px;
				border-radius: 16px;
			}

			&__img {
				height: 220px;
				border-radius: 24px;
				background-color: #616161;

				@media (max-width: 1024px) {
					width: 100%;
				}
			}

			&__name {
				padding-top: 22px;
				padding-bottom: 30px;
				font-weight: 700;
				font-size: 24px;
				text-align: center;
				color: var(--color-white);
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
			background: var(--skeleton-base-bg);
			border-radius: 8px;
			margin-bottom: 12px;

			&::after {
				content: '';
				position: absolute;
				inset: 0;
				background: linear-gradient(
					90deg,
					var(--skeleton-shimmer-color-start) 0%,
					var(--skeleton-shimmer-color-mid) 50%,
					var(--skeleton-shimmer-color-end) 100%
				);
				transform: translateX(-100%);
				animation: shimmer var(--skeleton-shimmer-duration) infinite;
			}
		}
	}
</style>
