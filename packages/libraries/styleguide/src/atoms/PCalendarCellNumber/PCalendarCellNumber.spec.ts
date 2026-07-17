import { shallowMount } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import PCalendarCellNumber from '.'
import type { PCalendarCellNumberProps } from './PCalendarCellNumberTypes'

const defaultProps: PCalendarCellNumberProps = {
  pNumber: 29,
  pState: 'initial',
}

const rootWrapperClass = 'p-calendar-cell-number'

const createWrapper = (props: any = defaultProps): VueWrapper =>
  shallowMount(PCalendarCellNumber, {
    props,
  })

describe('calendar cell number', () => {
  describe('props', () => {
    it('creates a wrapper', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('.p-calendar-cell-number').exists()).toBeTruthy()
    })

    it.each([
      {
        pState: 'active',
        expectedClass: `${rootWrapperClass}--state-active`,
      },
      {
        pState: 'selected',
        expectedClass: `${rootWrapperClass}--state-selected`,
      },
      {
        pState: 'current',
        expectedClass: `${rootWrapperClass}--state-current`,
      },
    ])(
      'should bind appropriate modifier based on state',
      ({ pState, expectedClass }) => {
        const wrapper = createWrapper({ ...defaultProps, pState })
        const pcalendarCellNumberWrapper = wrapper.find(`.${expectedClass}`)
        expect(pcalendarCellNumberWrapper.exists()).toBeTruthy()
      },
    )
  })
})
