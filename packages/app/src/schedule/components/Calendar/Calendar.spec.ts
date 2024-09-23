
import { vi, expect, describe, it } from 'vitest'

import { defineStore } from 'pinia'
import { createTestingPinia } from '@pinia/testing'
import { nextTick } from 'vue'
import { commonStore } from '@pulse/Common'
import wrapperFactory from '@app/schedule/tests/utils/wrapperFactory'
import type { CalendarProps } from './CalendarTypes'
import { PCalendar } from '@kpmg/styleguide'
import { getNotCompletelyDoneDeadlinesByDateMock } from '@app/schedule/tests/mocks/Deadline'
import { collabUser } from '@app/schedule/tests/mocks/User'
import { flushPromises } from '@vue/test-utils'
import { TvaLabel, mockedGetScheduleModelsByKey } from '@app/schedule/tests/mocks/commonViMock'
import Calendar from '.'

const notCompletelyDoneDeadlinesByDateMock = getNotCompletelyDoneDeadlinesByDateMock()

const pinia = createTestingPinia()
vi.mock('@pulse/Common', () => ({
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
  dataProvider: () => {
    return {
      fetchUserData: vi.fn(),
    }
  },
}))

vi.mock('@app/schedule/services', () => ({
  getScheduleModelsByKey: (_: string) => mockedGetScheduleModelsByKey(_),
}))

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
      plugins: [pinia],
    },
  })

const store = commonStore(pinia)

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
      userType: 'collab',
      firstDeadlineExpectedTitle: TvaLabel,
      secondDeadlineExpectedTitle: TvaLabel,
    },
    {
      userType: 'collab',
      firstDeadlineExpectedTitle: TvaLabel,
      secondDeadlineExpectedTitle: TvaLabel,
    },
  ])(
    'formats deadlines appropriately',
    async ({ userType, firstDeadlineExpectedTitle, secondDeadlineExpectedTitle }) => {
      // @ts-expect-error: Getter is read only
      store.isCollab = userType === 'collab'
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
  })
})
