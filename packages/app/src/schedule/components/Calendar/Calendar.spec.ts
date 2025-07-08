import { nextTick } from 'vue'
import { vi, expect, describe, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import wrapperFactory from '@app/__mocks__/wrapper.factory'
import { getNotCompletelyDoneDeadlinesByDateMock } from '@app/__mocks__/deadline.mocks'
import { scheduleServicesMock } from '@app/__mocks__/schedule.service.mocks'
import { tvaLabelMock } from '@app/__mocks__/schedule.mocks'
import { PCalendar } from '@pulse/styleguide/components'
import type { CalendarProps } from './CalendarTypes'
import { AmplitudeService as AmplitudeServiceMock } from '@pulse/common/services/amplitude'

import Calendar from '.'

const notCompletelyDoneDeadlinesByDateMock = getNotCompletelyDoneDeadlinesByDateMock()

vi.mock('@app/schedule/services', () => scheduleServicesMock)

vi.mock('@pulse/common/services/amplitude')

const FIXED_DATE = new Date(2024, 3, 1)

const props: CalendarProps = {
  modelValue: FIXED_DATE,
  deadlinesByDate: notCompletelyDoneDeadlinesByDateMock,
  pRange: [FIXED_DATE, new Date(2024, 3, 30)],
}

const createWrapper = () =>
  wrapperFactory(Calendar, {
    props,
    global: {
    },
  })

const firstDeadlineMock =
  notCompletelyDoneDeadlinesByDateMock[0].deadlines[0]
const secondDeadlineMock =
  notCompletelyDoneDeadlinesByDateMock[1].deadlines[0]

describe('calendar component', () => {
  it('renders a wrapper', () => {
    const wrapper = createWrapper()
    const calendarWrapper = wrapper.find('.calendar__wrapper')
    expect(calendarWrapper.exists()).toBeTruthy()
  })

  it.each([
    {
      firstDeadlineExpectedTitle: tvaLabelMock,
      secondDeadlineExpectedTitle: tvaLabelMock,
    },
    {
      firstDeadlineExpectedTitle: tvaLabelMock,
      secondDeadlineExpectedTitle: tvaLabelMock,
    },
  ])(
    'formats deadlines appropriately',
    async ({ firstDeadlineExpectedTitle, secondDeadlineExpectedTitle }) => {
      const wrapper = createWrapper()
      await flushPromises()
      const calendarWrapper = wrapper.findComponent(PCalendar)
      expect(calendarWrapper.exists()).toBeTruthy()
      // checking that props are properly formatted

      expect(calendarWrapper.props('pItemsGroupedByDate')).toStrictEqual([
        {
          date: '2024-02-22',
          items: [
            {
              pTitle: firstDeadlineExpectedTitle,
              pStatus: firstDeadlineMock.globalStatus.toLocaleLowerCase(),
              pCompletedTasks: 1,
              pItemId: 1,
              pTotalTasks: 2,
            },
          ],
        },
        {
          date: '2024-02-21',
          items: [
            {
              pTitle: secondDeadlineExpectedTitle,
              pStatus: secondDeadlineMock.globalStatus.toLocaleLowerCase(),
              pCompletedTasks: 1,
              pItemId: 1,
              pTotalTasks: 2,
            },
          ],
        },
      ])
    },
  )
  it("should emit the 'update:modelValue' event when the v-model is updated", async () => {
    const wrapper = createWrapper()
    const pAutocomplete = wrapper.findComponent({ name: 'PCalendar' })
    pAutocomplete.vm.$emit('update:modelValue', 'Test')
    await nextTick()

    expect(wrapper.emitted('update:modelValue')).toStrictEqual([['Test']])
  })
  it('should emit select-deadline event', () => {
    const wrapper = createWrapper()
    const occurrenceId = 1234567890
    wrapper.findComponent(PCalendar).vm.$emit('select-deadline', occurrenceId)
    expect(wrapper.emitted('select-deadline')).toStrictEqual([[occurrenceId]])
    expect(AmplitudeServiceMock.track).toHaveBeenCalledWith('Reminder Consulted',
      { reminder_consultation_localisation: 'calendar' })
  })
})
