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

  describe('slots', () => {
    it('should render header slot when provided', () => {
      const wrapper = createWrapper(defaultProps, {
        header: '<h3>Etapes</h3>',
      })

      expect(wrapper.find('.p-completion-tracker__header').exists()).toBe(true)
      expect(wrapper.find('.p-completion-tracker__header').text()).toContain('Etapes')
    })

    it('should not render header section when slot is empty', () => {
      const wrapper = createWrapper()

      expect(wrapper.find('.p-completion-tracker__header').exists()).toBe(false)
    })

    it('should render default slot content', () => {
      const wrapper = createWrapper(defaultProps, {
        default: '<div class="test-list">List content</div>',
      })

      expect(wrapper.find('.test-list').exists()).toBe(true)
    })
  })
})
