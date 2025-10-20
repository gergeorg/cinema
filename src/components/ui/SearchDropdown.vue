<template>
	<ul v-if="displayedItems.length" class="search-dropdown" role="listbox" ref="root">
		<li
			v-for="(movie, index) in displayedItems"
			:key="movie.id"
			:id="`search-item-${movie.id}`"
			:class="['search-dropdown__item', { 'is-active': index === currentActiveIndex }]"
			@click="$emit('select', movie.id)"
			@mouseenter="$emit('hover', index)"
			tabindex="0"
			@focus="$emit('hover', index)"
			@keydown.enter.prevent="$emit('select', movie.id)"
			role="option"
			:aria-selected="index === currentActiveIndex"
		>
			<img
				:src="movie.posterUrl ?? placeholder"
				:alt="movie.title"
				class="search-dropdown__thumb"
			/>
			<div class="search-dropdown__meta">
				<div class="search-dropdown__info">
					<TheRating class="search-dropdown__rating" :value="movie.tmdbRating" compact />
					<span class="search-dropdown__year">{{ movie.releaseYear ?? '' }}</span>
					<span class="search-dropdown__genre">{{ movie.genres?.[0] ?? '' }}</span>
					<span class="search-dropdown__runtime">{{ formatRuntime(movie.runtime) }}</span>
				</div>
				<h3 class="search-dropdown__title">{{ movie.title }}</h3>
			</div>
		</li>
	</ul>
</template>

<script setup lang="ts">
	import type { IMovie } from '@/types'
	import placeholder from '@/assets/no-poster.png'
	import { ref, computed, defineExpose } from 'vue'
	import TheRating from './TheRating.vue'

	const props = defineProps<{ items: IMovie[]; activeIndex?: number }>()
	const displayedItems = computed(() => props.items || [])
	const currentActiveIndex = computed(() => props.activeIndex ?? -1)

	const root = ref<HTMLElement | null>(null)

	const formatRuntime = (minutes?: number | null) => {
		if (!minutes) return ''
		const h = Math.floor(minutes / 60)
		const m = minutes % 60
		return h ? `${h}ч ${m}м` : `${m}м`
	}

	const scrollToItemId = (id: string | number) => {
		const el = root.value?.querySelector(`#search-item-${id}`) as HTMLElement | null
		el?.scrollIntoView({ block: 'nearest' })
	}

	const focusItemId = (id: string | number) => {
		const el = root.value?.querySelector(`#search-item-${id}`) as HTMLElement | null
		el?.focus()
	}

	const focusFirst = () => {
		const first = root.value?.querySelector('.search-dropdown__item') as HTMLElement | null
		first?.focus()
	}

	defineExpose({ scrollToItemId, focusItemId, focusFirst })
</script>

<style scoped lang="scss">
	.search-dropdown {
		position: absolute;
		top: calc(100% + 12px);
		right: 0;
		width: 720px;
		background-color: #393b3c;
		border-radius: 8px;
		padding: 8px;
		max-width: 559px;
		z-index: 30;

		&__item {
			display: flex;
			align-items: center;
			gap: 12px;
			padding: 20px 8px;
			border-radius: 8px;
			cursor: pointer;
			transition: background-color 0.3s ease-in-out;

			&:hover {
				background-color: rgba(255, 255, 255, 0.2);
			}

			&:focus,
			&:focus-visible {
				outline: 1px solid var(--color-hover);
				border-radius: 6px;
			}

			&.is-active {
				outline: 1px solid var(--color-white-05);
				border-radius: 6px;
			}
		}

		&__thumb {
			width: 40px;
			height: 52px;
		}

		&__title {
			font-weight: 700;
			color: var(--color-white);
		}

		&__info {
			display: flex;
			align-items: center;
			gap: 12px;
			margin-bottom: 8px;
			color: var(--color-white-07);
			font-weight: 400;
			font-size: 14px;
			line-height: 143%;
		}

		&__meta {
			flex: 1;
			min-width: 0;
		}

		&__rating {
			color: var(--color-white);
		}
	}
</style>
