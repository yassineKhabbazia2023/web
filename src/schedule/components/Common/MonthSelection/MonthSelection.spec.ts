import wrapperFactory from '@/schedule/tests/utils/wrapperFactory'
import MonthSelection from '.'
import { expect, describe, it } from 'vitest'

const TEST_DATE = '2024-04-10'

function createWrapper() {
  const props = {
    activeDate: new Date(TEST_DATE),
  }
  return wrapperFactory(MonthSelection, {
    props,
  })
}

describe('month.vue', () => {
  it('should emit an event containing next-month in payload', async () => {
    const wrapper = createWrapper()
    await wrapper.find('[data-testid=schedule-next-month-button]').trigger('click')
    expect(wrapper.emitted('calendar-event')).toBeTruthy()
  })

  it('should emit an event containing prev-month in payload', async () => {
    const wrapper = createWrapper()
    await wrapper.find('[data-testid=schedule-prev-month-button]').trigger('click')
    expect(wrapper.emitted('calendar-event')).toBeTruthy()
  })
})

