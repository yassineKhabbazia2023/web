import { shallowMount } from '@vue/test-utils'
import dayjs from 'dayjs'
import ActionBarLeft from '.'
import { expect, describe, it, vi } from 'vitest'
import type { ActionBarLeftProps } from './ActionBarLeftTypes'

const TEST_DATE = '2024-04-10'

function createWrapper(override: Partial<ActionBarLeftProps> = {}) {
  const defaultProps: ActionBarLeftProps = {
    activeDate: new Date(TEST_DATE),
    searchTerm: '',
    isSearchState: false,
  }
  const props = {
    ...defaultProps,
    ...override,
  }

  return shallowMount(ActionBarLeft, {
    props,
  })
}

describe('month.vue', () => {
  it('should emit an event containing next-month in payload', async () => {
    const NEW_DATE = '2024-05-01'
    const wrapper = createWrapper()
    await wrapper.find('[data-testid=schedule-next-month-button]').trigger('click')

    const newActiveDate = wrapper.emitted('update:active-date')?.at(0)?.at(0) as Date
    expect(dayjs(newActiveDate).format('YYYY-MM-DD')).toBe(NEW_DATE)
  })

  it('should emit an event containing prev-month in payload', async () => {
    const NEW_DATE = '2024-03-01'
    const wrapper = createWrapper()
    await wrapper.find('[data-testid=schedule-prev-month-button]').trigger('click')

    const newActiveDate = wrapper.emitted('update:active-date')?.at(0)?.at(0) as Date
    expect(dayjs(newActiveDate).format('YYYY-MM-DD')).toBe(NEW_DATE)
  })

  it('should emit update:active-date with today date', async () => {
    const mockedToday = new Date('2024-05-21T13:00:00.000Z')
    vi.useFakeTimers()
    vi.setSystemTime(mockedToday)

    const wrapper = createWrapper()
    const todayButton = wrapper.find('[data-testid="action-bar-left-today"]')
    await todayButton.trigger('click')
    expect(wrapper.emitted('update:active-date')).toStrictEqual([[mockedToday]])
  })

  it('should emit update:search-term when PExpandableSearch changes', () => {
    const searchTermAfter = 'my search'
    const wrapper = createWrapper()

    const pExpandableSearch = wrapper.findComponent({ name: 'PExpandableSearch' })

    pExpandableSearch.vm.$emit('update:p-search-content', searchTermAfter)
    expect(wrapper.emitted('update:search-term')).toStrictEqual([[searchTermAfter]])
  })

  it('should emit update:is-search-state when PExpandableSearch emits enter', () => {
    const wrapper = createWrapper()

    const pExpandableSearch = wrapper.findComponent({ name: 'PExpandableSearch' })

    pExpandableSearch.vm.$emit('enter')

    expect(wrapper.emitted('update:is-search-state')).toStrictEqual([[true]])
  })

  it('should display properly when isSearchState is true', () => {
    const isSearchState = true
    const wrapper = createWrapper({
      isSearchState,
    })

    const pExpandableSearch = wrapper.findComponent({ name: 'PExpandableSearch' })
    const prevMountButton = wrapper.find('[data-testid=schedule-prev-month-button]')

    expect(pExpandableSearch.props('pIsSearchShrinkable')).toBeFalsy()
    expect(prevMountButton.exists()).toBeFalsy()
  })

  it('should display properly when isSearchState is false', () => {
    const isSearchState = false
    const wrapper = createWrapper({
      isSearchState,
    })

    const pExpandableSearch = wrapper.findComponent({ name: 'PExpandableSearch' })
    const endSearchStateButton = wrapper.find('[data-testid="action-bar-left-end-search-state-button"]')
    const prevMountButton = wrapper.find('[data-testid=schedule-prev-month-button]')

    expect(pExpandableSearch.props('pIsSearchShrinkable')).toBeTruthy()
    expect(endSearchStateButton.exists()).toBeFalsy()
    expect(prevMountButton.exists()).toBeTruthy()
  })

  it('should emit update:is-search-state when clicks on action-bar-left-end-search-state-button', () => {
    const wrapper = createWrapper({
      isSearchState: true,
    })

    const endSearchStateButton = wrapper.find('[data-testid="action-bar-left-end-search-state-button"]')

    endSearchStateButton.trigger('click')

    expect(wrapper.emitted('update:is-search-state')).toStrictEqual([[false]])
  })
})

