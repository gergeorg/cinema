import { mount, type VueWrapper } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import type { ComponentPublicInstance } from 'vue'

type TrailerModalPublic = {
	open: (url: string) => void
	close: () => void
}
import TrailerModal from '@/components/ui/TrailerModal.vue'
import BaseIcon from '@/components/ui/BaseIcon.vue'

describe('TrailerModal.vue', () => {
	it('renders iframe when open is called', async () => {
		const wrapper = mount(TrailerModal, {
			global: { components: { BaseIcon } },
		}) as unknown as VueWrapper<ComponentPublicInstance & TrailerModalPublic>

		expect(wrapper.find('iframe').exists()).toBe(false)

		wrapper.vm.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
		await wrapper.vm.$nextTick()

		const iframe = wrapper.find('iframe')
		expect(iframe.exists()).toBe(true)
		expect(iframe.attributes('src')).toContain('https://www.youtube.com/embed/dQw4w9WgXcQ')
	})

	it('closes modal when close is called', async () => {
		const wrapper = mount(TrailerModal, {
			global: { components: { BaseIcon } },
		}) as unknown as VueWrapper<ComponentPublicInstance & TrailerModalPublic>

		wrapper.vm.open('https://youtu.be/dQw4w9WgXcQ')
		await wrapper.vm.$nextTick()

		expect(wrapper.find('iframe').exists()).toBe(true)

		wrapper.vm.close()
		await wrapper.vm.$nextTick()

		expect(wrapper.find('iframe').exists()).toBe(false)
	})

	it('closes modal when close button is clicked', async () => {
		const wrapper = mount(TrailerModal, {
			global: { components: { BaseIcon } },
		}) as unknown as VueWrapper<ComponentPublicInstance & TrailerModalPublic>

		wrapper.vm.open('https://youtu.be/dQw4w9WgXcQ')
		await wrapper.vm.$nextTick()

		const closeButton = wrapper.find('button.close-btn')
		expect(closeButton.exists()).toBe(true)

		await closeButton.trigger('click')
		await wrapper.vm.$nextTick()

		expect(wrapper.find('iframe').exists()).toBe(false)
	})
})
