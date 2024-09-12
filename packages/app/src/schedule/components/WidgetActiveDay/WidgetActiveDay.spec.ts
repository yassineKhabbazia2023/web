import { describe, it, expect, vi } from 'vitest'
import wrapperFactory from '@/schedule/tests/utils/wrapperFactory'
import type { WidgetActiveDayProps } from './WidgetActiveDayTypes'
import WidgetActiveDay from '.'
import { getMockedDeadlines } from '@/schedule/tests/mocks/Deadline'
import type { VueWrapper } from '@vue/test-utils'
import { mockedGetScheduleModelsByKey } from '@/schedule/tests/mocks/commonViMock'
import WidgetDeadlines from '@/schedule/components/WidgetDeadlines'

vi.mock('@/schedule/services', () => ({
  getScheduleModelsByKey: (_: string) => mockedGetScheduleModelsByKey(_),
}))

const activeDate = new Date(2024, 4, 29)
const defaultProps: WidgetActiveDayProps = {
  activeDate,
  deadlines: [],
}

function createWrapper(override: Partial<WidgetActiveDayProps> = {}) {
  const props = {
    ...defaultProps,
    ...override,
  }

  return wrapperFactory(WidgetActiveDay, {
    props,
  })
}

function findComponentsInWrapper(wrapper: VueWrapper) {
  const longDate = wrapper.find('[data-testid="widget-active-day-long-date"]')
  const noData = wrapper.find('[data-testid="widget-active-day-no-data"]')
  const widgetDeadlines = wrapper.findComponent({ name: 'WidgetDeadlines' })

  return {
    longDate,
    noData,
    widgetDeadlines,
  }
}
describe('test WidgetActiveDay', () => {
  const expectedLongDateText = 'Wednesday, May 29, 2024'
  const mockedDeadLines = getMockedDeadlines()
  it('should render properly when no data', () => {
    const wrapper = createWrapper()
    const expectedNoDataText = 'No events plannedRelax, you have nothing planned today!'

    const {
      longDate,
      noData,
      widgetDeadlines,
    } = findComponentsInWrapper(wrapper)

    expect(longDate.text()).toBe(expectedLongDateText)
    expect(noData.text()).toBe(expectedNoDataText)
    expect(widgetDeadlines.exists()).toBeFalsy()
  })

  it('should render properly when deadlines are present', () => {
    const expectedWidgetDeadlinesProps = {
      deadlines: mockedDeadLines,
    }
    const wrapper = createWrapper({
      deadlines: mockedDeadLines,
    })

    const {
      longDate,
      noData,
      widgetDeadlines,
    } = findComponentsInWrapper(wrapper)

    expect(longDate.text()).toBe(expectedLongDateText)
    expect(noData.exists()).toBeFalsy()
    expect(widgetDeadlines.props()).toStrictEqual(expectedWidgetDeadlinesProps)
  })

  it('should emit select-deadline event when first widget deadline element is clicked', () => {
    const occurrenceId = 1234567890
    const wrapper = createWrapper({ deadlines: mockedDeadLines })
    wrapper.findAllComponents(WidgetDeadlines)[0].vm.$emit('select-deadline', occurrenceId)
    expect(wrapper.emitted('select-deadline')).toStrictEqual([
      [occurrenceId],
    ])
  })
})
