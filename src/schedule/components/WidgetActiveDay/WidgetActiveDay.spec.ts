import { describe, it, expect } from 'vitest'
import wrapperFactory from '@/schedule/tests/utils/wrapperFactory'
import type { WidgetActiveDayProps } from './WidgetActiveDayTypes'
import WidgetActiveDay from '.'

const activeDate = new Date(2024, 4, 29)
const defaultProps: WidgetActiveDayProps = {
  activeDate,
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

describe('test WidgetActiveDay', () => {
  it('should render properly', () => {
    const wrapper = createWrapper()
    const expectedLongDateText = 'Wednesday, May 29, 2024'
    const expectedNoDataText = 'No events plannedRelax, you have nothing planned today!'

    const longDate = wrapper.find('[data-testid="widget-active-day-long-date"]')
    const noData = wrapper.find('[data-testid="widget-active-day-no-data"]')

    expect(longDate.text()).toBe(expectedLongDateText)
    expect(noData.text()).toBe(expectedNoDataText)
  })
})
