<template>
	<li class="film-card">
		<RouterLink
			:to="`/movies/${movie.id}`"
			class="film-card__link"
			aria-label="Перейти к странице фильма"
		>
			<div v-if="showNumber && index" class="film-card__num">{{ index }}</div>
			<img
				:src="movie.posterUrl ?? placeholder"
				:alt="movie.title"
				class="film-card__image"
				loading="lazy"
			/>
		</RouterLink>
	</li>
</template>

<script setup lang="ts">
	import { RouterLink } from 'vue-router'
	import type { IMovie } from '@/types'
	import { withDefaults, defineProps } from 'vue'
	import placeholder from '@/assets/no-poster.png'

	const props = withDefaults(
		defineProps<{
			movie: IMovie
			index?: number
			showNumber?: boolean
		}>(),
		{ showNumber: true },
	)

	const { movie, index, showNumber } = props
</script>

<style scoped lang="scss">
	.film-card {
		position: relative;
		border: 1px solid rgba(255, 255, 255, 0.25);
		border-radius: 16px;
		background-color: #3c3c3c;
		box-shadow: 0 0 80px 0 rgba(255, 255, 255, 0.33);
		transition:
			box-shadow 0.3s ease-in-out,
			transform 0.3s ease-in-out;

		&__link {
			display: block;
			border-radius: 16px;

			&:hover,
			&:focus-visible {
				box-shadow: 0 0 130px 0 rgba(180, 169, 255, 0.33);
				transform: scale(1.04);
			}

			&:focus-visible {
				outline: none;
				outline: 1px solid #b4a9ff;
				outline-offset: 4px;
				border-radius: 16px;
			}
		}

		&__num {
			position: absolute;
			top: -12px;
			left: -12px;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 50px;
			padding: 8px;
			width: 62px;
			font-weight: 700;
			font-size: 24px;
			line-height: 133%;
			color: #6a5dc2;
			background-color: #fff;
		}

		&__image {
			max-width: 224px;
			width: 100%;
			height: 336px;
			object-fit: cover;
			border-radius: 16px;
		}
	}
</style>
