import { shallowMount } from '@vue/test-utils'

import PDatePicker from '.'
import type { PDatePickerProps } from './PDatePickerTypes'

import { getCurrentDate, getWeekCount } from './PDatePickerUtils'

const getCurrentDateMocked = vi.mocked(getCurrentDate)
const getWeekCountMocked = vi.mocked(getWeekCount)

beforeEach(() => {
  getCurrentDateMocked.mockImplementation(() => undefined as unknown as Date)
  getWeekCountMocked.mockImplementation(() => undefined as unknown as number)
})

const day = '2024-01-29'
const defaultProps = {
  modelValue: day,
  pValueFormat: 'YYYY-MM-DD',
  pFormat: 'YYYY-MM-DD',
  pCalendarLite: true,
}

function createWrapper(overriddenProps: Partial<PDatePickerProps> = {}) {
  const props = {
    ...defaultProps,
    ...overriddenProps,
  }

  return shallowMount(PDatePicker, {
    props,
    global: {
      stubs: {
        ElDatePicker: {
          name: 'ElDatePicker',
          template: `<div><slot
            :isCurrent="isCurrent"
            :dayjs="dayjs"
            :text="text"
            :type="type"
          /></div>`,
          data: () => {
            return {
              isCurrent: false,
              dayjs: {
                format: () => '2024-01-01',
              },
              text: '',
              type: '',
            }
          },
          props: [
            'popperClass',
          ],
        },
      },
    },
  })
}

describe('calendar lite', () => {
  it('renders the calendar lite component', async () => {
    const testDate = '2024-01-15'
    const day = '2024-01-01'
    const date = new Date(testDate)
    const wrapper = createWrapper()
    const secondTableCell = wrapper.find('[data-testid="date-picker-table-cell"]')

    wrapper.vm.$emit('calendar-change', [date, date])
    secondTableCell?.trigger('click')

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
      .mockReturnValueOnce(mockedCurrentDate1 as unknown as Date)
      .mockReturnValueOnce(mockedCurrentDate2 as unknown as Date)

    const wrapper = createWrapper()
    const elDatePicker = wrapper.findComponent({ name: 'ElDatePicker' })
    await elDatePicker.vm.$emit('panel-change', panelDate)

    expect(getCurrentDateMocked).toHaveBeenCalledTimes(2)
    expect(getCurrentDateMocked).toHaveBeenNthCalledWith(1, day, undefined)
    expect(getCurrentDateMocked).toHaveBeenNthCalledWith(2, day, panelDate)

    expect(getWeekCountMocked).toHaveBeenCalledTimes(2)
    expect(getWeekCountMocked).toHaveBeenNthCalledWith(1, mockedCurrentDate1)

    expect(getWeekCountMocked).toHaveBeenNthCalledWith(2, mockedCurrentDate2)

    expect(wrapper.emitted('panel-change')).toStrictEqual([[panelDate]])
  })
})
