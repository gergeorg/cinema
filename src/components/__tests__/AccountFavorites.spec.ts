import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import AccountFavorites from '@/components/AccountFavorites.vue'
import { useFavoritesStore } from '@/stores/useFavoritesStore'

type FetchFn = () => Promise<void>
type RemoveFn = (id: string) => Promise<void>
type FetchByIdFn = (id: string) => Promise<void>

const mockFetchFavorites: FetchFn = vi.fn(async () => {})
const mockRemoveFavorite: RemoveFn = vi.fn(async () => {})
const mockFetchMovieById: FetchByIdFn = vi.fn(async () => {})

const mockGetMovieById = vi.fn((id: string) =>
	id === '10' ? { id: '10', title: 'Inception' } : null,
)

vi.mock('@/stores/useFavoritesStore', () => ({
	useFavoritesStore: vi.fn(() => ({
		favorites: ref(['10']),
		loading: ref(false),
		error: ref(null),
		fetchFavorites: mockFetchFavorites,
		removeFavorite: mockRemoveFavorite,
	})),
}))

vi.mock('@/stores/useMoviesStore', () => ({
	useMoviesStore: vi.fn(() => ({
		getMovieById: mockGetMovieById,
		fetchMovieById: mockFetchMovieById,
	})),
}))

vi.mock('@/components/TheError.vue', () => ({
	default: {
		name: 'TheError',
		props: ['message'],
		template: '<div class="mock-error">{{ message }}</div>',
	},
}))

vi.mock('@/components/FilmCard.vue', () => ({
	default: {
		name: 'FilmCard',
		props: ['movie', 'index', 'showNumber', 'showRemove'],
		emits: ['remove'],
		template: `<li class="mock-film-card" @click="$emit('remove')">{{ movie.title }}</li>`,
	},
}))

vi.mock('@/components/FilmCardSkeleton.vue', () => ({
	default: {
		name: 'FilmCardSkeleton',
		template: '<div class="mock-skeleton"></div>',
	},
}))

describe('AccountFavorites.vue', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('отображает сообщение об ошибке, если есть ошибка', async () => {
		vi.mocked(useFavoritesStore).mockReturnValueOnce({
			favorites: ref([]),
			loading: ref(false),
			error: ref('Ошибка загрузки'),
			fetchFavorites: mockFetchFavorites,
			removeFavorite: mockRemoveFavorite,
		} as unknown as ReturnType<typeof useFavoritesStore>)

		const wrapper = mount(AccountFavorites)
		await flushPromises()

		expect(wrapper.find('.mock-error').exists()).toBe(true)
		expect(wrapper.find('.mock-error').text()).toContain('Ошибка загрузки')
	})

	it('показывает список фильмов, если есть избранные', async () => {
		const wrapper = mount(AccountFavorites)
		await flushPromises()

		const listCards = wrapper.findAll('.favorites__list .mock-film-card')
		expect(listCards.length).toBe(1)
		expect(listCards.at(0)?.text()).toBe('Inception')
	})

	it('вызвает removeFavorite при удалении фильма', async () => {
		const wrapper = mount(AccountFavorites)
		await flushPromises()

		const card = wrapper.find('.favorites__list .mock-film-card')
		expect(card.exists()).toBe(true)

		await card.trigger('click')
		await flushPromises()

		expect(mockRemoveFavorite).toHaveBeenCalledTimes(1)
		expect(mockRemoveFavorite).toHaveBeenCalledExactlyOnceWith('10')
	})
})
