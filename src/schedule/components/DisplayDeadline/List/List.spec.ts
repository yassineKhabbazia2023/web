import List from '.'
import wrapperFactory from '@/schedule/tests/utils/wrapperFactory'
import type { DeadlinesByDate } from '@/schedule/models/Deadline'
import { expect, describe, it } from 'vitest'
import { notCompletelyDoneDeadlinesByDateMock } from '@/schedule/tests/mocks/Deadline'

const createWrapper = (items: DeadlinesByDate[]) =>
  wrapperFactory(List, { props: { items } })

describe('list component', () => {
  it('should emit update-drawer-display event', () => {
    const scheduleId = '123456789'

    const wrapper = createWrapper(notCompletelyDoneDeadlinesByDateMock)
    wrapper.vm.pushDrawerEvent(scheduleId)
    expect(wrapper.emitted('update-drawer-display')).toStrictEqual([
      [scheduleId],
    ])
  })
})
