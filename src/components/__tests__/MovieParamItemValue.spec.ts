import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import MovieParamItemValue from '@/components/ui/MovieParamItem.vue'

describe('MovieParamItem', () => {
  it('renders title correctly', () => {
    const wrapper = mount(MovieParamItemValue, {
      props: { title: 'Год выпуска', value: 2023 },
    })

    const title = wrapper.find('.item__title')
    expect(title.exists()).toBe(true)
    expect(title.text()).toBe('Год выпуска')
  })

  it('renders value correctly when provided', () => {
    const wrapper = mount(MovieParamItemValue, {
      props: { title: 'Рейтинг', value: 8.5 },
    })

    const value = wrapper.find('.item__value')
    expect(value.exists()).toBe(true)
    expect(value.text()).toBe('8.5')
  })

  it('renders "нет данных" when value is null', () => {
    const wrapper = mount(MovieParamItemValue, {
      props: { title: 'Жанр', value: null },
    })

    const value = wrapper.find('.item__value')
    expect(value.text()).toBe('нет данных')
  })

  it('renders "нет данных" when value is undefined', () => {
    const wrapper = mount(MovieParamItemValue, {
      props: { title: 'Длительность' },
    })

    const value = wrapper.find('.item__value')
    expect(value.text()).toBe('нет данных')
  })

  it('renders "нет данных" when value is empty string', () => {
    const wrapper = mount(MovieParamItemValue, {
      props: { title: 'Описание', value: '' },
    })

    const value = wrapper.find('.item__value')
    expect(value.text()).toBe('нет данных')
  })
})
