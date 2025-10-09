<template>
	<section class="top-list">
		<div class="container top-list__container">
			<h2 class="top-list__title">Топ 10 фильмов</h2>

			<p v-if="errorTop10" class="top-list__error">{{ errorTop10 }}</p>

			<ul v-else-if="loadingTop10" class="top-list__list" aria-hidden="true">
				<FilmCardSkeleton v-for="n in 10" :key="n" />
			</ul>

			<ul v-else class="top-list__list">
				<FilmCard
					v-for="(movie, i) in top10"
					:key="movie.id"
					:movie="movie"
					:index="i + 1"
					:showNumber="true"
				/>
			</ul>
		</div>
	</section>
</template>

<script setup lang="ts">
	import { onMounted } from 'vue'
	import { storeToRefs } from 'pinia'
	import { useMoviesStore } from '@/stores/useMoviesStore'
	import FilmCard from './FilmCard.vue'
	import FilmCardSkeleton from './FilmCardSkeleton.vue'

	const moviesStore = useMoviesStore()
	const { top10, loadingTop10, errorTop10 } = storeToRefs(moviesStore)

	onMounted(() => {
		moviesStore.fetchTop10()
	})
</script>

<style scoped lang="scss">
	.top-list {
		padding-bottom: 120px;

		&__title {
			margin-bottom: 64px;
			font-weight: 700;
			font-size: 40px;
			line-height: 120%;
			color: #fff;
		}

		&__list {
			display: grid;
			grid-template-columns: repeat(5, 1fr);
			gap: 64px 40px;
		}
	}
</style>
