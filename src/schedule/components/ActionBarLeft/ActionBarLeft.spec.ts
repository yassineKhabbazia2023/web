import { shallowMount } from '@vue/test-utils'
import dayjs from 'dayjs'
import ActionBarLeft from '.'
import { expect, describe, it, vi } from 'vitest'
import type { ActionBarLeftProps } from './ActionBarLeftTypes'

const TEST_DATE = '2024-04-10'

function createWrapper(override: Partial<ActionBarLeftProps> = {}) {
  const defaultProps: ActionBarLeftProps = {
    activeDate: new Date(TEST_DATE),
  }
  const props = {
    ...defaultProps,
    ...override,
  }

  return shallowMount(ActionBarLeft, {
    props,
  })
}

describe('month.vue', () => {
  it('should emit an event containing next-month in payload', async () => {
    const NEW_DATE = '2024-05-01'
    const wrapper = createWrapper()
    await wrapper.find('[data-testid=schedule-next-month-button]').trigger('click')

    const newActiveDate = wrapper.emitted('update:active-date')?.at(0)?.at(0) as Date
    expect(dayjs(newActiveDate).format('YYYY-MM-DD')).toBe(NEW_DATE)
  })

  it('should emit an event containing prev-month in payload', async () => {
    const NEW_DATE = '2024-03-01'
    const wrapper = createWrapper()
    await wrapper.find('[data-testid=schedule-prev-month-button]').trigger('click')

    const newActiveDate = wrapper.emitted('update:active-date')?.at(0)?.at(0) as Date
    expect(dayjs(newActiveDate).format('YYYY-MM-DD')).toBe(NEW_DATE)
  })

  it('should emit update:active-date with today date', async () => {
    const mockedToday = new Date('2024-05-21T13:00:00.000Z')
    vi.useFakeTimers()
    vi.setSystemTime(mockedToday)

    const wrapper = createWrapper()
    const todayButton = wrapper.find('[data-testid="action-bar-left-today"]')
    await todayButton.trigger('click')
    expect(wrapper.emitted('update:active-date')).toStrictEqual([[mockedToday]])
  })
})

