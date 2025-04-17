import { nextTick } from 'vue'
import { expect, describe, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { tvaLabelMock } from '@app/__mocks__/schedule.mocks'
import { scheduleServicesMock } from '@app/__mocks__/schedule.service.mocks'
import wrapperFactory from '@app/__mocks__/wrapper.factory'
import { getNotCompletelyDoneDeadlinesByDateMock, getDoneDeadlinesByDateMock } from '@app/__mocks__/deadline.mocks'
import type { DeadlinesByDate } from '@app/schedule/models/Deadline'
import { dateToLocaleFormat } from '@app/schedule/helpers/utils'

import ListItem from '.'

vi.mock('@app/schedule/services', () => scheduleServicesMock)

vi.mock('@pulse/common', () => ({
  dataProvider: () => {
    return {
      fetchUserData: vi.fn(),
    }
  },
}))

const createWrapper = (deadlinesByDate: DeadlinesByDate, isActiveDate = false) =>
  wrapperFactory(ListItem, {
    props: { deadlinesByDate, isActiveDate },
    global: {
    },
  })

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

    const expectedText = tvaLabelMock
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

    const expectedText = tvaLabelMock
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
