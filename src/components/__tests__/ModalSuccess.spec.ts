import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import ModalSuccess from '../ModalSuccess.vue'
import BaseModal from '../ui/BaseModal.vue'
import BaseButton from '../ui/BaseButton.vue'

describe('ModalSuccess.vue', () => {
	it('рендерит текст и кнопку', () => {
		const wrapper = mount(ModalSuccess, {
			props: { isOpen: true },
			global: { components: { BaseModal, BaseButton } },
		})

		expect(wrapper.text()).toContain('Регистрация завершена')
		expect(wrapper.find('.modal-success__text').text()).toBe(
			'Используйте вашу электронную почту для входа',
		)

		const button = wrapper.find('.modal-success__button')
		expect(button.exists()).toBe(true)
		expect(button.text()).toBe('Войти')
	})

	it('эмитит событие "close" при закрытии модалки', async () => {
		const wrapper = mount(ModalSuccess, {
			props: { isOpen: true },
			global: { components: { BaseModal, BaseButton } },
		})

		await wrapper.findComponent(BaseModal).vm.$emit('close')
		expect(wrapper.emitted()).toHaveProperty('close')
		expect(wrapper.emitted('close')?.length).toBe(1)
	})

	it('эмитит событие "open-login" при клике на кнопку', async () => {
		const wrapper = mount(ModalSuccess, {
			props: { isOpen: true },
			global: { components: { BaseModal, BaseButton } },
		})

		const button = wrapper.findComponent(BaseButton)
		await button.trigger('click')

		expect(wrapper.emitted()).toHaveProperty('open-login')
		expect(wrapper.emitted('open-login')?.length).toBe(1)
	})
})
