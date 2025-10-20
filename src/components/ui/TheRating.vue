<template>
	<div :class="['rating', ratingClass, { 'rating--compact': compact }]" aria-label="Рейтинг фильма">
		<BaseIcon :width="compact ? 10 : 16" :height="compact ? 10 : 16" name="rating" />
		<span class="rating__num">{{ formattedRating }}</span>
	</div>
</template>

<script setup lang="ts">
	import { computed } from 'vue'
	import BaseIcon from './BaseIcon.vue'

	interface Props {
		value?: number | string | null
		color?: 'yellow' | 'green' | 'gray' | 'red' | null
		compact?: boolean
	}

	const props = defineProps<Props>()
	const compact = !!props.compact

	const getColorByRating = (rating: number) =>
		rating >= 8 ? 'yellow' : rating >= 7 ? 'green' : rating >= 6 ? 'gray' : 'red'

	const ratingClass = computed(
		() => `rating--${props.color ?? getColorByRating(Number(props.value) || 0)}`,
	)

	const formattedRating = computed(() => {
		if (props.value == null || props.value === '') return '—'

		const num = Number(props.value)
		if (isNaN(num)) return '—'
		const rounded = Math.round(num * 10) / 10

		return String(rounded).replace('.', ',')
	})
</script>

<style scoped lang="scss">
	.rating {
		display: flex;
		align-items: center;
		gap: 4px;
		border-radius: 16px;
		padding: 4px 12px;
		width: fit-content;
		height: 32px;
		background-color: var(--color-gray);

		&__num {
			font-weight: 700;
			color: var(--color-white);
		}

		&--yellow {
			background-color: var(--color-yellow);
		}
		&--green {
			background-color: var(--color-green);
		}
		&--gray {
			background-color: var(--color-gray);
		}
		&--red {
			background-color: var(--color-red);
		}

		&.rating--compact {
			border-radius: 16px;
			padding: 2px 8px;
			width: 47px;
			height: 20px;

			& .rating__num {
				font-size: 12px;
			}
		}
	}
</style>
