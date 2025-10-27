import { mount, type VueWrapper } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { ComponentPublicInstance } from 'vue'
import LoginModal from '../LoginModal.vue'
import BaseModal from '../ui/BaseModal.vue'
import BaseButton from '../ui/BaseButton.vue'
import BaseInput from '../ui/BaseInput.vue'

const mockLogin = vi.fn()
let mockError: string | null = null

vi.mock('../../stores/useAuthStore', () => ({
	useAuthStore: () => ({
		login: mockLogin,
		get error() {
			return mockError
		},
	}),
}))

describe('LoginModal.vue', () => {
	let wrapper: VueWrapper<ComponentPublicInstance>

	beforeEach(() => {
		wrapper = mount(LoginModal, {
			props: { isOpen: true },
			global: {
				components: { BaseModal, BaseButton, BaseInput },
			},
		}) as unknown as VueWrapper<ComponentPublicInstance>
		mockLogin.mockReset()
		mockError = null
	})

	it('вызывает login при сабмите формы', async () => {
		mockLogin.mockResolvedValue(true)

		await wrapper.find('form').trigger('submit.prevent')

		expect(mockLogin).toHaveBeenCalledExactlyOnceWith({
			email: '',
			password: '',
		})
	})

	it('показывает ошибку, если login возвращает false', async () => {
		mockLogin.mockResolvedValue(false)
		mockError = 'Неверный логин или пароль'

		await wrapper.find('form').trigger('submit.prevent')

		const errorMsg = wrapper.find('.form__error')
		expect(errorMsg.exists()).toBe(true)
		expect(errorMsg.text()).toBe('Неверный логин или пароль')
		expect(wrapper.emitted('close')).toBeFalsy()
	})

	it('закрывает модалку при успешном login', async () => {
		mockLogin.mockResolvedValue(true)

		await wrapper.find('form').trigger('submit.prevent')

		expect(wrapper.emitted('close')).toBeTruthy()
		expect(wrapper.emitted('close')?.length).toBe(1)
	})
})
