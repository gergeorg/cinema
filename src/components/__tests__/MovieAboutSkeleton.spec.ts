import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import MovieAboutSkeleton from '../MovieAboutSkeleton.vue'

describe('MovieAboutSkeleton.vue', () => {
  it('рендерит заглушку секции фильма', () => {
    const wrapper = mount(MovieAboutSkeleton)

    expect(wrapper.find('.about-film__container').exists()).toBe(true)

    const title = wrapper.find('.skeleton--title')
    expect(title.exists()).toBe(true)

    const items = wrapper.findAll('.skeleton--item')
    expect(items.length).toBe(6)
  })

  it('каждый элемент skeleton имеет правильный CSS класс', () => {
    const wrapper = mount(MovieAboutSkeleton)
    const title = wrapper.find('.skeleton--title')
    expect(title.classes()).toContain('skeleton')

    const items = wrapper.findAll('.skeleton--item')
    items.forEach((item) => {
      expect(item.classes()).toContain('skeleton')
    })
  })
})
