import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { nextTick } from 'vue'
import PDatePicker from '.'
import type { PDatePickerProps } from './PDatePickerTypes'

const getCurrentDateMocked = vi.hoisted(() => vi.fn())
const getWeekCountMocked = vi.hoisted(() => vi.fn())

vi.mock('./PDatePickerUtils', () => ({
  getCurrentDate: getCurrentDateMocked,
  getWeekCount: getWeekCountMocked,
}))

const day = '2024-01-29'
const defaultProps = {
  modelValue: day,
  pValueFormat: 'YYYY-MM-DD',
  pFormat: 'YYYY-MM-DD',
  pCalendarLite: true,
  pSchedulesCollection: ['2024-01-29', '2024-01-27', '2024-02-05'],
}

function createWrapper(overriddenProps: Partial<PDatePickerProps> = {}) {
  const props = {
    ...defaultProps,
    ...overriddenProps,
  }

  return mount(PDatePicker, {
    props,
  })
}

describe('calendar lite', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })
  it('renders the calendar lite component', async () => {
    const testDate = '2024-01-15'
    const date = new Date(testDate)
    const wrapper = createWrapper()
    const elDatePicker = wrapper.findComponent({ name: 'ElDatePicker' })
    const secondTableCell = document.body.querySelectorAll('[data-testid="date-picker-table-cell"]')[1] as HTMLElement

    await wrapper.setProps({ pMonth: 'next-month' })
    await nextTick()
    await wrapper.setProps({ pMonth: 'today' })
    await nextTick()
    const expectedModelValue = (new Date()).toISOString().split('T')[0]
    expect(wrapper.emitted('update:modelValue')?.at(0)).toStrictEqual([expectedModelValue])

    elDatePicker.vm.$emit('change', date)
    wrapper.vm.$emit('calendar-change', [date, date])
    secondTableCell?.click()

    expect(wrapper.emitted('change')?.at(0)).toStrictEqual([date])
    expect(wrapper.emitted('calendar-change')?.at(0)).toStrictEqual([[date, date]])
    expect(wrapper.emitted('selected-date')?.at(0)).toStrictEqual([day])
  })

  const tests = [{
    weekCount: 4,
    pCalendarLite: true,
    expected: 'p-date-picker p-date-picker--is-last-week-hidden',
  }, {
    weekCount: 5,
    pCalendarLite: true,
    expected: 'p-date-picker p-date-picker--is-last-week-hidden',
  }, {
    weekCount: 6,
    pCalendarLite: true,
    expected: 'p-date-picker',
  }, {
    weekCount: 4,
    pCalendarLite: false,
    expected: '',
  }, {
    weekCount: 5,
    pCalendarLite: false,
    expected: '',
  }, {
    weekCount: 6,
    pCalendarLite: false,
    expected: '',
  }]
  it.each(tests)(
    'elDatePicker popperClass should be $expected when weekCount equals $weekCount and pCalendarLite is $pCalendarLite',
    ({
      weekCount,
      pCalendarLite,
      expected,
    }) => {
      getWeekCountMocked.mockReturnValueOnce(weekCount)

      const wrapper = createWrapper({ pCalendarLite })
      const elDatePicker = wrapper.findComponent({ name: 'ElDatePicker' })

      expect(elDatePicker.props('popperClass')).toBe(expected)
    })

  it('should call getCurrentDate and getWeekCount with proper parameters when change panel', async () => {
    const mockedCurrentDate1 = '2024-02-03'
    const mockedCurrentDate2 = '2024-04-10'
    const panelDate = '2024-04-05'

    getCurrentDateMocked
      .mockReturnValueOnce(mockedCurrentDate1)
      .mockReturnValueOnce(mockedCurrentDate2)

    const wrapper = createWrapper()
    const elDatePicker = wrapper.findComponent({ name: 'ElDatePicker' })
    await elDatePicker.vm.$emit('panel-change', panelDate)

    expect(getCurrentDateMocked).toHaveBeenCalledTimes(2)
    expect(getCurrentDateMocked).toHaveBeenNthCalledWith(1, day, undefined)
    expect(getCurrentDateMocked).toHaveBeenNthCalledWith(2, day, panelDate)

    expect(getWeekCountMocked).toHaveBeenCalledTimes(2)
    expect(getWeekCountMocked).toHaveBeenNthCalledWith(1, mockedCurrentDate1)
    // eslint-disable-next-line vitest/max-expects
    expect(getWeekCountMocked).toHaveBeenNthCalledWith(2, mockedCurrentDate2)
    // eslint-disable-next-line vitest/max-expects
    expect(wrapper.emitted('panel-change')).toStrictEqual([[panelDate]])
  })
})
