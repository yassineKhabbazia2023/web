import { expect, it, describe } from 'vitest'
import { shallowMount, type VueWrapper } from '@vue/test-utils'
import WorkInProgress from '.'

const createWrapper = (): VueWrapper => shallowMount(WorkInProgress)

describe('workInProgress', () => {
  describe('display', () => {
    it('should display correctly the work in progress page', () => {
      const wrapper = createWrapper()
      const pError = wrapper.findComponent({ name: 'PError' })

      expect(pError.props()).toMatchFileSnapshot('__snap__/pError.props.snap')
    })
  })
})
