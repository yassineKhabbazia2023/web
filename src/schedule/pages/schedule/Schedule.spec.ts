import { describe, it, expect, vi, beforeEach } from 'vitest'
import { KpmgCommontMock } from '@/schedule/tests/mocks/commonViMock'
import { nextTick } from 'vue'
import { flushPromises, type ComponentMountingOptions, type VueWrapper, shallowMount } from '@vue/test-utils'
import Schedule from '@/schedule/pages/schedule'
import ScheduleDrawer from '@/schedule/components/CreateSchedule/ScheduleDrawer'
import DeadlineList from '@/schedule/components/DisplayDeadline/DeadlineList'
import ActionBar from '@/schedule/components/ActionBar'
import WidgetActiveDay from '@/schedule/components/WidgetActiveDay'
import { getMonthInterval } from './ScheduleUtils'
import { accountsCollection } from '@/schedule/tests/mocks/Account'
import * as ScheduleServices from '@/schedule/services'
import { dateISOFormatter } from '@/schedule/helpers/utils'
import type { DeadlinesByDate } from '@/schedule/models/Deadline'
import { getMockedDeadlines } from '@/schedule/tests/mocks/Deadline'

const createWrapper = (options: ComponentMountingOptions<any>) =>
  shallowMount(Schedule, options)

const TEST_DATE = '2024-08-14'
const SAME_MONTH_DATE = '2024-08-18'
const OTHER_MONTH_DATE = '2024-11-03'
const OccurenceId = 1234567890

vi.mock('@kpmg/common', () => KpmgCommontMock)

vi.mock('@/schedule/services', () => ({
  getScheduleModels: () => [{
    key: 'TVA',
    label: 'TVA au 21',
  }],
  getScheduleModelsByKey: () => ({
    TVA: 'TVA au 21',
  }),
  getSchedulesCollection: () => Promise.resolve([{
    date: TEST_DATE,
    deadlines: getMockedDeadlines(),
  }]),
  getAccountsCollection: () => Promise.resolve({
    status: 'fulfilled',
    value: accountsCollection,
  }),
}),
)

const mockedToday = new Date(TEST_DATE)

const ActionBarStub = {
  name: 'ActionBar',
  template: '<div />',
  emits: ['create-schedule'],
}

const OccurrenceDrawerStub = {
  name: 'OccurrenceDrawer',
  template: '<div />',
}

describe('home page', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(mockedToday)
  })

  it('should render home page', () => {
    const wrapper = createWrapper({
      global: {
        stubs: {
          ScheduleDrawer,
          DeadlineList,
          OccurrenceDrawer: OccurrenceDrawerStub,
        },
      },
    })
    expect(wrapper.exists()).toBeTruthy()
  })

  it('should call getSchedulesCollection only once onMounted', async () => {
    const getSchedulesCollectionSpy = vi
      .spyOn(ScheduleServices, 'getSchedulesCollection')

    createWrapper({
      global: {
        stubs: {
          ScheduleDrawer,
          DeadlineList,
          OccurrenceDrawer: OccurrenceDrawerStub,
        },
      },
    })
    await flushPromises()
    const expectedMonthRange = getMonthInterval(mockedToday, 7)

    expect(getSchedulesCollectionSpy).toHaveBeenCalledOnce()
    expect(getSchedulesCollectionSpy).toHaveBeenNthCalledWith(1, expectedMonthRange)
  })

  function findCalendarWidgetLoader(wrapper: VueWrapper) {
    return wrapper.find('[data-test-id="schedule-calendar-widget-loader"]')
  }

  describe('interactions', () => {
    it('should display the drawer on displayDeadlineDrawer event', async () => {
      const wrapper = createWrapper({
        global: {
          stubs: {
            ScheduleDrawer: {
              name: 'ScheduleDrawer',
              template: '<div />',
            },
            DeadlineList,
            ActionBar: ActionBarStub,
          },
        },
      })

      expect(wrapper.findComponent({ name: 'ScheduleDrawer' }).exists()).toBeFalsy()
      await wrapper.findComponent({ name: 'ActionBar' }).vm.$emit('create-schedule')
      expect(wrapper.findComponent({ name: 'ScheduleDrawer' }).exists()).toBeTruthy()
    })

    it('should give filtered deadlines of current month to DeadlineList', async () => {
      const mockedDeadLinesA = getMockedDeadlines()
      const currentMounthDeadlines: DeadlinesByDate[] = [{
        date: TEST_DATE,
        deadlines: mockedDeadLinesA,
      }, {
        date: SAME_MONTH_DATE,
        deadlines: [],
      }]
      const nextMounthDeadlines: DeadlinesByDate[] = [{
        date: OTHER_MONTH_DATE,
        deadlines: mockedDeadLinesA,
      }]

      vi
        .spyOn(ScheduleServices, 'getSchedulesCollection')
        .mockResolvedValueOnce([
          ...currentMounthDeadlines,
          ...nextMounthDeadlines,
        ])

      const expectedDeadlinesByDate = [...currentMounthDeadlines]

      const wrapper = createWrapper({
        global: {
          stubs: {
            ScheduleDrawer,
            DeadlineList: {
              name: 'DeadlineList',
              template: '<div />',
              props: ['modelValue', 'deadlinesByDate', 'pRange'],
            },
            ActionBar: ActionBarStub,
            Calendar: {
              name: 'Calendar',
              template: '<div />',
            },
            OccurrenceDrawer: OccurrenceDrawerStub,
          },
        },
      })

      await flushPromises()
      const actionBarWrapper = wrapper.findComponent(ActionBar)

      await actionBarWrapper.vm.$emit('update:modelValue', 'list')
      const deadlinesListWrapper = wrapper.findComponent({ name: 'DeadlineList' })
      await nextTick()

      expect(deadlinesListWrapper.props('deadlinesByDate')).toStrictEqual(expectedDeadlinesByDate)
    })

    it('should update the visible section on activeScheduleViewType change', async () => {
      const wrapper = createWrapper({
        global: {
          stubs: {
            ScheduleDrawer,
            DeadlineList,
            ActionBar: ActionBarStub,
          },
        },
      })

      await flushPromises()
      const actionBarWrapper = wrapper.findComponent(ActionBar)
      const deadlinesListWrapper = wrapper.findComponent({ name: 'DeadlineList' })
      const calendarWrapper = wrapper.findComponent({ name: 'Calendar' })

      expect(calendarWrapper.exists()).toBeTruthy()
      expect(deadlinesListWrapper.exists()).toBeFalsy()

      await actionBarWrapper.vm.$emit('update:modelValue', 'list')

      expect(wrapper.findComponent(DeadlineList).exists()).toBeTruthy()
      expect(calendarWrapper.exists()).toBeFalsy()
    })

    describe('when activeDate is changed in calendar', () => {
      let wrapper: VueWrapper
      let calendarWrapper: VueWrapper

      beforeEach(async () => {
        wrapper = createWrapper({
          props: {
            defaultActiveDate: TEST_DATE,
          },
          global: {
            stubs: {
              ScheduleDrawer,
              DeadlineList,
              ActionBar: ActionBarStub,
            },
          },
        })

        await flushPromises()
        calendarWrapper = wrapper.findComponent({ name: 'Calendar' })
      })

      it('should update active date because date changed', async () => {
        const sameMonthDate = new Date(SAME_MONTH_DATE)
        calendarWrapper.vm.$emit('update:model-value', sameMonthDate)
        await flushPromises()

        const refreshedCalendarWrapper = wrapper.findComponent({ name: 'Calendar' })
        const newDate = refreshedCalendarWrapper.props('modelValue')
        const expectedNewDate = sameMonthDate
        expect(newDate).toStrictEqual(expectedNewDate)
      })

      it('should update range because month changed', async () => {
        calendarWrapper.vm.$emit('update:model-value', new Date(OTHER_MONTH_DATE))
        await flushPromises()

        const refreshedCalendarWrapper = wrapper.findComponent({ name: 'Calendar' })
        const range = refreshedCalendarWrapper.props('pRange')
        const beginRange = range[0].toISOString().substring(0, 7)
        const expectedBeginRange = OTHER_MONTH_DATE.substring(0, 7)
        expect(beginRange).toStrictEqual(expectedBeginRange)
      })
    })

    it('should fired calendar-event', async () => {
      const wrapper = createWrapper({
        global: {
          stubs: {
            ScheduleDrawer,
            DeadlineList,
            ActionBar: ActionBarStub,
          },
        },
      })
      wrapper.findComponent(ActionBar).vm.$emit('calendar-event', { type: 'next-month', date: new Date() })
      await nextTick()
      expect(wrapper.findComponent(ActionBar).emitted('calendar-event')).toHaveLength(1)
    })

    it('should change activeDate when DeadlineList emits change-date', async () => {
      const wrapper = createWrapper({
        global: {
          stubs: {
            ScheduleDrawer,
            DeadlineList,
            ActionBar: ActionBarStub,
          },
        },
      })
      const actionBar = wrapper.findComponent({ name: 'ActionBar' })
      await actionBar.vm.$emit('update:modelValue', 'list')

      const deadlineList = wrapper.findComponent({ name: 'DeadlineList' })

      deadlineList.vm.$emit('click-date', OTHER_MONTH_DATE)
      await nextTick()
      const activeDate = deadlineList.props('activeDate')
      expect(dateISOFormatter(activeDate)).toBe(OTHER_MONTH_DATE)
    })

    it('should load other month data when change day from Widget Calendar', async () => {
      const mockedDeadLinesA = getMockedDeadlines()
      vi
        .spyOn(ScheduleServices, 'getSchedulesCollection')
        .mockResolvedValueOnce([{
          date: SAME_MONTH_DATE,
          deadlines: [],
        }])
        .mockResolvedValueOnce([{
          date: OTHER_MONTH_DATE,
          deadlines: mockedDeadLinesA,
        }])
      const wrapper = createWrapper({
        global: {
          stubs: {
            ScheduleDrawer,
            DeadlineList,
            ActionBar: ActionBarStub,
            PDatePicker: {
              name: 'PDatePicker',
              template: '<div />',
              props: ['pSchedulesCollection'],
              emits: ['panel-change'],
            },
            Calendar: {
              name: 'Calendar',
              template: '<div />',
              props: ['deadlinesByDate'],
            },
          },
        },
      })
      await flushPromises()

      const datePicker = wrapper.findComponent({ name: 'PDatePicker' })
      expect(datePicker.props('pSchedulesCollection')).toStrictEqual([SAME_MONTH_DATE])

      datePicker.vm.$emit('update:model-value', new Date(OTHER_MONTH_DATE))

      await nextTick()
      vi.advanceTimersByTime(300)
      await nextTick()

      await flushPromises()
      const expectedDeadlinesByDate: DeadlinesByDate[] = [{
        date: OTHER_MONTH_DATE,
        deadlines: mockedDeadLinesA,
      }]

      const calendar = wrapper.findComponent({ name: 'Calendar' })
      expect(calendar.props('deadlinesByDate')).toStrictEqual(expectedDeadlinesByDate)
    })

    it('should load other month data when change month from widget Calendar', async () => {
      vi
        .spyOn(ScheduleServices, 'getSchedulesCollection')
        .mockResolvedValueOnce([{
          date: SAME_MONTH_DATE,
          deadlines: [],
        }])
        .mockResolvedValueOnce([{
          date: OTHER_MONTH_DATE,
          deadlines: [],
        }])
      const wrapper = createWrapper({
        global: {
          stubs: {
            ScheduleDrawer,
            DeadlineList,
            ActionBar: ActionBarStub,
            PDatePicker: {
              name: 'PDatePicker',
              template: '<div />',
              props: ['pSchedulesCollection'],
              emits: ['panel-change'],
            },
            OccurrenceDrawer: OccurrenceDrawerStub,
          },
        },
      })
      await flushPromises()

      const datePicker = wrapper.findComponent({ name: 'PDatePicker' })
      expect(datePicker.props('pSchedulesCollection')).toStrictEqual([SAME_MONTH_DATE])

      const calendarWidgetLoaderBefore = findCalendarWidgetLoader(wrapper)
      expect(calendarWidgetLoaderBefore.exists()).toBeFalsy()

      datePicker.vm.$emit('panel-change', new Date(OTHER_MONTH_DATE))

      await nextTick()
      vi.advanceTimersByTime(300)
      await nextTick()

      const calendarWidgetLoader = findCalendarWidgetLoader(wrapper)
      expect(calendarWidgetLoader.exists()).toBeTruthy()

      await flushPromises()

      const calendarWidgetLoaderAfter = findCalendarWidgetLoader(wrapper)
      expect(calendarWidgetLoaderAfter.exists()).toBeFalsy()

      expect(datePicker.props('pSchedulesCollection')).toStrictEqual([OTHER_MONTH_DATE])
    })

    it('should load other month data when change active date from calendar', async () => {
      vi
        .spyOn(ScheduleServices, 'getSchedulesCollection')
        .mockResolvedValueOnce([{
          date: SAME_MONTH_DATE,
          deadlines: [],
        }])
        .mockResolvedValueOnce([{
          date: OTHER_MONTH_DATE,
          deadlines: [],
        }])
      const wrapper = createWrapper({
        global: {
          stubs: {
            ScheduleDrawer,
            DeadlineList,
            ActionBar: ActionBarStub,
            PDatePicker: {
              name: 'PDatePicker',
              template: '<div />',
              props: ['pSchedulesCollection'],
              emits: ['panel-change'],
            },
            Calendar: {
              name: 'Calendar',
              template: '<div />',
              emits: ['update:model-value'],
            },
          },
        },
      })
      await flushPromises()

      const datePicker = wrapper.findComponent({ name: 'PDatePicker' })
      expect(datePicker.props('pSchedulesCollection')).toStrictEqual([SAME_MONTH_DATE])

      const calendar = wrapper.findComponent({ name: 'Calendar' })
      calendar.vm.$emit('update:model-value', new Date(OTHER_MONTH_DATE))

      await flushPromises()

      expect(datePicker.props('pSchedulesCollection')).toStrictEqual([OTHER_MONTH_DATE])
    })

    describe('when select-deadline', () => {
      let wrapper: VueWrapper

      beforeEach(async () => {
        wrapper = createWrapper({
          global: {
            stubs: {
              ScheduleDrawer,
              DeadlineList,
              ActionBar: ActionBarStub,
              PDatePicker: true,
              Calendar: true,
            },
          },
        })
        await flushPromises()

        const actionBarWrapper = wrapper.findComponent({ name: 'ActionBar' })
        actionBarWrapper.vm.$emit('update:modelValue', 'list')
        await nextTick()
      })

      it('should display OccurrenceDrawer', async () => {
        const occurrenceDrawerBefore = wrapper.findComponent({ name: 'OccurrenceDrawer' })
        expect(occurrenceDrawerBefore.exists()).toBeFalsy()

        const deadlineList = wrapper.findComponent({ name: 'DeadlineList' })
        deadlineList.vm.$emit('select-deadline', 4)
        await nextTick()

        const occurrenceDrawerAfter = wrapper.findComponent({ name: 'OccurrenceDrawer' })
        expect(occurrenceDrawerAfter.exists()).toBeTruthy()

        occurrenceDrawerAfter.vm.$emit('update:model-value', false)
        await nextTick()
      })

      it('should hide OccurrenceDrawer when it is closed', async () => {
        const getSchedulesCollectionSpy = vi
          .spyOn(ScheduleServices, 'getSchedulesCollection')

        const deadlineList = wrapper.findComponent({ name: 'DeadlineList' })
        deadlineList.vm.$emit('select-deadline', 4)
        await nextTick()

        const occurrenceDrawerBefore = wrapper.findComponent({ name: 'OccurrenceDrawer' })
        expect(occurrenceDrawerBefore.exists()).toBeTruthy()

        occurrenceDrawerBefore.vm.$emit('update:model-value', false)
        await nextTick()

        const occurrenceDrawerAfter = wrapper.findComponent({ name: 'OccurrenceDrawer' })
        expect(occurrenceDrawerAfter.exists()).toBeFalsy()

        vi.advanceTimersByTime(300)
        await nextTick()

        expect(getSchedulesCollectionSpy).toHaveBeenCalledOnce()
      })

      it('should display OccurrenceDrawer when deadline is select in widget list', async () => {
        const occurrenceDrawerBefore = wrapper.findComponent({ name: 'OccurrenceDrawer' })
        expect(occurrenceDrawerBefore.exists()).toBeFalsy()

        wrapper.findComponent(WidgetActiveDay).vm.$emit('select-deadline', OccurenceId)
        await nextTick()

        const occurrenceDrawerAfter = wrapper.findComponent({ name: 'OccurrenceDrawer' })
        expect(occurrenceDrawerAfter.exists()).toBeTruthy()
      })

      it('should display OccurrenceDrawer when deadline is select in calendar view', async () => {
        const occurrenceDrawerBefore = wrapper.findComponent({ name: 'Calendar' })
        expect(occurrenceDrawerBefore.exists()).toBeFalsy()

        wrapper.findComponent(WidgetActiveDay).vm.$emit('select-deadline', OccurenceId)
        await nextTick()

        const occurrenceDrawerAfter = wrapper.findComponent({ name: 'OccurrenceDrawer' })
        expect(occurrenceDrawerAfter.exists()).toBeTruthy()
      })
    })
  })
})
