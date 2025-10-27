import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import SearchForm from '@/components/ui/SearchForm.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseIcon from '@/components/ui/BaseIcon.vue'
import SearchDropdown from '@/components/ui/SearchDropdown.vue'
import type { VueWrapper } from '@vue/test-utils'
import type { ComponentPublicInstance } from 'vue'

type SearchFormPublic = {
	results: Array<{ title: string }>
	open: boolean
	query: string
	goToMovie: (id: number) => void
	activeIndex: number
	onHover: (index: number) => void
}

const push = vi.fn()
vi.mock('vue-router', () => ({
	useRouter: () => ({ push }),
}))

vi.mock('@/stores/useMoviesStore', () => ({
	useMoviesStore: vi.fn(() => ({
		allMovies: [
			{ id: 1, title: 'Movie 1' },
			{ id: 2, title: 'Movie 2' },
		],
		fetchAllMovies: vi.fn().mockResolvedValue([]),
	})),
}))

describe('SearchForm', () => {
	let wrapper: VueWrapper<ComponentPublicInstance & SearchFormPublic>

	beforeEach(() => {
		vi.clearAllMocks()
		wrapper = mount(SearchForm, {
			global: {
				components: { BaseButton, BaseIcon, SearchDropdown },
			},
		}) as unknown as VueWrapper<ComponentPublicInstance & SearchFormPublic>
	})

	it('renders input and buttons', () => {
		const input = wrapper.find('input[type="search"]')
		const submitButton = wrapper.find('.search__button')
		expect(input.exists()).toBe(true)
		expect(submitButton.exists()).toBe(true)
	})

	it('updates query and triggers search', async () => {
		const input = wrapper.find('input[type="search"]')
		await input.setValue('Movie 1')

		await new Promise((r) => setTimeout(r, 350))
		await flushPromises()

		expect(wrapper.vm.results.length).toBe(1)
		expect(wrapper.vm.results[0]!.title).toBe('Movie 1')
		expect(wrapper.vm.open).toBe(true)
	})

	it('clears query when clear button is clicked', async () => {
		const input = wrapper.find('input[type="search"]')
		await input.setValue('Movie 1')
		await new Promise((r) => setTimeout(r, 350))
		await flushPromises()

		const clearBtn = wrapper.find('.search__clear')
		await clearBtn.trigger('click')

		expect(wrapper.vm.query).toBe('')
		expect(wrapper.vm.results.length).toBe(0)
		expect(wrapper.vm.open).toBe(false)
	})

	it('emits navigation on selecting a movie', async () => {
		const input = wrapper.find('input[type="search"]')
		await input.setValue('Movie 1')
		await new Promise((r) => setTimeout(r, 350))
		await flushPromises()

		wrapper.vm.goToMovie(1)
		expect(push).toHaveBeenCalledTimes(1)
		expect(push).toHaveBeenCalledExactlyOnceWith({ path: '/movies/1' })
		expect(wrapper.vm.query).toBe('')
		expect(wrapper.vm.open).toBe(false)
	})

	it('updates activeIndex on hover', async () => {
		const input = wrapper.find('input[type="search"]')
		await input.setValue('Movie 1')
		await new Promise((r) => setTimeout(r, 350))
		await flushPromises()

		wrapper.vm.onHover(0)
		expect(wrapper.vm.activeIndex).toBe(0)
	})

	it('closes dropdown on Escape key', async () => {
		const input = wrapper.find('input[type="search"]')
		await input.setValue('Movie 1')
		await new Promise((r) => setTimeout(r, 350))
		await flushPromises()

		await input.trigger('keydown.esc')
		expect(wrapper.vm.open).toBe(false)
	})
})
