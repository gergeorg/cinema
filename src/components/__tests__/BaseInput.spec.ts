import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseIcon from '@/components/ui/BaseIcon.vue'

describe('BaseInput', () => {
  it('renders input with correct attributes', () => {
    const wrapper = mount(BaseInput, {
      props: {
        modelValue: '',
        id: 'username',
        name: 'username',
        type: 'text',
        placeholder: 'Enter username',
        disabled: true,
        required: true,
        autocomplete: 'off',
        autofocus: true,
        maxlength: 10,
        minlength: 3,
      },
      global: {
        components: { BaseIcon },
      },
    })

    const input = wrapper.find('input')
    expect(input.exists()).toBe(true)
    expect(input.attributes('id')).toBe('username')
    expect(input.attributes('name')).toBe('username')
    expect(input.attributes('type')).toBe('text')
    expect(input.attributes('placeholder')).toBe('Enter username')
    expect(input.attributes('disabled')).toBeDefined()
    expect(input.attributes('required')).toBeDefined()
    expect(input.attributes('autocomplete')).toBe('off')
    expect(input.attributes('autofocus')).toBeDefined()
    expect(input.attributes('maxlength')).toBe('10')
    expect(input.attributes('minlength')).toBe('3')
  })

  it('renders icon when provided', () => {
    const wrapper = mount(BaseInput, {
      props: {
        modelValue: '',
        icon: 'search',
      },
      global: {
        components: { BaseIcon },
      },
    })

    const icon = wrapper.findComponent(BaseIcon)
    expect(icon.exists()).toBe(true)
    expect(icon.props('name')).toBe('search')
    expect(wrapper.find('input').classes()).toContain('base-input__field--with-icon')
  })

  it('applies error classes when error is true', () => {
    const wrapper = mount(BaseInput, {
      props: {
        modelValue: '',
        icon: 'search',
        error: true,
      },
      global: {
        components: { BaseIcon },
      },
    })

    expect(wrapper.find('input').classes()).toContain('base-input__field--error')
    expect(wrapper.findComponent(BaseIcon).classes()).toContain('base-input__icon--error')
  })

  it('emits update:modelValue when input value changes', async () => {
    const wrapper = mount(BaseInput, {
      props: { modelValue: '' },
      global: { components: { BaseIcon } },
    })

    const input = wrapper.find('input')
    await input.setValue('Hello')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['Hello'])
  })

  it('renders without icon when icon prop is not provided', () => {
    const wrapper = mount(BaseInput, {
      props: { modelValue: '' },
      global: { components: { BaseIcon } },
    })

    expect(wrapper.findComponent(BaseIcon).exists()).toBe(false)
    expect(wrapper.find('input').classes()).not.toContain('base-input__field--with-icon')
  })
})
