import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import BaseIcon from '@/components/ui/BaseIcon.vue'

describe('BaseIcon', () => {
  it('renders SVG with default size', () => {
    const wrapper = mount(BaseIcon, {
      props: { name: 'search' },
    })

    const svg = wrapper.find('svg')
    expect(svg.exists()).toBe(true)
    expect(svg.attributes('width')).toBe('24')
    expect(svg.attributes('height')).toBe('24')
    expect(svg.classes()).toContain('icon')
    expect(svg.classes()).toContain('icon--search')

    const use = wrapper.find('use')
    expect(use.exists()).toBe(true)
    expect(use.attributes('href')).toContain('#icon-search')
  })

  it('renders SVG with custom width and height', () => {
    const wrapper = mount(BaseIcon, {
      props: { name: 'close', width: 32, height: 32 },
    })

    const svg = wrapper.find('svg')
    expect(svg.attributes('width')).toBe('32')
    expect(svg.attributes('height')).toBe('32')
  })

  it('applies custom class', () => {
    const wrapper = mount(BaseIcon, {
      props: { name: 'menu', class: 'custom-class' },
    })

    const svg = wrapper.find('svg')
    expect(svg.classes()).toContain('custom-class')
    expect(svg.classes()).toContain('icon--menu')
  })

  it('renders correct href for use element', () => {
    const wrapper = mount(BaseIcon, {
      props: { name: 'user' },
    })

    const use = wrapper.find('use')
    expect(use.attributes('href')).toContain('#icon-user')
  })
})
