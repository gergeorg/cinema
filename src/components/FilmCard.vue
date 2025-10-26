<template>
	<li class="film-card" :class="{ 'film-card--hoverable': showRemove }">
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

		<button
			v-if="showRemove"
			class="film-card__remove"
			type="button"
			@click.stop="$emit('remove', movie.id)"
			aria-label="Удалить из избранного"
		>
			<BaseIcon name="close" size="24" />
		</button>
	</li>
</template>

<script setup lang="ts">
	import { RouterLink } from 'vue-router'
	import type { IMovie } from '@/types'
	import { withDefaults, defineProps } from 'vue'
	import placeholder from '@/assets/no-poster.png'
	import BaseIcon from './ui/BaseIcon.vue'

	const props = withDefaults(
		defineProps<{
			movie: IMovie
			index?: number
			showNumber?: boolean
			showRemove?: boolean
		}>(),
		{ showNumber: true, showRemove: false },
	)

	const { movie, index, showNumber, showRemove } = props
</script>

<style scoped lang="scss">
	.film-card {
		position: relative;
		border: 1px solid rgba(255, 255, 255, 0.25);
		border-radius: 16px;
		background-color: #3c3c3c;
		box-shadow: 0 0 80px 0 rgba(255, 255, 255, 0.33);
		overflow: visible;
		z-index: 4 !important;
		transition:
			box-shadow 0.3s ease-in-out,
			transform 0.3s ease-in-out;

		@media (max-width: 1200px) {
			box-shadow: none;
		}

		&__link {
			display: block;
			border-radius: 16px;
			transition:
				transform 0.3s ease-in-out,
				box-shadow 0.3s ease-in-out;
			will-change: transform, box-shadow;

			&:hover,
			&:focus-visible {
				box-shadow: 0 0 130px 0 rgba(180, 169, 255, 0.33);
				transform: scale(1.04);
			}

			&:focus-visible {
				outline: none;
				outline: 1px solid var(--color-hover);
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
			color: var(--color-violet);
			background-color: var(--color-white);
			z-index: 10;
			pointer-events: none;
		}

		&__image {
			min-width: 224px;
			width: 100%;
			height: 100%;
			min-height: 336px;
			object-fit: cover;
			border-radius: 16px;
		}

		&__remove {
			position: absolute;
			top: -20px;
			right: -20px;
			background: var(--color-white);
			border-radius: 30px;
			width: 40px;
			height: 40px;
			border: none;
			display: inline-flex;
			align-items: center;
			justify-content: center;
			cursor: pointer;
			box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
			transition:
				opacity 0.18s ease,
				transform 0.18s cubic-bezier(0.2, 0.9, 0.2, 1);
			transform: translateY(-6px) scale(0.96);
			opacity: 0;
			pointer-events: none;
			z-index: 11;
		}

		&--hoverable {
			&:hover .film-card__remove,
			&:focus-within .film-card__remove {
				opacity: 1;
				pointer-events: auto;
				transform: translateY(0) scale(1);
			}
		}
	}
</style>
