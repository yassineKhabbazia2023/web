import { defineStore } from 'pinia'
import { createTestingPinia } from '@pinia/testing'
import { commonStore } from '@kpmg/common'
import wrapperFactory from '@/schedule/tests/utils/wrapperFactory'
import { vi, expect, describe, it } from 'vitest'
import Calendar from '.'
import type { CalendarProps } from './CalendarTypes'
import { PCalendar } from '@kpmg/styleguide'
import { notCompletelyDoneDeadlinesByDateMock } from '@/schedule/tests/mocks/Deadline'
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
      firstDeadlineExpectedTitle:
        firstDeadlineMock.template.typeShortCollaborator,
      secondDeadlineExpectedTitle:
        secondDeadlineMock.template.typeShortCollaborator,
    },
    {
      userType: 'collab',
      firstDeadlineExpectedTitle: firstDeadlineMock.template.typeShortCollaborator,
      secondDeadlineExpectedTitle: secondDeadlineMock.template.typeShortCollaborator,
    },
  ])(
    'formats deadlines appropriately',
    ({ userType, firstDeadlineExpectedTitle, secondDeadlineExpectedTitle }) => {
      // @ts-expect-error: Getter is read only
      store.isCollab = userType === 'collab'
      const wrapper = createWrapper()
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
              pTotalTasks: 2,
            },
          ],
        },
      ])
    },
  )
})
