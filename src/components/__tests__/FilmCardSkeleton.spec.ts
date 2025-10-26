import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import FilmCardSkeleton from '../FilmCardSkeleton.vue'

describe('FilmCardSkeleton.vue', () => {
  it('рендерит li с классом skeleton', () => {
    const wrapper = mount(FilmCardSkeleton)
    const li = wrapper.find('li.skeleton')

    expect(li.exists()).toBe(true)
    expect(li.attributes('aria-hidden')).toBe('true')
  })

  it('имеет класс skeleton', () => {
    const wrapper = mount(FilmCardSkeleton)
    const li = wrapper.find('li.skeleton')

    expect(li.classes()).toContain('skeleton')
  })
})
