import { describe, it, expect, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import PCalendar from '.'
import type { PCalendarProps } from './PCalendarTypes'
import { itemsGroupedByDate } from './PCalendarMocks'

const getDateTypeMock = vi.hoisted(() => vi.fn(() => 'current-month'))
vi.mock('./PCalendarUtils', () => ({
  getDateType: getDateTypeMock,
}))

const defaultProps: PCalendarProps = {
  pItemsGroupedByDate: itemsGroupedByDate,
  modelValue: new Date('2024-03-07'),
}

const createWrapper = (props: any = defaultProps): VueWrapper =>
  shallowMount(PCalendar, {
    props,
    global: {
      stubs: {
        PCalendarDateCell: true,
        ElCalendar: {
          name: 'ElCalendar',
          template: `<div>
          <slot name="header" />
          <slot name="date-cell" :data="data" />
          </div>`,
          data() {
            const data = {
              day: '2024-02-25',
              type: 'current-month',
            }

            return {
              data,
            }
          },
        },
      },
    },
  })

describe('calendar', () => {
  describe('props', () => {
    it('renders custom cells', () => {
      const wrapper = createWrapper()
      const customCellElements = wrapper.findAll('[data-testid="p-calendar-date-cell"]')
      expect(customCellElements).toHaveLength(1)
    })
  })

  describe('interactions', () => {
    it('emits an ISO 8601 string on cell-click', () => {
      const wrapper = createWrapper()
      const firstCalendarCell = wrapper.findComponent({ name: 'PCalendarDateCell' })
      // cannot use trigger here as cell-click does not corresponds to the whole cell click
      firstCalendarCell.vm.$emit('cell-click')

      const emittedEvents = wrapper.emitted('cell-click')
      const emittedEvent = emittedEvents?.at(0)
      expect(emittedEvent).toStrictEqual(['2024-02-25'])
    })
    it('should emits select-deadline with occurence id', () => {
      const wrapper = createWrapper()
      const cellItemId = 12345
      const firstCalendarCell = wrapper.findComponent({ name: 'PCalendarDateCell' })
      firstCalendarCell.vm.$emit('select-deadline', cellItemId)
      expect(wrapper.emitted('select-deadline')).toStrictEqual([[cellItemId]])
    })
  })
})
