<template>
	<div class="movie-view">
		<div v-if="loading" class="container">
			<TopFilmSkeleton />
			<MovieAboutSkeleton />
		</div>

		<TheError :message="error" v-if="error" />

		<template v-else-if="movie">
			<div class="movie-page__content">
				<TopFilm :movieId="movieId" />

				<section class="about-film">
					<div class="about-film__container container">
						<h2 class="about-film__title">О фильме</h2>

						<ul class="about-film__list">
							<MovieParamItem title="Язык оригинала" :value="movie.language" />
							<MovieParamItem title="Бюджет" :value="movie.budget" />
							<MovieParamItem title="Выручка" :value="movie.revenue" />
							<MovieParamItem title="Режиссер" :value="movie.director" />
							<MovieParamItem title="Продакшен" :value="movie.production" />
							<MovieParamItem title="Награды" :value="movie.awardsSummary" />
						</ul>
					</div>
				</section>
			</div>
		</template>
	</div>
</template>

<script setup lang="ts">
	import { onMounted, computed } from 'vue'
	import { useRoute } from 'vue-router'
	import { useMoviesStore } from '@/stores/useMoviesStore'
	import TopFilm from '@/components/TopFilm.vue'
	import MovieParamItem from '../components/ui/MovieParamItem.vue'
	import MovieAboutSkeleton from '@/components/MovieAboutSkeleton.vue'
	import TopFilmSkeleton from '@/components/TopFilmSkeleton.vue'
	import TheError from '@/components/TheError.vue'

	const route = useRoute()
	const movieId = route.params.id as string

	const moviesStore = useMoviesStore()

	const movie = computed(() => moviesStore.selectedMovie)
	const loading = computed(() => moviesStore.loadingSelected)
	const error = computed(() => moviesStore.errorSelected)

	onMounted(async () => {
		if (movieId) {
			await moviesStore.fetchMovieById(movieId, true)
		}
	})
</script>

<style scoped lang="scss">
	.about-film {
		&__title {
			margin-bottom: 64px;
			font-weight: 700;
			font-size: 40px;
			line-height: 120%;
			color: #fff;
		}

		&__list {
			list-style: none;
			padding: 0;

			display: flex;
			flex-direction: column;
			gap: 24px;
		}

		&__error {
			text-align: center;
			margin: 40px 0;
		}
	}

	.top-film {
		&__container {
			display: grid;
			grid-template-columns: 1fr 680px;
			align-items: center;
			gap: 20px;
		}
	}
</style>
