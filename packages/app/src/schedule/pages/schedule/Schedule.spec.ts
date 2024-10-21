import { describe, it, expect, vi, beforeEach } from 'vitest'
import { KpmgCommontMock } from '@app/schedule/tests/mocks/commonViMock'
import { nextTick } from 'vue'
import { flushPromises, type VueWrapper, shallowMount } from '@vue/test-utils'
import Schedule from '@app/schedule/pages/schedule'
import type { ScheduleProps } from './ScheduleTypes'
import { accountsCollection } from '@app/schedule/tests/mocks/Account'
import * as ScheduleServices from '@app/schedule/services'
import * as ScheduleUtils from './ScheduleUtils'
import { dateISOFormatter } from '@app/schedule/helpers/utils'
import type { DeadlinesByDate } from '@app/schedule/models/Deadline'
import { getMockedDeadlines } from '@app/schedule/tests/mocks/Deadline'
import { createTestingPinia } from '@pinia/testing'
import { commonStore as useCommonStore } from '@pulse/common'
import type { Filters } from '@app/schedule/components/FilterDrawer/FilterDrawerTypes'
import type { ScheduleApiQueryParams } from '@app/schedule/services/scheduleServiceTypes'

const pinia = createTestingPinia()

const TEST_DATE = '2024-08-14'
const SAME_MONTH_DATE = '2024-08-18'
const OTHER_MONTH_DATE = '2024-11-03'
const OccurenceId = 1234567890

vi.mock('@pulse/common', () => KpmgCommontMock)
const commonStore = useCommonStore(pinia)
// @ts-expect-error: Getter is read only
commonStore.isCollab = false

vi.mock('./ScheduleUtils', async () => {
  return await vi.importActual('./ScheduleUtils')
})

vi.mock('@app/schedule/services', () => ({
  getScheduleModels: () => [{
    key: 'TVA',
    label: 'TVA au 21',
  }],
  getScheduleModelsByKey: () => ({
    TVA: 'TVA au 21',
  }),
  getAdvancedSearchParams: vi.fn(),
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
const newSearchTerm = 'search term'

const ActionBarStub = {
  name: 'ActionBar',
  template: '<div />',
  props: [
    'modelValue',
    'activeDate',
    'isCollab',
    'isSearchState',
    'searchTerm',
    'activeFilters',
  ],
  emits: ['create-schedule'],
}
const OccurrenceDrawerStub = {
  name: 'OccurrenceDrawer',
  template: '<div />',
}

function createWrapper(override: Partial<ScheduleProps> = {}) {
  const defaultProps: ScheduleProps = {}
  const props = {
    ...defaultProps,
    ...override,
  }

  return shallowMount(Schedule, {
    props,
    global: {
      stubs: {
        DeadlineList: {
          name: 'DeadlineList',
          template: '<div />',
          props: ['modelValue', 'deadlinesByDate', 'activeDate'],
        },
        OccurrenceDrawer: OccurrenceDrawerStub,
        ScheduleDrawer: {
          name: 'ScheduleDrawer',
          template: '<div />',
          emits: ['update:model-value'],
        },
        ActionBar: ActionBarStub,
        Calendar: {
          name: 'Calendar',
          template: '<div />',
          props: ['modelValue', 'deadlinesByDate', 'pRange'],
          emits: ['update:model-value'],
        },
        PDatePicker: {
          name: 'PDatePicker',
          template: '<div />',
          props: ['pSchedulesCollection'],
          emits: ['panel-change'],
        },
      },
    },
  })
}

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

describe('home page', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(mockedToday)
  })

  it('should render home page', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBeTruthy()
  })

  it('should call getSchedulesCollection only once onMounted', async () => {
    const getSchedulesCollectionSpy = vi
      .spyOn(ScheduleServices, 'getSchedulesCollection')

    createWrapper()
    await flushPromises()

    const expectedMonthRange = ScheduleUtils.getMonthInterval(mockedToday, 7)
    const expectedParams = {
      ...expectedMonthRange,
      targets: [],
      templates: [],
      status: [],
      mineOnly: false,
    }

    expect(getSchedulesCollectionSpy).toHaveBeenCalledOnce()
    expect(getSchedulesCollectionSpy).toHaveBeenNthCalledWith(1, expectedParams)
  })

  function findCalendarWidgetLoader(wrapper: VueWrapper) {
    return wrapper.find('[data-test-id="schedule-calendar-widget-loader"]')
  }

  describe('interactions', () => {
    it('should display the drawer on displayDeadlineDrawer event', async () => {
      const getSchedulesCollectionSpy = vi
        .spyOn(ScheduleServices, 'getSchedulesCollection')

      const wrapper = createWrapper()

      expect(wrapper.findComponent({ name: 'ScheduleDrawer' }).exists()).toBeFalsy()
      await wrapper.findComponent({ name: 'ActionBar' }).vm.$emit('create-schedule')
      const scheduleDrawer = wrapper.findComponent({ name: 'ScheduleDrawer' })
      expect(scheduleDrawer.exists()).toBeTruthy()

      scheduleDrawer.vm.$emit('update:model-value', false)

      vi.advanceTimersByTime(300)
      await nextTick()

      expect(getSchedulesCollectionSpy).toHaveBeenCalledTimes(2)
    })

    it('should give filtered deadlines of current month to DeadlineList', async () => {
      vi
        .spyOn(ScheduleServices, 'getSchedulesCollection')
        .mockResolvedValueOnce([
          ...currentMounthDeadlines,
          ...nextMounthDeadlines,
        ])

      const expectedDeadlinesByDate = [...currentMounthDeadlines]

      const wrapper = createWrapper()

      await flushPromises()
      const actionBarWrapper = wrapper.findComponent({ name: 'ActionBar' })

      await actionBarWrapper.vm.$emit('update:modelValue', 'list')
      const deadlinesListWrapper = wrapper.findComponent({ name: 'DeadlineList' })
      await nextTick()

      expect(deadlinesListWrapper.props('deadlinesByDate')).toStrictEqual(expectedDeadlinesByDate)
    })

    it('should update the visible section on activeScheduleViewType change', async () => {
      const wrapper = createWrapper()

      await flushPromises()
      const actionBarWrapper = wrapper.findComponent({ name: 'ActionBar' })
      const deadlinesListWrapper = wrapper.findComponent({ name: 'DeadlineList' })
      const calendarWrapper = wrapper.findComponent({ name: 'Calendar' })

      expect(calendarWrapper.exists()).toBeTruthy()
      expect(deadlinesListWrapper.exists()).toBeFalsy()

      await actionBarWrapper.vm.$emit('update:modelValue', 'list')

      expect(wrapper.findComponent({ name: 'DeadlineList' }).exists()).toBeTruthy()
      expect(calendarWrapper.exists()).toBeFalsy()
    })

    describe('when activeDate is changed in calendar', () => {
      let wrapper: VueWrapper
      let calendarWrapper: VueWrapper

      beforeEach(async () => {
        wrapper = createWrapper({
          defaultActiveDateString: TEST_DATE,
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

    it('should fired update:active-date', async () => {
      const wrapper = createWrapper()
      const newDate = new Date(OTHER_MONTH_DATE)
      wrapper.findComponent({ name: 'ActionBar' }).vm.$emit('update:active-date', newDate)
      await nextTick()
      const actionBar = wrapper.findComponent({ name: 'ActionBar' })
      expect(actionBar.emitted('update:active-date')).toStrictEqual([[newDate]])
    })

    it('should change activeDate when DeadlineList emits change-date', async () => {
      const wrapper = createWrapper()
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
      const wrapper = createWrapper()
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
      const getSchedulesCollectionSpy = vi
        .spyOn(ScheduleServices, 'getSchedulesCollection')
        .mockResolvedValueOnce([{
          date: SAME_MONTH_DATE,
          deadlines: [],
        }])
        .mockResolvedValueOnce([{
          date: OTHER_MONTH_DATE,
          deadlines: [],
        }])
      const wrapper = createWrapper()
      await flushPromises()

      const datePicker = wrapper.findComponent({ name: 'PDatePicker' })
      expect(datePicker.props('pSchedulesCollection')).toStrictEqual([SAME_MONTH_DATE])

      const calendarWidgetLoaderBefore = findCalendarWidgetLoader(wrapper)
      expect(calendarWidgetLoaderBefore.exists()).toBeFalsy()

      datePicker.vm.$emit('panel-change', new Date(OTHER_MONTH_DATE))

      await nextTick()

      const calendarWidgetLoader = findCalendarWidgetLoader(wrapper)
      expect(calendarWidgetLoader.exists()).toBeTruthy()

      await flushPromises()
      const expectedParams1: ScheduleApiQueryParams = {
        endDate: '2024-09-07',
        mineOnly: false,
        startDate: '2024-07-25',
        status: [],
        targets: [],
        templates: [],
      }
      const expectedParams2: ScheduleApiQueryParams = {
        endDate: '2024-12-07',
        mineOnly: false,
        startDate: '2024-10-25',
        status: [],
        targets: [],
        templates: [],
      }

      const calendarWidgetLoaderAfter = findCalendarWidgetLoader(wrapper)
      expect(calendarWidgetLoaderAfter.exists()).toBeFalsy()
      expect(getSchedulesCollectionSpy).toHaveBeenCalledTimes(2)
      expect(getSchedulesCollectionSpy).toHaveBeenNthCalledWith(1, expectedParams1)
      expect(getSchedulesCollectionSpy).toHaveBeenNthCalledWith(2, expectedParams2)

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
      const wrapper = createWrapper()
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
        wrapper = createWrapper()
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

        wrapper.findComponent({ name: 'WidgetActiveDay' }).vm.$emit('select-deadline', OccurenceId)
        await nextTick()

        const occurrenceDrawerAfter = wrapper.findComponent({ name: 'OccurrenceDrawer' })
        expect(occurrenceDrawerAfter.exists()).toBeTruthy()
      })

      it('should display OccurrenceDrawer when deadline is select in calendar view', async () => {
        const occurrenceDrawerBefore = wrapper.findComponent({ name: 'Calendar' })
        expect(occurrenceDrawerBefore.exists()).toBeFalsy()

        wrapper.findComponent({ name: 'WidgetActiveDay' }).vm.$emit('select-deadline', OccurenceId)
        await nextTick()

        const occurrenceDrawerAfter = wrapper.findComponent({ name: 'OccurrenceDrawer' })
        expect(occurrenceDrawerAfter.exists()).toBeTruthy()
      })
    })

    it('should set searchTerm when ActionBar emits update:search-term', async () => {
      const wrapper = createWrapper()

      const actionBar = wrapper.findComponent({ name: 'ActionBar' })
      expect(actionBar.props('searchTerm')).toBe('')
      await actionBar.vm.$emit('update:search-term', newSearchTerm)
      await nextTick()
      expect(actionBar.props('searchTerm')).toBe(newSearchTerm)
    })

    describe('when enter in search state', () => {
      it('should trigger advanced search if search term is NOT empty', async () => {
        const filters: Filters = {
          targets: [],
          templates: [],
          status: [],
          mineOnly: false,
        }
        const mockedSearchParams = {
          startDate: '2023-08-14',
          endDate: '2025-08-14',
          searchTerm: newSearchTerm,
          ...filters,
        }
        const getAdvancedSearchParamsSpy = vi
          .spyOn(ScheduleUtils, 'getAdvancedSearchParams')
          .mockReturnValue(mockedSearchParams)
        const getSchedulesCollectionSpy = vi
          .spyOn(ScheduleServices, 'getSchedulesCollection')
          .mockResolvedValue(currentMounthDeadlines)
          .mockResolvedValueOnce([
            ...currentMounthDeadlines,
            ...nextMounthDeadlines,
          ])
        const wrapper = createWrapper()
        const today = new Date(TEST_DATE)

        const actionBar = wrapper.findComponent({ name: 'ActionBar' })
        await actionBar.vm.$emit('update:search-term', newSearchTerm)
        await nextTick()
        await actionBar.vm.$emit('update:is-search-state', true)
        await flushPromises()
        expect(getAdvancedSearchParamsSpy).toHaveBeenCalledOnce()
        expect(getAdvancedSearchParamsSpy).toHaveBeenNthCalledWith(1, today, newSearchTerm, filters)
        expect(getSchedulesCollectionSpy).toHaveBeenCalledTimes(2)
        expect(getSchedulesCollectionSpy).toHaveBeenNthCalledWith(2, mockedSearchParams)
      })

      it('should trigger advanced search if search term is empty', async () => {
        const getAdvancedSearchParamsSpy = vi
          .spyOn(ScheduleUtils, 'getAdvancedSearchParams')
        const getSchedulesCollectionSpy = vi
          .spyOn(ScheduleServices, 'getSchedulesCollection')
        const wrapper = createWrapper()

        const actionBar = wrapper.findComponent({ name: 'ActionBar' })
        await actionBar.vm.$emit('update:is-search-state', true)
        await flushPromises()
        expect(getAdvancedSearchParamsSpy).not.toHaveBeenCalled()
        expect(getSchedulesCollectionSpy).toHaveBeenCalledOnce()
      })

      it('should toggle vue list / vue calendar', async () => {
        const wrapper = createWrapper()
        const expectedActionBarPropsBefore = {
          activeDate: mockedToday,
          activeFilters: 0,
          isCollab: false,
          isSearchState: true,
          modelValue: 'list',
          searchTerm: newSearchTerm,
        }
        const expectedActionBarPropsAfter = {
          ...expectedActionBarPropsBefore,
          isSearchState: false,
          modelValue: 'calendar',
          searchTerm: '',
        }

        const actionBar = wrapper.findComponent({ name: 'ActionBar' })
        await actionBar.vm.$emit('update:search-term', newSearchTerm)
        await nextTick()
        await actionBar.vm.$emit('update:is-search-state', true)
        await flushPromises()
        expect(actionBar.props()).toStrictEqual(expectedActionBarPropsBefore)

        await actionBar.vm.$emit('update:is-search-state', false)
        await flushPromises()
        expect(actionBar.props()).toStrictEqual(expectedActionBarPropsAfter)
      })

      it('should not call getAdvancedSearchParams if search term IS EMPTY', async () => {
        const getAdvancedSearchParamsSpy = vi
          .spyOn(ScheduleUtils, 'getAdvancedSearchParams')
        const getSchedulesCollectionSpy = vi
          .spyOn(ScheduleServices, 'getSchedulesCollection')
          .mockResolvedValue(currentMounthDeadlines)
          .mockResolvedValueOnce([
            ...currentMounthDeadlines,
            ...nextMounthDeadlines,
          ])
        const wrapper = createWrapper()

        const actionBar = wrapper.findComponent({ name: 'ActionBar' })
        await actionBar.vm.$emit('update:search-term', '')
        await nextTick()
        await actionBar.vm.$emit('update:model-value', 'list')
        await flushPromises()
        expect(getAdvancedSearchParamsSpy).not.toHaveBeenCalled()
        expect(getSchedulesCollectionSpy).toHaveBeenCalledOnce()
      })

      it('should open FilterDrawer when ActionBar emits open-drawer-filters event', async () => {
        const wrapper = createWrapper()

        const actionBar = wrapper.findComponent({ name: 'ActionBar' })
        const filterDrawerBefore = wrapper.findComponent({ name: 'FilterDrawer' })
        expect(filterDrawerBefore.exists()).toBeFalsy()

        actionBar.vm.$emit('open-drawer-filters')
        await nextTick()

        const filterDrawerAfter = wrapper.findComponent({ name: 'FilterDrawer' })
        expect(filterDrawerAfter.exists()).toBeTruthy()
      })
    })

    it('should apply filters when drawer emits apply', async () => {
      const getSchedulesCollectionSpy = vi
        .spyOn(ScheduleServices, 'getSchedulesCollection')

      const wrapper = createWrapper()

      const actionBar = wrapper.findComponent({ name: 'ActionBar' })
      const filters: Filters = {
        targets: [],
        templates: ['TVA'],
        status: [],
        mineOnly: true,
      }

      actionBar.vm.$emit('open-drawer-filters')
      await nextTick()

      const filterDrawerAfter = wrapper.findComponent({ name: 'FilterDrawer' })
      filterDrawerAfter.vm.$emit('apply', filters)

      const expectedMonthRange = ScheduleUtils.getMonthInterval(mockedToday, 7)
      const expectedParams = {
        ...expectedMonthRange,
        ...filters,
      }

      expect(getSchedulesCollectionSpy).toHaveBeenCalledTimes(2)
      expect(getSchedulesCollectionSpy).toHaveBeenNthCalledWith(2, expectedParams)
    })

    it('should apply filters when drawer emits apply in advancedSearch state', async () => {
      const getSchedulesCollectionSpy = vi
        .spyOn(ScheduleServices, 'getSchedulesCollection')

      const wrapper = createWrapper()
      const newSearchTerm = 'new search term'

      const actionBar = wrapper.findComponent({ name: 'ActionBar' })
      const filters: Filters = {
        targets: [],
        templates: ['TVA'],
        status: [],
        mineOnly: true,
      }

      actionBar.vm.$emit('update:search-term', newSearchTerm)
      actionBar.vm.$emit('update:is-search-state', true)
      actionBar.vm.$emit('open-drawer-filters')
      await nextTick()

      const filterDrawerAfter = wrapper.findComponent({ name: 'FilterDrawer' })
      filterDrawerAfter.vm.$emit('apply', filters)
      await nextTick()

      const expectedParams = {
        startDate: '2023-08-14',
        endDate: '2025-08-14',
        searchTerm: newSearchTerm,
        ...filters,
      }

      expect(getSchedulesCollectionSpy).toHaveBeenCalledTimes(3)
      expect(getSchedulesCollectionSpy).toHaveBeenNthCalledWith(3, expectedParams)
      expect(actionBar.props('activeFilters')).toBe(2)
    })
  })
})
