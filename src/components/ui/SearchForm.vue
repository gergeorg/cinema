<template>
	<form ref="formRef" :class="['search', { 'search--overlay': overlayOpen }]" @submit.prevent>
		<input
			v-model="query"
			@keydown="onKeydown"
			@keydown.esc="closeOverlay"
			type="search"
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
			v-if="overlayOpen || (query && results.length)"
			type="button"
			variant="plain"
			class="search__clear"
			:aria-label="overlayOpen ? 'Закрыть поиск' : 'Очистить поиск'"
			@click="overlayOpen ? closeOverlay() : clearQueryCloseOverlay()"
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
			ref="dropdownRef"
		/>
	</form>
</template>

<script setup lang="ts">
	import BaseIcon from './BaseIcon.vue'
	import BaseButton from './BaseButton.vue'
	import SearchDropdown from './SearchDropdown.vue'
	import {
		ref,
		computed,
		onMounted,
		onBeforeUnmount,
		watch,
		defineProps,
		defineEmits,
		nextTick,
	} from 'vue'
	import { useRouter } from 'vue-router'
	import { useMoviesStore } from '@/stores/useMoviesStore'
	import type { IMovie } from '@/types'
	import debounce from 'lodash/debounce'

	const props = defineProps({
		overlayOpen: { type: Boolean, default: false },
	})
	const emit = defineEmits(['update:overlayOpen'])

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

	type DropdownExpose = {
		scrollToItemId?: (id: string | number) => void
		focusItemId?: (id: string | number) => void
		focusFirst?: () => void
	}
	const dropdownRef = ref<DropdownExpose | null>(null)
	const formRef = ref<HTMLFormElement | null>(null)

	const search = async (q: string) => {
		const queryText = q.trim()
		if (!queryText) {
			results.value = []
			open.value = false
			activeIndex.value = -1
			return
		}

		await moviesStore.fetchAllMovies()

		const list = moviesStore.allMovies.filter((m) =>
			(m.title ?? '').toLowerCase().includes(queryText.toLowerCase()),
		)

		results.value = list.slice(0, 5)
		open.value = results.value.length > 0
		activeIndex.value = results.value.length ? 0 : -1
	}

	const debouncedSearch = debounce((q: string) => search(q), 300)

	watch(query, (newQuery) => {
		debouncedSearch(newQuery)
	})

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
		} else if (e.key === 'Escape') closeOverlay()
	}

	const onHover = (i: number) => (activeIndex.value = i)

	const close = () => {
		open.value = false
		activeIndex.value = -1
		results.value = []
	}

	const closeOverlay = () => {
		close()
		query.value = ''
		results.value = []
		activeIndex.value = -1

		if (props.overlayOpen) emit('update:overlayOpen', false)
	}

	const goToMovie = (id: string | number) => {
		closeOverlay()
		query.value = ''
		router.push({ path: `/movies/${id}` })
	}

	const onDocClick = (e: MouseEvent) => {
		const target = e.target as HTMLElement | null
		const form = formRef.value
		if (!form) return
		if (target && !form.contains(target)) closeOverlay()
	}

	const clearQuery = () => {
		query.value = ''
		results.value = []
		open.value = false
		activeIndex.value = -1
		document.getElementById('search-input')?.focus()
	}

	const clearQueryCloseOverlay = () => {
		clearQuery()
		if (props.overlayOpen) emit('update:overlayOpen', false)
	}

	watch(
		() => props.overlayOpen,
		async (val) => {
			if (val) {
				await nextTick()
				document.getElementById('search-input')?.focus()
			}
		},
	)

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
			width: 100%;
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

			@media (max-width: 768px) {
				left: 30px;
			}

			svg {
				fill: var(--color-white);
				fill-opacity: 0.5;
			}
		}

		&__clear {
			padding: 0;
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			right: 16px;
			outline: none;
			background: none;
			border: none;
			cursor: pointer;

			@media (max-width: 768px) {
				right: 30px;
			}

			svg {
				fill: var(--color-white);
				fill-opacity: 0.5;
			}
		}

		&__overlay-close {
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
				fill-opacity: 0.9;
			}
		}
	}

	@media (max-width: 768px) {
		.search {
			display: none;
		}

		.search--overlay {
			display: block;
			position: absolute;
			left: 0;
			right: 0;
			top: 8px;
			height: 56px;
			padding: 0px 20px;
			pointer-events: auto;
			z-index: 1201;
			display: flex;
			align-items: center;
			transform: translateY(-6px);
			opacity: 0;
			transition:
				transform 220ms ease,
				opacity 220ms ease;
		}

		.search--overlay {
			transform: translateY(0);
			opacity: 1;
		}
	}
</style>
