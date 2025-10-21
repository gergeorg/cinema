import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import TheFooter from '../TheFooter.vue'
import BaseIcon from '../ui/BaseIcon.vue'

describe('TheFooter.vue', () => {
  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    wrapper = mount(TheFooter, {
      global: {
        components: {
          BaseIcon,
        },
      },
    })
  })

  it('рендерит футер', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.classes()).toContain('footer')
  })

  it('содержит список социальных ссылок', () => {
    const socialLinks = wrapper.findAll('.footer__social-link')
    expect(socialLinks).toHaveLength(4)

    const expectedLinks = [
      { href: 'https://vk.com/', label: 'Наша страница в VK', icon: 'vk' },
      { href: 'https://www.youtube.com/', label: 'Наш youtube канал', icon: 'yt' },
      { href: 'https://ok.ru/', label: 'Наша страница в одноклассниках', icon: 'ok' },
      { href: 'https://telegram.org/', label: 'Наш канал в telegtam', icon: 'tg' },
    ]

    socialLinks.forEach((linkWrapper, index) => {
      const link = expectedLinks[index]
      expect(linkWrapper.attributes('href')).toBe(link.href)
      expect(linkWrapper.attributes('aria-label')).toBe(link.label)
      expect(linkWrapper.findComponent(BaseIcon).props('name')).toBe(link.icon)
    })
  })
})
