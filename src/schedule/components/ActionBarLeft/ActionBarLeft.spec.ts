import dayjs from 'dayjs'
import wrapperFactory from '@/schedule/tests/utils/wrapperFactory'
import ActionBarLeft from '.'
import { expect, describe, it } from 'vitest'

const TEST_DATE = '2024-04-10'

function createWrapper() {
  const props = {
    activeDate: new Date(TEST_DATE),
  }
  return wrapperFactory(ActionBarLeft, {
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
})

