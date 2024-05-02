import { nextTick } from 'vue'
import { KpmgCommontMock } from '@/schedule/tests/mocks/commonViMock'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, type ComponentMountingOptions, type VueWrapper } from '@vue/test-utils'
import wrapperFactory from '@/schedule/tests/utils/wrapperFactory'
import Schedule from '@/schedule/pages/schedule'
import ScheduleDrawer from '@/schedule/components/CreateSchedule/ScheduleDrawer'
import DeadlineList from '@/schedule/components/DisplayDeadline/DeadlineList'
import ActionBar from '@/schedule/components/ActionBar'
import { accountsCollection } from '@/schedule/tests/mocks/Account'
import * as ScheduleServices from '@/schedule/services'
import { dateISOFormatter } from '@/schedule/helpers/utils'

const createWrapper = (options: ComponentMountingOptions<any>) =>
  wrapperFactory(Schedule, options)

const TEST_DATE = '2024-08-14'
const SAME_MONTH_DATE = '2024-08-18'
const OTHER_MONTH_DATE = '2024-11-03'

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
    deadlines: [
      {
        template: {
          typeShortCollaborator: 'TVA au 21',
          typeShortCustomer: 'TVA',
          typeLong: 'Taxe sur la valeur ajoutée',
        },
        globalStatus: 'Done',
        accountList: [{
          id: '66842913356',
          name: 'Aperture science',
          status: 'Todo',
        }],
      },
    ],
  }]),
  getAccountsCollection: () => Promise.resolve({
    status: 'fulfilled',
    value: accountsCollection,
  }),
}),
)

describe('home page', () => {
  it('should render home page', () => {
    const wrapper = createWrapper({
      global: {
        stubs: {
          ScheduleDrawer,
          DeadlineList,
        },
      },
    })
    expect(wrapper.exists()).toBeTruthy()
  })
  it('should display the drawer', async () => {
    const wrapper = createWrapper({
      global: {
        stubs: {
          ScheduleDrawer,
          DeadlineList,
        },
      },
    })
    expect(wrapper.findComponent(ScheduleDrawer).exists()).toBeFalsy()
    wrapper.vm.updateDrawerDisplay()
    await nextTick()
    expect(wrapper.findComponent(ScheduleDrawer).exists()).toBeTruthy()
  })

  describe('interactions', () => {
    it('should display the drawer on displayDeadlineDrawer event', async () => {
      const wrapper = createWrapper({
        global: {
          stubs: {
            ScheduleDrawer,
            DeadlineList,
            ActionBar,
          },
        },
      })

      expect(wrapper.findComponent(ScheduleDrawer).exists()).toBeFalsy()
      await wrapper.findComponent(ActionBar).vm.$emit('display-deadline-drawer')
      expect(wrapper.findComponent(ScheduleDrawer).exists()).toBeTruthy()
    })

    it('should update the visible section on activeScheduleViewType change', async () => {
      const wrapper = createWrapper({
        global: {
          stubs: {
            ScheduleDrawer,
            DeadlineList,
            ActionBar,
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
              ActionBar,
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
            ActionBar,
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
            ActionBar,
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

    it('should load other month data when change month', async () => {
      vi.useFakeTimers()
      vi
        .spyOn(ScheduleServices, 'getSchedulesCollection')
        .mockResolvedValueOnce([{
          date: TEST_DATE,
          deadlines: [],
        }])
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
            ActionBar,
            PDatePicker: {
              name: 'PDatePicker',
              template: '<div />',
              props: ['pSchedulesCollection'],
              emits: ['panel-change'],
            },
          },
        },
      })
      await flushPromises()

      const datePickerBefore = wrapper.findComponent({ name: 'PDatePicker' })
      expect(datePickerBefore.props('pSchedulesCollection')).toStrictEqual([SAME_MONTH_DATE])

      datePickerBefore.vm.$emit('panel-change', new Date(OTHER_MONTH_DATE))

      await nextTick()
      vi.advanceTimersByTime(300)
      await nextTick()
      await flushPromises()

      const datePickerAfter = wrapper.findComponent({ name: 'PDatePicker' })

      expect(datePickerAfter.props('pSchedulesCollection')).toStrictEqual([OTHER_MONTH_DATE])
    })
  })
})
