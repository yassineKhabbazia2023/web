import { expect, it, describe } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import WorkInProgress from '.'

const createWrapper = (): VueWrapper => mount(WorkInProgress)

describe('workInProgress', () => {
  describe('display', () => {
    it('should display correctly the work in progress page', () => {
      const wrapper = createWrapper()
      const wipImages = wrapper.findAllComponents({ name: 'PImage' })
      const wipTitle = wrapper.find('[data-testid="wip-message-title"')
      const wipDescription = wrapper.find('[data-testid="wip-message-description"')

      expect(wipImages).toHaveLength(2)
      expect(wipTitle.exists()).toBeTruthy()
      expect(wipDescription.exists()).toBeTruthy()
    })
  })
})
