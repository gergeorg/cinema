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
				<!-- Десктоп -->
				<ul class="top-list__list">
					<FilmCard
						v-for="(movie, i) in top10"
						:key="movie.id"
						:movie="movie"
						:index="i + 1"
						:showNumber="true"
					/>
				</ul>

				<!-- Мобильный Swiper -->
				<div class="top-list__swiper-wrap">
					<Swiper
						class="top-list__swiper"
						slides-per-view="auto"
						:space-between="24"
						:breakpoints="swiperBreakpoints"
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

	// ✅ Оптимизированные брейкпоинты
	const swiperBreakpoints = {
		1200: {
			spaceBetween: 40,
		},
		768: {
			spaceBetween: 40,
		},
		680: {
			spaceBetween: 40,
		},
	}
</script>

<style scoped lang="scss">
	.top-list {
		padding-bottom: 120px;

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

		/* --- Десктоп --- */
		&__list {
			display: grid;
			grid-template-columns: repeat(5, 1fr);
			gap: 64px 40px;

			@media (max-width: 1200px) {
				display: none;
			}
		}

		/* --- Swiper-обёртка --- */
		&__swiper-wrap {
			display: none;

			@media (max-width: 1200px) {
				display: block;
				margin-left: -40px; /* выносим за пределы контейнера */
				margin-right: 0px;
				padding-left: 40px;
				// overflow: hidden; /* обрезаем за пределами контейнера */
			}
		}

		&__swiper {
			overflow: visible !important;
		}

		:deep(.swiper) {
			overflow: visible !important;
		}

		:deep(.swiper-wrapper) {
			overflow: visible !important;
		}

		:deep(.swiper-slide) {
			width: 224px !important; /* фикс ширина карточки */
			flex-shrink: 0;
			overflow: visible !important;
			position: relative;
		}

		:deep(.film-card) {
			overflow: visible !important;
		}
	}
</style>
