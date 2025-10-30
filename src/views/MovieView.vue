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
	import { onMounted, computed, ref, watch } from 'vue'
	import { useRoute } from 'vue-router'
	import { useMoviesStore } from '@/stores/useMoviesStore'
	import TopFilm from '@/components/TopFilm.vue'
	import MovieParamItem from '../components/ui/MovieParamItem.vue'
	import MovieAboutSkeleton from '@/components/MovieAboutSkeleton.vue'
	import TopFilmSkeleton from '@/components/TopFilmSkeleton.vue'
	import TheError from '@/components/TheError.vue'

	const route = useRoute()
	const moviesStore = useMoviesStore()

	const movieId = ref(route.params.id as string)
	const movie = computed(() => moviesStore.selectedMovie)
	const loading = computed(() => moviesStore.loadingSelected)
	const error = computed(() => moviesStore.errorSelected)

	const fetchMovie = async (id: string) => {
		if (!id) return
		await moviesStore.fetchMovieById(id, true)
	}

	onMounted(async () => {
		await fetchMovie(movieId.value)
	})

	watch(
		() => route.params.id,
		async (newId, oldId) => {
			if (newId && newId !== oldId) {
				movieId.value = newId as string
				await fetchMovie(movieId.value)
			}
		},
	)
</script>

<style scoped lang="scss">
	.about-film {
		&__title {
			margin-bottom: 64px;
			font-weight: 700;
			font-size: 40px;
			line-height: 120%;
			color: var(--color-white);
		}

		&__list {
			display: flex;
			flex-direction: column;
			gap: 24px;
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
