import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import TopFilmSkeleton from '../TopFilmSkeleton.vue'

describe('TopFilmSkeleton.vue', () => {
	let wrapper: ReturnType<typeof mount>

	beforeEach(() => {
		wrapper = mount(TopFilmSkeleton)
	})

	it('рендерит контейнер top-film', () => {
		expect(wrapper.exists()).toBe(true)
		expect(wrapper.classes()).toContain('skeleton__container')
	})

	it('содержит блоки skeleton для заголовка и текста', () => {
		expect(wrapper.find('.skeleton__title').exists()).toBe(true)
		expect(wrapper.find('.skeleton__text').exists()).toBe(true)
		expect(wrapper.find('.skeleton__text.short').exists()).toBe(true)
	})

	it('содержит skeleton кнопки', () => {
		const buttons = wrapper.findAll('.skeleton__btn')
		expect(buttons).toHaveLength(4)
		expect(wrapper.findAll('.skeleton__btn.small')).toHaveLength(2)
	})

	it('содержит skeleton для постера', () => {
		expect(wrapper.find('.skeleton__poster').exists()).toBe(true)
	})
})
