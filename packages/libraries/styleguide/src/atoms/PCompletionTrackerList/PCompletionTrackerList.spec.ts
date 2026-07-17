import { shallowMount } from '@vue/test-utils'

import PCompletionTrackerList from '.'
import type { PCompletionTrackerListProps } from './PCompletionTrackerListTypes'

const defaultProps: PCompletionTrackerListProps = {
  pTitle: 'Les bases',
}

const createWrapper = (props = defaultProps, slots = {}) => shallowMount(PCompletionTrackerList, {
  props,
  slots,
})

describe('pCompletionTrackerList', () => {
  describe('props', () => {
    it('should render the title', () => {
      const wrapper = createWrapper()

      expect(wrapper.find('[data-testid=completion-tracker-list-title]').text()).toContain('Les bases')
    })
  })

  describe('slots', () => {
    it('should render default slot content', () => {
      const wrapper = createWrapper(defaultProps, {
        default: '<div class="test-item">Item</div>',
      })

      expect(wrapper.find('.test-item').exists()).toBe(true)
    })
  })
})
