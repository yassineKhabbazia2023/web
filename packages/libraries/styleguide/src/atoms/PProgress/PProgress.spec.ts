import { shallowMount } from '@vue/test-utils'

import PProgress from '.'
import type { PProgressProps } from './PProgressTypes'

const defaultProps: PProgressProps = {
  pPercentage: 43,
}

const createWrapper = (props = defaultProps) => shallowMount(PProgress, {
  props,
})

describe('pProgress', () => {
  describe('props', () => {
    it('should render default label', () => {
      const wrapper = createWrapper()

      expect(wrapper.find('[data-testid=progress-label]').text()).toBe('Progression')
    })

    it('should render custom label', () => {
      const wrapper = createWrapper({ ...defaultProps, pLabel: 'Avancement' })

      expect(wrapper.find('[data-testid=progress-label]').text()).toBe('Avancement')
    })

    it('should display the percentage', () => {
      const wrapper = createWrapper()

      expect(wrapper.find('[data-testid=progress-percentage]').text()).toBe('43%')
    })

    it('should pass percentage to ElProgress', () => {
      const wrapper = createWrapper()
      const elProgress = wrapper.findComponent({ name: 'ElProgress' })

      expect(elProgress.exists()).toBe(true)
      expect(elProgress.props('percentage')).toBe(43)
    })

    it('should display 0%', () => {
      const wrapper = createWrapper({ pPercentage: 0 })

      expect(wrapper.find('[data-testid=progress-percentage]').text()).toBe('0%')
    })

    it('should display 100%', () => {
      const wrapper = createWrapper({ pPercentage: 100 })

      expect(wrapper.find('[data-testid=progress-percentage]').text()).toBe('100%')
    })
  })
})
