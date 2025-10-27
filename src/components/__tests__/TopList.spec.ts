import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref, type Ref } from 'vue'
import TopList from '../TopList.vue'
import { useMoviesStore } from '@/stores/useMoviesStore'
import type { IMovie } from '@/types'

vi.mock('../FilmCard.vue', () => ({
	default: {
		name: 'FilmCard',
		template: '<div data-testid="film-card"><slot /></div>',
		props: ['movie', 'index', 'showNumber'],
	},
}))

vi.mock('../FilmCardSkeleton.vue', () => ({
	default: {
		name: 'FilmCardSkeleton',
		template: '<div data-testid="film-skeleton"><slot /></div>',
	},
}))

vi.mock('../TheError.vue', () => ({
	default: {
		name: 'TheError',
		props: { message: String },
		template: '<div data-testid="error" :data-message="message"><slot /></div>',
	},
}))

vi.mock('@/stores/useMoviesStore', () => ({
	useMoviesStore: vi.fn(),
}))

describe('TopList', () => {
	const mockTop10 = [
		{ id: 1, title: 'Movie 1' },
		{ id: 2, title: 'Movie 2' },
	]

	type MockMoviesStore = {
		top10: Ref<IMovie[]>
		loadingTop10: Ref<boolean>
		errorTop10: Ref<string | null>
		fetchTop10: () => void
	}

	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('renders the title correctly', () => {
		type MockMoviesStore = {
			top10: Ref<IMovie[]>
			loadingTop10: Ref<boolean>
			errorTop10: Ref<string | null>
			fetchTop10: () => void
		}

		const mockStore: MockMoviesStore = {
			top10: ref([]) as Ref<IMovie[]>,
			loadingTop10: ref(false),
			errorTop10: ref(null),
			fetchTop10: vi.fn(),
		}

		vi.mocked(useMoviesStore).mockReturnValue(
			mockStore as unknown as ReturnType<typeof useMoviesStore>,
		)

		const wrapper = mount(TopList)

		expect(wrapper.find('.top-list__title').text()).toBe('Топ 10 фильмов')
	})

	it('calls fetchTop10 on mount', async () => {
		const mockFetchTop10 = vi.fn()
		const mockStore: MockMoviesStore = {
			top10: ref([]) as Ref<IMovie[]>,
			loadingTop10: ref(false),
			errorTop10: ref(null),
			fetchTop10: mockFetchTop10,
		}
		vi.mocked(useMoviesStore).mockReturnValue(
			mockStore as unknown as ReturnType<typeof useMoviesStore>,
		)

		mount(TopList)

		expect(mockFetchTop10).toHaveBeenCalledExactlyOnceWith()
	})

	it('shows loading skeletons when loadingTop10 is true', async () => {
		const mockStore: MockMoviesStore = {
			top10: ref([]) as Ref<IMovie[]>,
			loadingTop10: ref(true),
			errorTop10: ref(null),
			fetchTop10: vi.fn(),
		}
		vi.mocked(useMoviesStore).mockReturnValue(
			mockStore as unknown as ReturnType<typeof useMoviesStore>,
		)

		const wrapper = mount(TopList)

		const skeletons = wrapper.findAllComponents({ name: 'FilmCardSkeleton' })
		expect(skeletons.length).toBe(10)
		expect(wrapper.findComponent({ name: 'TheError' }).exists()).toBe(false)
		expect(wrapper.findAllComponents({ name: 'FilmCard' }).length).toBe(0)
	})

	it('shows error component when errorTop10 is present', async () => {
		const errorMessage = 'Failed to load top 10'
		const mockStore: MockMoviesStore = {
			top10: ref([]) as Ref<IMovie[]>,
			loadingTop10: ref(false),
			errorTop10: ref(errorMessage),
			fetchTop10: vi.fn(),
		}
		vi.mocked(useMoviesStore).mockReturnValue(
			mockStore as unknown as ReturnType<typeof useMoviesStore>,
		)

		const wrapper = mount(TopList)

		const errorEl = wrapper.findComponent({ name: 'TheError' })
		expect(errorEl.exists()).toBe(true)
		expect(errorEl.props('message')).toBe(errorMessage)
		expect(wrapper.findAllComponents({ name: 'FilmCardSkeleton' }).length).toBe(0)
		expect(wrapper.findAllComponents({ name: 'FilmCard' }).length).toBe(0)
	})

	it('shows FilmCard components when top10 data is loaded', async () => {
		const mockStore: MockMoviesStore = {
			top10: ref(mockTop10) as Ref<IMovie[]>,
			loadingTop10: ref(false),
			errorTop10: ref(null),
			fetchTop10: vi.fn(),
		}
		vi.mocked(useMoviesStore).mockReturnValue(
			mockStore as unknown as ReturnType<typeof useMoviesStore>,
		)

		const wrapper = mount(TopList)

		const list = wrapper.find('.top-list__list')
		const filmCards = list.exists() ? list.findAll('[data-testid="film-card"]') : []
		expect(filmCards.length).toBe(mockTop10.length)

		expect(wrapper.findAllComponents({ name: 'FilmCardSkeleton' }).length).toBe(0)
		expect(wrapper.findComponent({ name: 'TheError' }).exists()).toBe(false)
	})

	it('handles async fetch and transitions from loading to loaded state', async () => {
		const mockStore: MockMoviesStore = {
			top10: ref([]) as Ref<IMovie[]>,
			loadingTop10: ref(true),
			errorTop10: ref(null),
			fetchTop10: vi.fn(),
		}
		vi.mocked(useMoviesStore).mockReturnValue(
			mockStore as unknown as ReturnType<typeof useMoviesStore>,
		)

		const wrapper = mount(TopList)

		expect(wrapper.findAllComponents({ name: 'FilmCardSkeleton' }).length).toBe(10)

		mockStore.loadingTop10.value = false
		mockStore.top10.value = mockTop10 as unknown as IMovie[]
		await wrapper.vm.$nextTick()

		const listAfter = wrapper.find('.top-list__list')
		const filmCardsAfter = listAfter.exists() ? listAfter.findAll('[data-testid="film-card"]') : []
		expect(filmCardsAfter.length).toBe(mockTop10.length)
		expect(wrapper.findAllComponents({ name: 'FilmCardSkeleton' }).length).toBe(0)
	})
})
