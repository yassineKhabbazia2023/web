import List from '.'
import wrapperFactory from '@/schedule/tests/utils/wrapperFactory'
import type { DeadlinesByDate } from '@/schedule/models/Deadline'
import { expect, describe, it, vi } from 'vitest'
import { notCompletelyDoneDeadlinesByDateMock } from '@/schedule/tests/mocks/Deadline'

const activeDate = new Date(2024, 5, 1)
const createWrapper = (deadlinesByDate: DeadlinesByDate[]) =>
  wrapperFactory(List, { props: { activeDate, deadlinesByDate } })

vi.mock('@/schedule/services', () => ({
  getScheduleModelsByKey: () => ({
    TVA: 'TVA au 21 (Taxe sur la valeur ajoutée)',
  }),
}))

describe('list component', () => {
  it('should emit update-drawer-display event', () => {
    const scheduleId = '123456789'

    const wrapper = createWrapper(notCompletelyDoneDeadlinesByDateMock)
    wrapper.vm.pushDrawerEvent(scheduleId)
    expect(wrapper.emitted('update-drawer-display')).toStrictEqual([
      [scheduleId],
    ])
  })

  it('should emit click-date when click on ListItem', async () => {
    const wrapper = createWrapper(notCompletelyDoneDeadlinesByDateMock)
    const firstListItem = wrapper.findComponent({ name: 'ListItem' })
    const firstDate = notCompletelyDoneDeadlinesByDateMock[0].date
    await firstListItem.trigger('click')

    expect(wrapper.emitted('click-date')).toStrictEqual([[firstDate]])
  })
})
