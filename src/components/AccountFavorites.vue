<template>
	<section class="favorites">
		<TheError v-if="error" :message="error" />

		<div v-else-if="loading" class="favorites__loading">
			<FilmCardSkeleton v-for="n in 2" :key="n" />
		</div>

		<div v-else-if="movies.length === 0" class="favorites__empty">
			<p>У вас пока нет избранных фильмов 😔</p>
			<RouterLink to="/" class="favorites__link">Вернуться на главную</RouterLink>
		</div>

		<template v-else>
			<ul class="favorites__list">
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

			<div class="favorites__swiper-wrap">
				<Swiper
					class="favorites__swiper"
					slides-per-view="auto"
					:space-between="40"
					:breakpoints="{
						1200: { slidesPerView: 'auto', spaceBetween: 40 },
						768: { slidesPerView: 'auto', spaceBetween: 40 },
						0: { slidesPerView: 'auto', spaceBetween: 40 },
					}"
					:watch-overflow="true"
				>
					<SwiperSlide v-for="(movie, index) in movies" :key="movie.id">
						<FilmCard
							:movie="movie"
							:index="index + 1"
							:showNumber="false"
							:showRemove="true"
							@remove="() => onRemoveFavorite(movie.id)"
						/>
					</SwiperSlide>
				</Swiper>
			</div>
		</template>
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
	import { Swiper, SwiperSlide } from 'swiper/vue'
	import 'swiper/css'

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
		@media (max-width: 1200px) {
			overflow-x: clip;
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

		&__list {
			display: grid;
			grid-template-columns: repeat(5, 1fr);
			gap: 64px 40px;
			justify-content: start;
			justify-items: start;

			@media (max-width: 1200px) {
				display: none;
			}
		}

		&__loading {
			display: grid;
			grid-template-columns: repeat(auto-fill, 224px);
			gap: 64px 40px;
			justify-content: start;
		}

		&__swiper-wrap {
			display: none;

			@media (max-width: 1200px) {
				display: block;
				margin-left: -40px;
				margin-right: -40px;
				padding-left: 40px;
				padding-right: 40px;
				position: relative;
				overflow: visible;
				z-index: 1;
			}
		}

		:deep(.swiper) {
			overflow: visible !important;
			z-index: 2;
		}

		:deep(.swiper-wrapper) {
			overflow: visible !important;
			z-index: 3;
		}

		:deep(.swiper-slide) {
			width: 224px !important;
			flex-shrink: 0;
			position: relative;
			overflow: visible !important;
			z-index: 4;
		}

		:deep(.film-card) {
			overflow: visible !important;
			position: relative;
			z-index: 5;
		}
	}
</style>
