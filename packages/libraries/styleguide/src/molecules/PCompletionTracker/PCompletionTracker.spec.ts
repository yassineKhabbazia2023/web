import { shallowMount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import PCompletionTracker from '.'
import type { PCompletionTrackerProps } from './PCompletionTrackerTypes'

const defaultProps: PCompletionTrackerProps = {
  pCurrent: 3,
  pTotal: 7,
}

const createWrapper = (props = defaultProps, slots = {}) => shallowMount(PCompletionTracker, {
  props,
  slots,
})

describe('pCompletionTracker', () => {
  describe('props', () => {
    it('should render PProgress with computed percentage', () => {
      const wrapper = createWrapper()
      const progress = wrapper.findComponent({ name: 'PProgress' })

      expect(progress.exists()).toBe(true)
      expect(progress.props('pPercentage')).toBe(43)
    })

    it('should pass custom progression label', () => {
      const wrapper = createWrapper({ ...defaultProps, pProgressionLabel: 'Avancement' })
      const progress = wrapper.findComponent({ name: 'PProgress' })

      expect(progress.props('pLabel')).toBe('Avancement')
    })

    it('should handle 0 total without error', () => {
      const wrapper = createWrapper({ pCurrent: 0, pTotal: 0 })
      const progress = wrapper.findComponent({ name: 'PProgress' })

      expect(progress.props('pPercentage')).toBe(0)
    })
  })

  describe('header', () => {
    it('should render title and description when props are provided', () => {
      const wrapper = createWrapper({ ...defaultProps, pTitle: 'Etapes', pDescription: 'Description text' })

      expect(wrapper.find('.p-completion-tracker__header').exists()).toBe(true)
      expect(wrapper.find('.p-completion-tracker__title').text()).toBe('Etapes')
      expect(wrapper.find('.p-completion-tracker__description').text()).toBe('Description text')
    })

    it('should not render header section when pTitle is not provided', () => {
      const wrapper = createWrapper()

      expect(wrapper.find('.p-completion-tracker__header').exists()).toBe(false)
    })

    it('should not render description when pDescription is not provided', () => {
      const wrapper = createWrapper({ ...defaultProps, pTitle: 'Etapes' })

      expect(wrapper.find('.p-completion-tracker__description').exists()).toBe(false)
    })

    it('should render default slot content', () => {
      const wrapper = createWrapper(defaultProps, {
        default: '<div class="test-list">List content</div>',
      })

      expect(wrapper.find('.test-list').exists()).toBe(true)
    })

    it('should render pre-header slot content above the header', () => {
      const wrapper = createWrapper({ ...defaultProps, pTitle: 'Etapes' }, {
        'pre-header': '<div class="test-alert">Alert content</div>',
      })

      expect(wrapper.find('.test-alert').exists()).toBe(true)
      expect(wrapper.html().indexOf('test-alert')).toBeLessThan(wrapper.html().indexOf('p-completion-tracker__header'))
    })
  })
})
