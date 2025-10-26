import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import RegisterModal from '../RegisterModal.vue'
import BaseModal from '../ui/BaseModal.vue'
import BaseInput from '../ui/BaseInput.vue'
import BaseButton from '../ui/BaseButton.vue'
import ModalSuccess from '../ModalSuccess.vue'

const mockRegisterUser = vi.fn()

vi.mock('../../stores/useAuthStore', () => ({
  useAuthStore: () => ({
    registerUser: mockRegisterUser,
    error: '',
  }),
}))

describe('RegisterModal.vue', () => {
  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    wrapper = mount(RegisterModal, {
      props: { isOpen: true },
      global: {
        components: { BaseModal, BaseInput, BaseButton, ModalSuccess },
      },
    })
    mockRegisterUser.mockReset()
  })

  it('выдает ошибку, если пароли не совпадают', async () => {
    await wrapper.find('input[name="password"]').setValue('123456')
    await wrapper.find('input[name="confirmPassword"]').setValue('654321')
    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.find('.form__error').text()).toBe('Пароли не совпадают')
    expect(mockRegisterUser).not.toHaveBeenCalled()
  })

  it('показывает ModalSuccess при успешной регистрации', async () => {
    mockRegisterUser.mockResolvedValue(true)

    await wrapper.find('input[name="email"]').setValue('test@example.com')
    await wrapper.find('input[name="firstName"]').setValue('Иван')
    await wrapper.find('input[name="lastName"]').setValue('Иванов')
    await wrapper.find('input[name="password"]').setValue('123456')
    await wrapper.find('input[name="confirmPassword"]').setValue('123456')

    await wrapper.find('form').trigger('submit.prevent')

    expect(mockRegisterUser).toHaveBeenCalled()
    expect(mockRegisterUser).toHaveBeenCalledExactlyOnceWith({
      email: 'test@example.com',
      name: 'Иван',
      surname: 'Иванов',
      password: '123456',
    })

    expect(wrapper.findComponent(ModalSuccess).exists()).toBe(true)
  })

  it('показывает ошибку, если регистрация не удалась', async () => {
    mockRegisterUser.mockResolvedValue(false)
    const { useAuthStore } = await import('../../stores/useAuthStore')
    const store = useAuthStore()
    store.error = 'Ошибка регистрации'

    await wrapper.find('input[name="email"]').setValue('test@example.com')
    await wrapper.find('input[name="firstName"]').setValue('Иван')
    await wrapper.find('input[name="lastName"]').setValue('Иванов')
    await wrapper.find('input[name="password"]').setValue('123456')
    await wrapper.find('input[name="confirmPassword"]').setValue('123456')

    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.find('.form__error').text()).toBe('Ошибка регистрации')
  })

  it('закрывает модалку при закрытии ModalSuccess', async () => {
    mockRegisterUser.mockResolvedValue(true)

    await wrapper.find('input[name="email"]').setValue('test@example.com')
    await wrapper.find('input[name="firstName"]').setValue('Иван')
    await wrapper.find('input[name="lastName"]').setValue('Иванов')
    await wrapper.find('input[name="password"]').setValue('123456')
    await wrapper.find('input[name="confirmPassword"]').setValue('123456')

    await wrapper.find('form').trigger('submit.prevent')

    const successModal = wrapper.findComponent(ModalSuccess)
    await successModal.vm.$emit('close')

    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('пробрасывает событие "open-login" из ModalSuccess', async () => {
    mockRegisterUser.mockResolvedValue(true)

    await wrapper.find('input[name="email"]').setValue('test@example.com')
    await wrapper.find('input[name="firstName"]').setValue('Иван')
    await wrapper.find('input[name="lastName"]').setValue('Иванов')
    await wrapper.find('input[name="password"]').setValue('123456')
    await wrapper.find('input[name="confirmPassword"]').setValue('123456')

    await wrapper.find('form').trigger('submit.prevent')

    const successModal = wrapper.findComponent(ModalSuccess)
    await successModal.vm.$emit('open-login')

    expect(wrapper.emitted('open-login')).toBeTruthy()
  })
})
