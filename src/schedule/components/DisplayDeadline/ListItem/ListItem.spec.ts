import { TvaLabel, mockedGetScheduleModelsByKey } from '@/schedule/tests/mocks/commonViMock'
import { defineStore } from 'pinia'
import { createTestingPinia } from '@pinia/testing'
import { commonStore } from '@kpmg/common'
import ListItem from '.'
import wrapperFactory from '@/schedule/tests/utils/wrapperFactory'
import type { DeadlinesByDate } from '@/schedule/models/Deadline'
import { expect, describe, it, vi } from 'vitest'
import { dateToLocaleFormat } from '@/schedule/helpers/utils'
import {
  notCompletelyDoneDeadlinesByDateMock,
  doneDeadlinesByDateMock,
} from '@/schedule/tests/mocks/Deadline'
import { collabUser } from '@/schedule/tests/mocks/User'
import { flushPromises } from '@vue/test-utils'

const pinia = createTestingPinia()

vi.mock('@kpmg/common', () => ({
  commonStore: defineStore('common', {
    state: () => ({
      user: {
        ...collabUser,
      },
    }),
    getters: {
      isCollab: () => true,
    },
  }),
}))

vi.mock('@/schedule/services', () => ({
  getScheduleModelsByKey: (_: string) => mockedGetScheduleModelsByKey(_),
}))

const createWrapper = (deadlinesByDate: DeadlinesByDate) =>
  wrapperFactory(ListItem, {
    props: { deadlinesByDate },
    global: {
      plugins: [pinia],
    },
  })

commonStore(pinia)

describe('schedule item', () => {
  it('renders list item information with files progress', async () => {
    const deadlinesByDate: DeadlinesByDate = notCompletelyDoneDeadlinesByDateMock[0]

    const wrapper = createWrapper(deadlinesByDate)
    await flushPromises()
    expect(wrapper.find('[data-testid="schedule-list-item-date"').text())
      .toBe(dateToLocaleFormat(deadlinesByDate.date))

    const expectedText = TvaLabel
    const deadLineContentLabel = wrapper.find('.p-schedule-deadline__content-label').text()
    expect(deadLineContentLabel).toBe(expectedText)

    expect(wrapper.find('.p-schedule-deadline__content-progress').text())
      .toBe('1/2 files done')

    expect(wrapper.find('.p-schedule-deadline__tag').text())
      .toBe(deadlinesByDate.deadlines[0].globalStatus)
  })

  it('renders list item information with ibs name', async () => {
    const deadlinesByDate: DeadlinesByDate = doneDeadlinesByDateMock[0]

    const wrapper = createWrapper(deadlinesByDate)
    await flushPromises()
    expect(wrapper.find('[data-testid="schedule-list-item-date"').text())
      .toBe(dateToLocaleFormat(deadlinesByDate.date))

    const expectedText = TvaLabel
    const deadLineContentLabel = wrapper.find('.p-schedule-deadline__content-label').text()
    expect(deadLineContentLabel).toBe(expectedText)

    expect(wrapper.find('.p-schedule-deadline__content-progress').text())
      .toBe(deadlinesByDate.deadlines[0].accountList[0].name)

    expect(wrapper.find('.p-schedule-deadline__tag').text())
      .toBe(deadlinesByDate.deadlines[0].globalStatus)
  })

  it('should emit update-drawer-visibility event', () => {
    const scheduleId = '123456789'
    const deadlinesByDate: DeadlinesByDate = doneDeadlinesByDateMock[0]

    const wrapper = createWrapper(deadlinesByDate)
    wrapper.vm.pushEventToList(scheduleId)
    expect(wrapper.emitted('update-drawer-visibility')).toStrictEqual([
      [scheduleId],
    ])
  })
})
