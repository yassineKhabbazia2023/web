import { shallowMount } from '@vue/test-utils'
import type { PNoticeCardProps } from './PNoticeCardTypes'

import PNoticeCard from '.'

const baseProps: PNoticeCardProps = {
  pTitle: 'Test Title',
}

const createWrapper = (props: PNoticeCardProps = baseProps, slots: Record<string, any> = {}) =>
  shallowMount(PNoticeCard, {
    props,
    slots,
  })

describe('PNoticeCard', () => {
  describe('props', () => {
    it('should render the title', () => {
      const wrapper = createWrapper({ pTitle: 'Test Notice Title' })
      expect(wrapper.text()).toContain('Test Notice Title')
    })

    it('should render icon when pIcon prop is provided', () => {
      const wrapper = createWrapper({
        pTitle: 'Test Title',
        pIcon: 'pennylane',
      })
      const iconComponent = wrapper.findComponent({ name: 'PIcon' })
      expect(iconComponent.exists()).toBe(true)
      expect(iconComponent.props('pName')).toBe('pennylane')
    })

    it('should not render icon when pIcon prop is not provided', () => {
      const wrapper = createWrapper({ pTitle: 'Test Title' })
      const iconComponent = wrapper.findComponent({ name: 'PIcon' })
      expect(iconComponent.exists()).toBe(false)
    })

    it('should apply correct header color class', () => {
      const wrapper = createWrapper({
        pTitle: 'Test Title',
        pHeaderColor: 'dark-blue',
      })
      expect(wrapper.find('.p-notice-card__header').classes()).toContain('p-notice-card__header--dark-blue')
    })

    it('should apply correct body color class', () => {
      const wrapper = createWrapper(
        {
          pTitle: 'Test Title',
          pBodyColor: 'light-green',
        },
        { default: '<p>Test content in body</p>' },
      )
      expect(wrapper.find('.p-notice-card__body').classes()).toContain('p-notice-card__body--light-green')
    })

    it('should use default colors when not specified', () => {
      const wrapper = createWrapper({ pTitle: 'Test Title' }, { default: '<p>Test content in body</p>' })
      expect(wrapper.find('.p-notice-card__header').classes()).toContain('p-notice-card__header--info')
      expect(wrapper.find('.p-notice-card__body').classes()).toContain('p-notice-card__body--default')
    })
  })

  describe('slots', () => {
    it('should render default slot content', () => {
      const wrapper = createWrapper({ pTitle: 'Test Title' }, { default: '<p>Test content in body</p>' })
      expect(wrapper.html()).toContain('Test content in body')
    })

    it('should not render body when no slot content provided', () => {
      const wrapper = createWrapper({ pTitle: 'Test Title' })
      expect(wrapper.find('.p-notice-card__body').exists()).toBe(false)
    })
  })
})
