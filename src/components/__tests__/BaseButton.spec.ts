import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseIcon from '@/components/ui/BaseIcon.vue'

describe('BaseButton', () => {
  it('renders with default props and slot', () => {
    const wrapper = mount(BaseButton, {
      slots: {
        default: 'Click me',
      },
    })

    expect(wrapper.text()).toBe('Click me')
    expect(wrapper.classes()).toContain('button--blue') // default variant
    expect(wrapper.classes()).toContain('button--default') // default size
  })

  it('renders icon on the left', () => {
    const wrapper = mount(BaseButton, {
      props: {
        icon: 'search',
        iconPosition: 'left',
      },
      global: {
        components: { BaseIcon },
      },
    })

    const icon = wrapper.findComponent(BaseIcon)
    expect(icon.exists()).toBe(true)
    expect(icon.props('name')).toBe('search')
  })

  it('applies active class when active prop is true', () => {
    const wrapper = mount(BaseButton, {
      props: {
        active: true,
      },
    })

    expect(wrapper.classes()).toContain('button--active')
  })

  it('emits click event when clicked', async () => {
    const wrapper = mount(BaseButton)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('is disabled when disabled prop is true', () => {
    const wrapper = mount(BaseButton, {
      props: {
        disabled: true,
      },
    })

    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('applies variant and size classes correctly', () => {
    const wrapper = mount(BaseButton, {
      props: {
        variant: 'dark',
        size: 'big',
      },
    })

    expect(wrapper.classes()).toContain('button--dark')
    expect(wrapper.classes()).toContain('button--big')
  })
})
