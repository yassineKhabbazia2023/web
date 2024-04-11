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

const TvaLabel = 'TVA (Taxe sur la valeur ajoutée)'
const mockedGetScheduleModelsByKey = vi.fn((_: string) => ({
  TVA: TvaLabel,
}))
vi.mock('@/schedule/services', () => ({
  getScheduleModelsByKey: (_: string) => mockedGetScheduleModelsByKey(_),
}))

const createWrapper = (itemData: DeadlinesByDate) =>
  wrapperFactory(ListItem, {
    props: { itemData },
    global: {
      plugins: [pinia],
    },
  })

commonStore(pinia)

describe('schedule item', () => {
  it('renders list item information with files progress', async () => {
    const itemData: DeadlinesByDate = notCompletelyDoneDeadlinesByDateMock[0]

    const wrapper = createWrapper(itemData)
    await flushPromises()
    expect(wrapper.find('[data-testid="schedule-list-item-date"').text())
      .toBe(dateToLocaleFormat(itemData.date))

    const expectedText = TvaLabel
    const deadLineContentLabel = wrapper.find('.p-schedule-deadline__content-label').text()
    expect(deadLineContentLabel).toBe(expectedText)

    expect(wrapper.find('.p-schedule-deadline__content-progress').text())
      .toBe('1/2 files done')

    expect(wrapper.find('.p-schedule-deadline__tag').text())
      .toBe(itemData.deadlines[0].globalStatus)
  })

  it('renders list item information with ibs name', async () => {
    const itemData: DeadlinesByDate = doneDeadlinesByDateMock[0]

    const wrapper = createWrapper(itemData)
    await flushPromises()
    expect(wrapper.find('[data-testid="schedule-list-item-date"').text())
      .toBe(dateToLocaleFormat(itemData.date))

    const expectedText = TvaLabel
    const deadLineContentLabel = wrapper.find('.p-schedule-deadline__content-label').text()
    expect(deadLineContentLabel).toBe(expectedText)

    expect(wrapper.find('.p-schedule-deadline__content-progress').text())
      .toBe(itemData.deadlines[0].accountList[0].name)

    expect(wrapper.find('.p-schedule-deadline__tag').text())
      .toBe(itemData.deadlines[0].globalStatus)
  })

  it('should emit update-drawer-visibility event', () => {
    const scheduleId = '123456789'
    const itemData: DeadlinesByDate = doneDeadlinesByDateMock[0]

    const wrapper = createWrapper(itemData)
    wrapper.vm.pushEventToList(scheduleId)
    expect(wrapper.emitted('update-drawer-visibility')).toStrictEqual([
      [scheduleId],
    ])
  })
})
