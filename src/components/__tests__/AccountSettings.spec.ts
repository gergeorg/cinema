import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import AccountSettings from '../AccountSettings.vue'
import BaseButton from '../ui/BaseButton.vue'

const pushMock = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}))

const mockLogout = vi.fn()
const mockUser = ref({
  name: 'Иван',
  surname: 'Иванов',
  email: 'ivan@example.com',
})

vi.mock('../../stores/useAuthStore', () => ({
  useAuthStore: () => ({
    logout: mockLogout,
    user: mockUser,
  }),
}))

describe('AccountSettings.vue', () => {
  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    wrapper = mount(AccountSettings, {
      global: {
        components: { BaseButton },
      },
    })
    pushMock.mockClear()
    mockLogout.mockClear()
  })

  it('отображает корректные данные пользователя', () => {
    const values = wrapper.findAll('.account__value')
    expect(values.at(0)?.text()).toBe('Иван Иванов')
    expect(values.at(1)?.text()).toBe('ivan@example.com')
  })

  it('правильно вычисляет инициалы пользователя', () => {
    const initials = wrapper.find('.account__initials')
    expect(initials.text()).toBe('ИИ')
  })

  it('выполняет logout и перенаправляет на главную страницу', async () => {
    const button = wrapper.findComponent(BaseButton)
    await button.trigger('click')

    expect(mockLogout).toHaveBeenCalledExactlyOnceWith()
    expect(pushMock).toHaveBeenCalledExactlyOnceWith({ path: '/' })
  })
})
