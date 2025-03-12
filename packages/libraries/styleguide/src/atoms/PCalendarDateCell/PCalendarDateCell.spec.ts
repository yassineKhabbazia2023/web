import { vi, describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { vueuseCoreMock } from '@styleguide/__mocks__/vueuse.mocks'
import type { VueWrapper } from '@vue/test-utils'
import type { PCalendarDateCellProps } from './PCalendarDateCellTypes'
import PCalendarCellNumber from '../../atoms/PCalendarCellNumber'
import { itemsGroupedByDate } from '../../atoms/PCalendar/PCalendarMocks'
import PTaskItem from '../../atoms/PTaskItem'

import PCalendarDateCell from '.'

vi.mock('@vueuse/core', () => vueuseCoreMock)

const defaultProps: PCalendarDateCellProps = {
  pActiveDate: '2024-03-01',
  pCellDate: '2024-03-01',
  pCurrentDate: '2024-03-01',
  pCellElements: itemsGroupedByDate[0].items,
  pCellType: 'current-month',
}

const rootWrapperClass = 'p-calendar-date-cell'

const createWrapper = (props: any = defaultProps): VueWrapper =>
  shallowMount(PCalendarDateCell, {
    props,
  })

describe('calendar date cell', () => {
  describe('props', () => {
    it('data-cell-date should be 2024-03-01', () => {
      const wrapper = createWrapper()
      const div = wrapper.find('.p-calendar-date-cell')

      expect(div.attributes('data-cell-date')).toBe(defaultProps.pCurrentDate)
    })

    it.each([
      {
        cellType: 'prev-month',
        expectedCssClass: `.${rootWrapperClass}--prev-month`,
      },
      {
        cellType: 'next-month',
        expectedCssClass: `.${rootWrapperClass}--next-month`,
      },
      {
        cellType: 'current-month',
        expectedCssClass: `.${rootWrapperClass}--current-month`,
      },
    ])('has the appropriate css classes based on cellType', ({ cellType, expectedCssClass }) => {
      const wrapper = createWrapper({ ...defaultProps, pCellType: cellType })
      expect(wrapper.find(expectedCssClass).exists()).toBeTruthy()
    })

    it.each([
      {
        pCellDate: '2024-03-01',
        pActiveDate: '2024-03-01',
        pCurrentDate: '2024-03-01',
        expectedNumberType: 'active',
      },
      {
        pCellDate: '2024-03-02',
        pActiveDate: '2024-03-01',
        pCurrentDate: '2024-03-02',
        expectedNumberType: 'current',
      },
      {
        pCellDate: '2024-02-20',
        pActiveDate: '2024-03-01',
        pCurrentDate: '2024-03-01',
        expectedNumberType: 'inactive',
      },
      {
        pCellDate: '2024-03-02',
        pActiveDate: '2024-03-01',
        pCurrentDate: '2024-03-01',
        expectedNumberType: 'initial',
      },
    ])('gives the appropriate day number state', (dayStateTestCaseProps) => {
      const wrapper = createWrapper({ ...defaultProps, ...dayStateTestCaseProps })
      const dayComponent = wrapper.findComponent(PCalendarCellNumber)
      expect(dayComponent.props('pState')).toBe(
        dayStateTestCaseProps.expectedNumberType,
      )
    })

    it('should have an existing chevron wrapper when content overflows', () => {
      const wrapper = createWrapper({ ...defaultProps, pCellElements: itemsGroupedByDate[5].items })
      expect(wrapper.find(`.${rootWrapperClass}__chevron-down`).exists()).toBeTruthy()
    })
  })

  describe('interactions', () => {
    it('emits cell-click when an empty zone is clicked', () => {
      const wrapper = createWrapper()
      wrapper.find(`.${rootWrapperClass}__day-number`).trigger('click')
      wrapper.find(`.${rootWrapperClass}__empty-zone`).trigger('click')
      const emittedEvents = wrapper.emitted('cell-click')
      expect(emittedEvents).toHaveLength(2)
      expect(emittedEvents?.at(0)).toStrictEqual(['2024-03-01'])
      expect(emittedEvents?.at(1)).toStrictEqual(['2024-03-01'])
    })

    it('emits select-deadline when an item is clicked', () => {
      const wrapper = createWrapper()
      wrapper.findAllComponents(PTaskItem)[0].trigger('click')
      const emittedEvents = wrapper.emitted('select-deadline')
      expect(emittedEvents).toHaveLength(1)
    })
  })
})
