import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import TheError from '../TheError.vue'

describe('TheError.vue', () => {
  it('отображает сообщение ошибки', () => {
    const wrapper = mount(TheError, {
      props: {
        message: 'Произошла ошибка',
      },
    })

    const errorDiv = wrapper.find('.error-component')
    expect(errorDiv.exists()).toBe(true)

    const messageDiv = wrapper.find('.error-message')
    expect(messageDiv.text()).toBe('Произошла ошибка')

    const iconDiv = wrapper.find('.error-icon')
    expect(iconDiv.text()).toBe('⚠️')
  })

  it('не отображает компонент, если message пустой', () => {
    const wrapper = mount(TheError, {
      props: {
        message: '',
      },
    })

    const errorDiv = wrapper.find('.error-component')
    expect(errorDiv.exists()).toBe(false)
  })
})
