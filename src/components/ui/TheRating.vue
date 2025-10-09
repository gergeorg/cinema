<template>
	<div class="rating" :class="ratingClass" aria-label="Рейтинг фильма">
		<BaseIcon width="16" height="16" name="rating" />
		<span class="rating__num">{{ formattedRating }}</span>
	</div>
</template>

<script setup lang="ts">
	import { computed } from 'vue'
	import BaseIcon from './BaseIcon.vue'

	interface Props {
		value?: number | string | null
		color?: 'yellow' | 'green' | 'gray' | 'red' | null
	}

	const props = defineProps<Props>()

	const getColorByRating = (rating: number): 'yellow' | 'green' | 'gray' | 'red' => {
		if (rating >= 8) return 'yellow'
		if (rating >= 7) return 'green'
		if (rating >= 6) return 'gray'
		return 'red'
	}

	const ratingClass = computed(() => {
		const fallbackColor = getColorByRating(Number(props.value) || 0)
		const color = props.color ?? fallbackColor
		return `rating--${color}`
	})

	const formattedRating = computed(() => {
		if (props.value == null || props.value === '') return '—'
		return String(props.value).replace('.', ',')
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
		background-color: #777;

		&__icon {
			flex-shrink: 0;
		}

		&__num {
			font-weight: 700;
			font-size: 18px;
			line-height: 133%;
			color: #fff;
		}

		&--yellow {
			background-color: #a59400;
		}

		&--green {
			background-color: #308e21;
		}

		&--gray {
			background-color: #777;
		}

		&--red {
			background-color: #c82020;
		}
	}
</style>
