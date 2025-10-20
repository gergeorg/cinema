<template>
	<form class="search" @submit.prevent>
		<input
			v-model="query"
			@input="onInput"
			@keydown="onKeydown"
			@keydown.esc="close"
			:type="'search'"
			:aria-activedescendant="activeDescendant"
			aria-controls="search-dropdown"
			:aria-expanded="open"
			class="search__input"
			name="search"
			id="search-input"
			placeholder="Поиск"
			autocomplete="off"
			aria-label="Поиск фильмов"
		/>

		<BaseButton
			v-if="query"
			type="button"
			variant="plain"
			class="search__clear"
			aria-label="Очистить поиск"
			@click="clearQuery"
		>
			<BaseIcon width="24" height="24" name="close" />
		</BaseButton>

		<BaseButton type="submit" variant="plain" class="search__button" aria-label="Искать">
			<BaseIcon width="25" height="24" name="search" />
		</BaseButton>

		<SearchDropdown
			v-if="open && results.length"
			:items="results"
			:activeIndex="activeIndex"
			@select="goToMovie"
			@hover="onHover"
		/>
	</form>
</template>

<script setup lang="ts">
	import BaseIcon from './BaseIcon.vue'
	import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
	import { useRouter } from 'vue-router'
	import { useMoviesStore } from '@/stores/useMoviesStore'
	import type { IMovie } from '@/types'
	import SearchDropdown from './SearchDropdown.vue'
	import BaseButton from './BaseButton.vue'

	const router = useRouter()
	const moviesStore = useMoviesStore()

	const query = ref('')
	const results = ref<IMovie[]>([])
	const open = ref(false)
	const activeIndex = ref(-1)
	const activeDescendant = computed(() => {
		const idx = activeIndex.value
		if (idx < 0 || !results.value[idx]) return undefined
		return `search-item-${results.value[idx].id}`
	})
	let timer: number | undefined

	const onInput = () => {
		if (timer) clearTimeout(timer)
		timer = window.setTimeout(search, 300)
	}

	const onKeydown = (e: KeyboardEvent) => {
		if (e.key === 'Tab') {
			if (open.value && !e.shiftKey) {
				dropdownRef.value?.focusFirst?.()
				return
			}
			return
		}
		if (!open.value) return
		if (e.key === 'Enter') {
			const sel = results.value[activeIndex.value]
			if (sel) goToMovie(sel.id)
		} else if (e.key === 'Escape') close()
	}

	type DropdownExpose = {
		scrollToItemId?: (id: string | number) => void
		focusItemId?: (id: string | number) => void
		focusFirst?: () => void
	}
	const dropdownRef = ref<DropdownExpose | null>(null)

	const onHover = (i: number) => (activeIndex.value = i)

	const search = async () => {
		const q = query.value.trim()
		if (!q) {
			results.value = []
			open.value = false
			activeIndex.value = -1
			return
		}

		await moviesStore.fetchAllMovies()

		const list = moviesStore.allMovies.filter((m) =>
			(m.title ?? '').toLowerCase().includes(q.toLowerCase()),
		)

		results.value = list.slice(0, 5)
		open.value = results.value.length > 0
		activeIndex.value = results.value.length ? 0 : -1
	}

	const close = () => {
		open.value = false
		activeIndex.value = -1
	}

	const goToMovie = (id: string | number) => {
		close()
		query.value = ''
		router.push({ path: `/movies/${id}` })
	}

	const onDocClick = (e: MouseEvent) => {
		const target = e.target as HTMLElement | null
		const form = document.querySelector('.search')
		if (!form) return
		if (target && !form.contains(target)) close()
	}

	const clearQuery = () => {
		query.value = ''
		results.value = []
		open.value = false
		activeIndex.value = -1
		document.getElementById('search-input')?.focus()
	}

	onMounted(() => document.addEventListener('click', onDocClick))
	onBeforeUnmount(() => document.removeEventListener('click', onDocClick))
</script>

<style scoped lang="scss">
	.search {
		position: relative;

		&:focus-within,
		&:hover {
			.search__button,
			.search__clear {
				svg {
					fill: var(--color-hover);
					fill-opacity: 1;
				}
			}
		}

		&__input {
			border-radius: 8px;
			width: 655px;
			padding: 12px 16px 12px 52px;
			background-color: #393b3c;
			border: none;
			outline: none;

			font-family: inherit;
			font-weight: 400;
			color: var(--color-white);

			&::-webkit-search-cancel-button {
				-webkit-appearance: none;
				appearance: none;
			}

			&:focus-visible,
			&:active {
				outline: 1px solid var(--color-hover);
			}
		}

		&__button {
			padding: 0;
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			left: 16px;
			outline: none;
			background: none;
			border: none;
			cursor: pointer;

			svg {
				fill: var(--color-white);
				fill-opacity: 0.5;
			}
		}

		&__clear {
			opacity: 0;
			padding: 0;
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			right: 16px;
			outline: none;
			background: none;
			border: none;
			cursor: pointer;

			svg {
				fill: var(--color-white);
				fill-opacity: 0.5;
			}
		}
	}
</style>
