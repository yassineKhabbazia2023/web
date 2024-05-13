import { nextTick } from 'vue'
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
  getNotCompletelyDoneDeadlinesByDateMock,
  getDoneDeadlinesByDateMock,
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

const createWrapper = (deadlinesByDate: DeadlinesByDate, isActiveDate = false) =>
  wrapperFactory(ListItem, {
    props: { deadlinesByDate, isActiveDate },
    global: {
      plugins: [pinia],
    },
  })

commonStore(pinia)

const doneDeadlinesByDateMock = getDoneDeadlinesByDateMock()
const deadlinesByDate: DeadlinesByDate = doneDeadlinesByDateMock[0]

describe('schedule item', () => {
  it('renders list item information with files progress', async () => {
    const notCompletelyDoneDeadlinesByDateMock = getNotCompletelyDoneDeadlinesByDateMock()
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

  it('display properly when isActiveDate is false', () => {
    const wrapper = createWrapper(deadlinesByDate)
    const scheduleListItem = wrapper.find('[data-testid="schedule-list-item"]')

    expect(scheduleListItem.classes()).not.toContain('schedule-list-item--is-active-date')
    expect(scheduleListItem.classes()).not.toContain('schedule-list-item--is-today')
  })

  it('display properly when isActiveDate is true', () => {
    const wrapper = createWrapper(deadlinesByDate, true)
    const scheduleListItem = wrapper.find('[data-testid="schedule-list-item"]')

    expect(scheduleListItem.classes()).toContain('schedule-list-item--is-active-date')
    expect(scheduleListItem.classes()).not.toContain('schedule-list-item--is-today')
  })

  it('display properly when deadlinesByDate is today', () => {
    const deadlinesByDate: DeadlinesByDate = doneDeadlinesByDateMock[1]
    const mockedToday = new Date(deadlinesByDate.date)

    vi.useFakeTimers()
    vi.setSystemTime(mockedToday)

    const wrapper = createWrapper(deadlinesByDate)
    const scheduleListItem = wrapper.find('[data-testid="schedule-list-item"]')

    expect(scheduleListItem.classes()).not.toContain('schedule-list-item--is-active-date')
    expect(scheduleListItem.classes()).toContain('schedule-list-item--is-today')
  })

  it('should emit select-deadline event', async () => {
    const occurrenceId = 123456789
    const wrapper = createWrapper(deadlinesByDate)
    const firstDeadline = wrapper.findComponent({ name: 'Deadlines' })
    firstDeadline.vm.$emit('select-deadline', occurrenceId)
    await nextTick()

    expect(wrapper.emitted('select-deadline')).toStrictEqual([
      [occurrenceId],
    ])
  })
})
