<template>
	<section class="favorites">
		<div class="container">
			<h1 class="favorites__title">Избранные фильмы</h1>

			<TheError v-if="error" :message="error" />

			<div v-else-if="loading" class="favorites__loading">
				<FilmCardSkeleton v-for="n in 10" :key="n" />
			</div>

			<div v-else-if="movies.length === 0" class="favorites__empty">
				<p>У вас пока нет избранных фильмов 😔</p>
				<RouterLink to="/" class="favorites__link">Вернуться на главную</RouterLink>
			</div>

			<ul v-else class="favorites__list">
				<FilmCard
					v-for="(movie, index) in movies"
					:key="movie.id"
					:movie="movie"
					:showNumber="false"
					:index="index + 1"
					:showRemove="true"
					@remove="() => onRemoveFavorite(movie.id)"
				/>
			</ul>
		</div>
	</section>
</template>

<script setup lang="ts">
	import { onMounted, computed } from 'vue'
	import { RouterLink } from 'vue-router'
	import { storeToRefs } from 'pinia'
	import { useFavoritesStore } from '@/stores/useFavoritesStore'
	import { useMoviesStore } from '@/stores/useMoviesStore'
	import TheError from '@/components/TheError.vue'
	import FilmCard from '@/components/FilmCard.vue'
	import FilmCardSkeleton from './FilmCardSkeleton.vue'

	const favoritesStore = useFavoritesStore()
	const moviesStore = useMoviesStore()
	const { favorites, loading, error } = storeToRefs(favoritesStore)

	onMounted(async () => {
		await favoritesStore.fetchFavorites()

		const missing = favorites.value.filter((id) => !moviesStore.getMovieById(id))
		if (missing.length) {
			await Promise.all(missing.map((id) => moviesStore.fetchMovieById(id)))
		}
	})

	const movies = computed(() =>
		favorites.value
			.map((id) => moviesStore.getMovieById(id))
			.filter((m): m is NonNullable<typeof m> => m != null),
	)

	const onRemoveFavorite = async (id: string | number) => {
		await favoritesStore.removeFavorite(id)
	}
</script>

<style scoped lang="scss">
	.favorites {
		padding: 40px 0;

		&__title {
			font-size: 36px;
			font-weight: 700;
			color: var(--color-white);
			margin-bottom: 32px;
		}

		&__empty {
			text-align: center;
			color: rgba(255, 255, 255, 0.8);
			font-size: 20px;
		}

		&__link {
			display: inline-block;
			margin-top: 16px;
			color: var(--color-hover);
			text-decoration: underline;
		}

		&__list,
		&__loading {
			display: grid;
			grid-template-columns: repeat(5, 1fr);
			gap: 64px 40px;
		}
	}
</style>
