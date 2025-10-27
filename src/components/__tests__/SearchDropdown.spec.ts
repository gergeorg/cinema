import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import SearchDropdown from '@/components/ui/SearchDropdown.vue'
import TheRating from '@/components/ui/TheRating.vue'

const mockMovies = [
	{
		id: 1,
		title: 'Movie 1',
		posterUrl: 'poster1.jpg',
		tmdbRating: 8.2,
		releaseYear: 2023,
		genres: ['Action'],
		runtime: 120,
		plot: 'text',
		backdropUrl: 'string',
		language: 'en',
		budget: 1000000,
		revenue: 1,
		director: 'string',
		production: 'string',
		awardsSummary: 'string',
		trailerUrl: 'string',
	},
	{
		id: 2,
		title: 'Movie 2',
		posterUrl: 'poster2.jpg',
		tmdbRating: 7.5,
		releaseYear: 2022,
		genres: ['Comedy'],
		runtime: 95,
		plot: 'text',
		backdropUrl: 'string',
		language: 'en',
		budget: 1000000,
		revenue: 1,
		director: 'string',
		production: 'string',
		awardsSummary: 'string',
		trailerUrl: 'string',
	},
]

describe('SearchDropdown', () => {
	it('renders list items', () => {
		const wrapper = mount(SearchDropdown, {
			props: { items: mockMovies },
			global: { components: { TheRating } },
		})

		const items = wrapper.findAll('.search-dropdown__item')
		expect(items.length).toBe(mockMovies.length)
		expect(items.at(0)?.text()).toContain('Movie 1')
		expect(items.at(1)?.text()).toContain('Movie 2')
	})

	it('applies active class to the activeIndex', () => {
		const wrapper = mount(SearchDropdown, {
			props: { items: mockMovies, activeIndex: 1 },
			global: { components: { TheRating } },
		})

		const items = wrapper.findAll('.search-dropdown__item')
		expect(items.at(0)?.classes()).not.toContain('is-active')
		expect(items.at(1)?.classes()).toContain('is-active')
	})

	it('emits select event when clicking an item', async () => {
		const wrapper = mount(SearchDropdown, {
			props: { items: mockMovies },
			global: { components: { TheRating } },
		})

		const firstItem = wrapper.findAll('.search-dropdown__item').at(0)
		await firstItem?.trigger('click')

		expect(wrapper.emitted('select')).toBeTruthy()
		expect(wrapper.emitted('select')?.[0]).toEqual([1])
	})

	it('emits hover event when hovering over an item', async () => {
		const wrapper = mount(SearchDropdown, {
			props: { items: mockMovies },
			global: { components: { TheRating } },
		})

		const secondItem = wrapper.findAll('.search-dropdown__item').at(1)
		await secondItem?.trigger('mouseenter')

		expect(wrapper.emitted('hover')).toBeTruthy()
		expect(wrapper.emitted('hover')?.[0]).toEqual([1])
	})

	it('emits select event when pressing Enter on an item', async () => {
		const wrapper = mount(SearchDropdown, {
			props: { items: mockMovies },
			global: { components: { TheRating } },
		})

		const firstItem = wrapper.findAll('.search-dropdown__item').at(0)
		await firstItem?.trigger('keydown.enter')

		expect(wrapper.emitted('select')).toBeTruthy()
		expect(wrapper.emitted('select')?.[0]).toEqual([1])
	})

	it('displays correct movie details', () => {
		const wrapper = mount(SearchDropdown, {
			props: { items: mockMovies },
			global: { components: { TheRating } },
		})

		const firstItem = wrapper.findAll('.search-dropdown__item').at(0)
		expect(firstItem?.find('img').attributes('src')).toBe('poster1.jpg')
		expect(firstItem?.find('.search-dropdown__year').text()).toBe('2023')
		expect(firstItem?.find('.search-dropdown__genre').text()).toBe('Action')
		expect(firstItem?.find('.search-dropdown__runtime').text()).toBe('2ч 0м')
	})
})
