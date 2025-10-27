import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import FilmCard from '../FilmCard.vue'
import BaseIcon from '../ui/BaseIcon.vue'

const globalConfig = {
	components: {
		BaseIcon,
	},
	stubs: {
		RouterLink: {
			template: '<a><slot /></a>',
			props: ['to'],
		},
	},
}

describe('FilmCard.vue', () => {
	const movie = {
		id: 1,
		title: 'Тестовый фильм',
		posterUrl: 'test-poster.jpg',
		plot: 'text',
		releaseYear: 2000,
		genres: ['Action', 'Comedy'],
		tmdbRating: 7.5,
		runtime: 120,
		backdropUrl: 'string',
		language: 'en',
		budget: 1000000,
		revenue: 1,
		director: 'string',
		production: 'string',
		awardsSummary: 'string',
		trailerUrl: 'string',
	}

	it('рендерит изображение фильма и alt текст', () => {
		const wrapper = mount(FilmCard, {
			props: { movie },
			global: globalConfig,
		})

		const img = wrapper.find('img.film-card__image')
		expect(img.exists()).toBe(true)
		expect(img.attributes('src')).toBe('test-poster.jpg')
		expect(img.attributes('alt')).toBe('Тестовый фильм')
	})

	it('показывает номер фильма, если showNumber=true и передан index', () => {
		const wrapper = mount(FilmCard, {
			props: { movie, showNumber: true, index: 5 },
			global: globalConfig,
		})

		const num = wrapper.find('.film-card__num')
		expect(num.exists()).toBe(true)
		expect(num.text()).toBe('5')
	})

	it('не показывает номер фильма, если showNumber=false', () => {
		const wrapper = mount(FilmCard, {
			props: { movie, showNumber: false, index: 5 },
			global: globalConfig,
		})

		const num = wrapper.find('.film-card__num')
		expect(num.exists()).toBe(false)
	})

	it('показывает кнопку удаления, если showRemove=true', () => {
		const wrapper = mount(FilmCard, {
			props: { movie, showRemove: true },
			global: globalConfig,
		})

		const removeBtn = wrapper.find('button.film-card__remove')
		expect(removeBtn.exists()).toBe(true)
	})

	it('не показывает кнопку удаления, если showRemove=false', () => {
		const wrapper = mount(FilmCard, {
			props: { movie, showRemove: false },
			global: globalConfig,
		})

		const removeBtn = wrapper.find('button.film-card__remove')
		expect(removeBtn.exists()).toBe(false)
	})

	it('вызывает событие remove при клике на кнопку удаления', async () => {
		const wrapper = mount(FilmCard, {
			props: { movie, showRemove: true },
			global: globalConfig,
		})

		const removeBtn = wrapper.find('button.film-card__remove')
		await removeBtn.trigger('click')

		expect(wrapper.emitted()).toHaveProperty('remove')
		expect(wrapper.emitted('remove')![0]).toEqual([1])
	})
})
