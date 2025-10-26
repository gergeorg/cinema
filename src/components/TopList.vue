<template>
	<section class="top-list">
		<div class="container top-list__container">
			<h2 class="top-list__title">Топ 10 фильмов</h2>

			<template v-if="errorTop10">
				<TheError :message="errorTop10" />
			</template>

			<template v-else-if="loadingTop10">
				<ul class="top-list__list" aria-hidden="true">
					<FilmCardSkeleton v-for="n in 10" :key="n" />
				</ul>
			</template>

			<template v-else>
				<ul class="top-list__list">
					<FilmCard
						v-for="(movie, i) in top10"
						:key="movie.id"
						:movie="movie"
						:index="i + 1"
						:showNumber="true"
					/>
				</ul>

				<div class="top-list__swiper-wrap">
					<Swiper
						class="top-list__swiper"
						slides-per-view="auto"
						:space-between="40"
						:breakpoints="{
							1200: { slidesPerView: 'auto', spaceBetween: 40 },
							768: { slidesPerView: 'auto', spaceBetween: 40 },
							0: { slidesPerView: 'auto', spaceBetween: 40 },
						}"
						:watch-overflow="true"
					>
						<SwiperSlide v-for="(movie, i) in top10" :key="movie.id">
							<FilmCard :movie="movie" :index="i + 1" :showNumber="true" />
						</SwiperSlide>
					</Swiper>
				</div>
			</template>
		</div>
	</section>
</template>

<script setup lang="ts">
	import { onMounted } from 'vue'
	import { storeToRefs } from 'pinia'
	import { useMoviesStore } from '@/stores/useMoviesStore'
	import FilmCard from './FilmCard.vue'
	import FilmCardSkeleton from './FilmCardSkeleton.vue'
	import TheError from './TheError.vue'
	import { Swiper, SwiperSlide } from 'swiper/vue'
	import 'swiper/css'

	const moviesStore = useMoviesStore()
	const { top10, loadingTop10, errorTop10 } = storeToRefs(moviesStore)

	onMounted(() => {
		moviesStore.fetchTop10()
	})
</script>

<style scoped lang="scss">
	.top-list {
		padding-bottom: 120px;
		overflow-x: clip;

		@media (max-width: 640px) {
			padding-bottom: 32px;
		}

		&__title {
			margin-bottom: 64px;
			font-weight: 700;
			font-size: 40px;
			line-height: 120%;
			color: var(--color-white);

			@media (max-width: 640px) {
				font-size: 24px;
				margin-bottom: 40px;
			}
		}

		&__list {
			display: grid;
			grid-template-columns: repeat(5, 1fr);
			gap: 64px 40px;

			@media (max-width: 1200px) {
				display: none;
			}
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
