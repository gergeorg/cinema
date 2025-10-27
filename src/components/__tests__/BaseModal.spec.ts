import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Modal from '@/components/ui/BaseModal.vue'
import BaseIcon from '@/components/ui/BaseIcon.vue'

describe('Modal', () => {
  it('does not render when isOpen is false', () => {
    const wrapper = mount(Modal, {
      props: { isOpen: false },
      global: { components: { BaseIcon } },
    })

    expect(wrapper.find('.modal-overlay').exists()).toBe(false)
  })

  it('renders when isOpen is true', () => {
    const wrapper = mount(Modal, {
      props: { isOpen: true },
      global: { components: { BaseIcon } },
    })

    expect(wrapper.find('.modal-overlay').exists()).toBe(true)
    expect(wrapper.find('.modal-content').exists()).toBe(true)
  })

  it('displays the provided title', () => {
    const wrapper = mount(Modal, {
      props: { isOpen: true, title: 'Test Modal' },
      global: { components: { BaseIcon } },
    })

    const title = wrapper.find('.modal-title')
    expect(title.exists()).toBe(true)
    expect(title.text()).toBe('Test Modal')
  })

  it('renders slot content', () => {
    const wrapper = mount(Modal, {
      props: { isOpen: true },
      slots: { default: '<p class="slot-content">Slot content</p>' },
      global: { components: { BaseIcon } },
    })

    const slot = wrapper.find('.slot-content')
    expect(slot.exists()).toBe(true)
    expect(slot.text()).toBe('Slot content')
  })

  it('emits close when clicking on overlay', async () => {
    const wrapper = mount(Modal, {
      props: { isOpen: true },
      global: { components: { BaseIcon } },
    })

    const overlay = wrapper.find('.modal-overlay')
    await overlay.trigger('click.self')

    expect(wrapper.emitted('close')).toBeTruthy()
    expect(wrapper.emitted('close')?.length).toBe(1)
  })

  it('emits close when clicking the close button', async () => {
    const wrapper = mount(Modal, {
      props: { isOpen: true },
      global: { components: { BaseIcon } },
    })

    const closeBtn = wrapper.find('.close-btn')
    await closeBtn.trigger('click')

    expect(wrapper.emitted('close')).toBeTruthy()
    expect(wrapper.emitted('close')?.length).toBe(1)
  })
})
