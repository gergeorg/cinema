import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import TheHeader from '../TheHeader.vue'
import TheNav from '../TheNav.vue'
import SearchForm from '../ui/SearchForm.vue'
import LoginModal from '../LoginModal.vue'
import RegisterModal from '../RegisterModal.vue'
import ModalSuccess from '../ModalSuccess.vue'
import { createPinia, setActivePinia, defineStore } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'

// Мокаем useAuthStore и useFavoritesStore
vi.mock('@/stores/useFavoritesStore', () => ({
  useFavoritesStore: vi.fn(() => ({
    fetchFavorites: vi.fn(),
  })),
}))

// Создаем тестовый стор для Auth
const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    user: { name: 'Иван' },
  }),
  actions: {
    fetchProfile: vi.fn(),
  },
})

describe('TheHeader.vue', () => {
  let store: ReturnType<typeof useAuthStore>
  let router: any

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useAuthStore()

    router = createRouter({
      history: createWebHistory(),
      routes: [],
    })
  })

  it('рендерит основные элементы', () => {
    const wrapper = mount(TheHeader, {
      global: {
        plugins: [createPinia(), router],
        stubs: { RouterLink: true },
      },
    })

    expect(wrapper.find('header').exists()).toBe(true)
    expect(wrapper.findComponent(TheNav).exists()).toBe(true)
    expect(wrapper.findComponent(SearchForm).exists()).toBe(true)
  })

  it('показывает кнопку "Войти", если пользователь не авторизован', () => {
    store.isAuthenticated = false
    const wrapper = mount(TheHeader, {
      global: { plugins: [createPinia(), router], stubs: { RouterLink: true } },
    })
    const button = wrapper.find('button.header__button')
    expect(button.exists()).toBe(true)
    expect(button.text()).toBe('Войти')
  })

  it('показывает ссылку на профиль, если пользователь авторизован', async () => {
    store.isAuthenticated = true
    const wrapper = mount(TheHeader, {
      global: { plugins: [createPinia(), router], stubs: { RouterLink: true } },
    })

    await wrapper.vm.$nextTick()
    const link = wrapper.findComponent({ name: 'RouterLink' })
    expect(link.exists()).toBe(true)
  })

  it('открывает LoginModal при клике на "Войти"', async () => {
    const wrapper = mount(TheHeader, {
      global: { plugins: [createPinia(), router], stubs: { RouterLink: true } },
    })

    expect(wrapper.findComponent(LoginModal).props('isOpen')).toBe(false)

    await wrapper.find('button.header__button').trigger('click')

    expect(wrapper.findComponent(LoginModal).props('isOpen')).toBe(true)
  })

  it('переключает между Login и Register модалками', async () => {
    const wrapper = mount(TheHeader, {
      global: { plugins: [createPinia(), router], stubs: { RouterLink: true } },
    })

    // Открываем LoginModal
    await wrapper.find('button.header__button').trigger('click')
    expect(wrapper.findComponent(LoginModal).props('isOpen')).toBe(true)

    // Имитация события "open-register"
    await wrapper.findComponent(LoginModal).vm.$emit('open-register')
    await wrapper.vm.$nextTick()

    expect(wrapper.findComponent(LoginModal).props('isOpen')).toBe(false)
    expect(wrapper.findComponent(RegisterModal).props('isOpen')).toBe(true)
  })

  it('показывает ModalSuccess после успешной регистрации', async () => {
    const wrapper = mount(TheHeader, {
      global: { plugins: [createPinia(), router], stubs: { RouterLink: true } },
    })

    await wrapper.find('button.header__button').trigger('click')
    await wrapper.findComponent(LoginModal).vm.$emit('open-register')
    await wrapper.findComponent(RegisterModal).vm.$emit('register-success')
    await wrapper.vm.$nextTick()

    expect(wrapper.findComponent(RegisterModal).props('isOpen')).toBe(false)
    expect(wrapper.findComponent(ModalSuccess).props('isOpen')).toBe(true)
  })

  it('открывает модалки по событию window "open-auth"', async () => {
    const wrapper = mount(TheHeader, {
      global: { plugins: [createPinia(), router], stubs: { RouterLink: true } },
    })

    // Эмулируем кастомное событие
    window.dispatchEvent(new CustomEvent('open-auth', { detail: { mode: 'register' } }))
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(RegisterModal).props('isOpen')).toBe(true)

    window.dispatchEvent(new CustomEvent('open-auth', { detail: { mode: 'success' } }))
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(ModalSuccess).props('isOpen')).toBe(true)
  })
})
