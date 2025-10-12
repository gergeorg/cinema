<template>
	<section class="genre">
		<div class="container genre__container">
			<h1 class="genre__title">
				<button class="genre__button" aria-label="Вернуться назад" @click="$router.back()">
					<BaseIcon width="14" height="22" name="back" />
				</button>

				{{ genre }}
			</h1>

			<TheError :message="error" v-if="error" />

			<ul v-else-if="loading" class="genre__list">
				<li v-for="n in 10" :key="n" class="genre__item">
					<FilmCardSkeleton />
				</li>
			</ul>

			<ul v-else class="genre__list">
				<li v-for="movie in movies" :key="movie.id" class="genre__item">
					<FilmCard :movie="movie" />
				</li>

				<li v-if="!movies.length" class="genre__empty">Фильмы не найдены 😔</li>
			</ul>
		</div>
	</section>
</template>

<script setup lang="ts">
	import { onMounted, computed, watch } from 'vue'
	import { useRoute } from 'vue-router'
	import { storeToRefs } from 'pinia'
	import { useMoviesStore } from '@/stores/useMoviesStore'
	import FilmCard from '@/components/FilmCard.vue'
	import FilmCardSkeleton from '@/components/FilmCardSkeleton.vue'
	import TheError from '@/components/TheError.vue'
	import BaseIcon from '@/components/ui/BaseIcon.vue'

	const route = useRoute()
	const genre = computed(() => route.params.genre as string)

	const moviesStore = useMoviesStore()
	const { loadingAllMovies, errorAllMovies } = storeToRefs(moviesStore)

	const fetchAll = () => moviesStore.fetchAllMovies()

	onMounted(fetchAll)
	watch(genre, fetchAll)

	const movies = computed(() => moviesStore.getMoviesByGenre(genre.value))

	const loading = computed(() => loadingAllMovies.value)
	const error = computed(() => errorAllMovies.value)
</script>

<style scoped lang="scss">
	.genre {
		padding: 40px 0;

		&__title {
			font-size: 36px;
			font-weight: 700;
			color: #fff;
			margin-bottom: 32px;
			text-transform: capitalize;
		}

		&__button {
			width: 40px;
			height: 40px;
			color: #fff;
			transition: color 0.3s ease-in-out;

			&:hover {
				color: #b4a9ff;
			}
		}

		&__list {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(224px, 1fr));
			gap: 64px 40px;
		}

		&__item {
			list-style: none;
		}

		&__empty {
			text-align: center;
			color: rgba(255, 255, 255, 0.7);
			display: flex;
			flex-direction: column;
			align-items: center;
			font-size: 18px;
		}
	}
</style>
