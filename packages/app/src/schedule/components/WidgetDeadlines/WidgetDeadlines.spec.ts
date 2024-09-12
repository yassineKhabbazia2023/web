import { describe, it, expect, vi } from 'vitest'

import wrapperFactory from '@/schedule/tests/utils/wrapperFactory'
import type { WidgetDeadlinesProps } from './WidgetDeadlinesTypes'
import WidgetDeadlines from '.'
import { mockedGetScheduleModelsByKey } from '@/schedule/tests/mocks/commonViMock'
import { getMockedDeadlines } from '@/schedule/tests/mocks/Deadline'
import { nextTick } from 'vue'

vi.mock('@/schedule/services', () => ({
  getScheduleModelsByKey: (_: string) => mockedGetScheduleModelsByKey(_),
}))

const defaultProps: WidgetDeadlinesProps = {
  deadlines: [],
}

function createWrapper(override: Partial<WidgetDeadlinesProps> = {}) {
  const props = {
    ...defaultProps,
    ...override,
  }

  return wrapperFactory(WidgetDeadlines, {
    props,
  })
}

describe('test WidgetDeadlines', () => {
  const deadlines = getMockedDeadlines()
  it('should render properly', async () => {
    const wrapper = createWrapper({
      deadlines,
    })
    await nextTick()

    const items = wrapper.findAll('[data-testid="widget-deadlines-item"]')
    const firstDeadline = deadlines[0]
    const { template, accountList } = firstDeadline
    const expectedText = `${template.typeShort} (${template.typeLong})${accountList.at(0)?.name}`

    expect(items).toHaveLength(deadlines.length)
    expect(items.at(0)?.text()).toBe(expectedText)
  })
  it('should emit select-deadline event when first widget deadline element is clicked', async () => {
    const wrapper = createWrapper({ deadlines })
    const firstItem = wrapper.findAll('[data-testid="widget-deadlines-item"]')[0]
    await firstItem.trigger('click')
    expect(wrapper.emitted('select-deadline')).toStrictEqual([
      [1],
    ])
  })
})
