import { describe, it, expect } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import TheNav from '../TheNav.vue'

describe('TheNav.vue', () => {
  it('рендерит навигацию с двумя ссылками', () => {
    const wrapper = mount(TheNav, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    const list = wrapper.find('ul.nav__list')
    expect(list.exists()).toBe(true)

    const items = wrapper.findAll('li.nav__item')
    expect(items.length).toBe(2)

    const links = wrapper.findAllComponents(RouterLinkStub)
    expect(links.length).toBe(2)

    expect(links[0]?.text()).toBe('Главная')
    expect(links[1]?.text()).toBe('Жанры')

    expect(links[0]?.props('to')).toBe('/')
    expect(links[1]?.props('to')).toBe('/genres')
  })
})
