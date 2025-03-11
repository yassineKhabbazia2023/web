import { describe, it, expect, vi } from 'vitest'
import wrapperFactory from '@app/__mocks__/wrapper.factory'
import type { WidgetActiveDayProps } from './WidgetActiveDayTypes'
import { getMockedDeadlines } from '@app/__mocks__/deadline.mocks'
import type { VueWrapper } from '@vue/test-utils'
import { scheduleServicesMock } from '@app/__mocks__/schedule.service.mocks'
import WidgetDeadlines from '@app/schedule/components/WidgetDeadlines'

import WidgetActiveDay from '.'


vi.mock('@app/schedule/services', () => scheduleServicesMock)

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
