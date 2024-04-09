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
const createWrapper = (itemData: DeadlinesByDate) =>
  wrapperFactory(ListItem, {
    props: { itemData },
    global: {
      plugins: [pinia],
    },
  })

commonStore(pinia)

describe('schedule item', () => {
  it('renders list item information with files progress', () => {
    const itemData: DeadlinesByDate = notCompletelyDoneDeadlinesByDateMock[0]

    const wrapper = createWrapper(itemData)
    expect(wrapper.find('.p-schedule-list-item__date').text())
      .toBe(dateToLocaleFormat(itemData.date))

    expect(wrapper.find('.p-schedule-deadline__content-label').text())
      // eslint-disable-next-line max-len
      .toBe(`${itemData.deadlines[0].template.typeShortCollaborator} (${itemData.deadlines[0].template.typeLong})`)

    expect(wrapper.find('.p-schedule-deadline__content-progress').text())
      .toBe('1/2 files done')

    expect(wrapper.find('.p-schedule-deadline__tag').text())
      .toBe(itemData.deadlines[0].globalStatus)
  })

  it('renders list item information with ibs name', () => {
    const itemData: DeadlinesByDate = doneDeadlinesByDateMock[0]

    const wrapper = createWrapper(itemData)
    expect(wrapper.find('.p-schedule-list-item__date').text())
      .toBe(dateToLocaleFormat(itemData.date))

    expect(wrapper.find('.p-schedule-deadline__content-label').text())
      // eslint-disable-next-line max-len
      .toBe(`${itemData.deadlines[0].template.typeShortCollaborator} (${itemData.deadlines[0].template.typeLong})`)

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
