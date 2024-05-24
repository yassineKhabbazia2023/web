import { nextTick } from 'vue'
import wrapperFactory from '@/schedule/tests/utils/wrapperFactory'
import OccurrenceDrawer from '.'
import { expect, describe, it, vi } from 'vitest'
import { accountsCollection } from '@/schedule/tests/mocks/Account'
import type { OccurrenceDrawerProps } from './OccurrenceDrawerTypes'
import { frequenciesMock } from '@/schedule/tests/mocks/Schedule'
import { flushPromises } from '@vue/test-utils'
import { getMockedOccurrence, getMockedScheduleOccurrence } from '@/schedule/tests/mocks/Occurrence'
import { mockedGetScheduleModelsByKey } from '@/schedule/tests/mocks/commonViMock'
import * as scheduleServices from '@/schedule/services'

const mockedOccurrence = getMockedOccurrence({
  schedule: getMockedScheduleOccurrence({
    frequency: 'Monthly',
    description: 'Description',
  }),
})

vi.mock('@/schedule/services', () => {
  return {
    postSchedule: vi.fn(),
    getAccountsCollection: vi.fn(() => Promise.resolve(accountsCollection)),
    getScheduleModels: () => [{
      key: 'TVA',
      label: 'TVA au 21',
    }],
    getFrequenciesCollection: vi.fn(() => Promise.resolve(frequenciesMock)),
    getOccurrence: vi.fn(() => Promise.resolve(mockedOccurrence)),
    getScheduleModelsByKey: (_: string) => mockedGetScheduleModelsByKey(_),
    postDeadlineAccountStatus: vi.fn(),
  }
})

vi.mock('./OccurrenceDrawerHelper', async () => {
  const actual = await vi.importActual('./OccurrenceDrawerHelper')

  return {
    ...actual as Object,
    getFrequencyLabel: vi.fn(() => 'Frequency label'),
    getCreatedByLabel: vi.fn(() => 'createdby label'),
    getShortLabel: vi.fn(() => 'short label'),
    getLongLabel: vi.fn(() => 'long label'),
  }
})

const occurrenceId = 442

const createWrapper = (override: Partial<OccurrenceDrawerProps> = {}) => {
  const defaultProps: OccurrenceDrawerProps = {
    modelValue: true,
    occurrenceId,
    isCollab: true,
  }
  const props = {
    ...defaultProps,
    ...override,
  }

  return wrapperFactory(OccurrenceDrawer, {
    props,
  })
}

describe('drawer.vue', () => {
  it('should display loader until data are loaded', async () => {
    const wrapper = createWrapper({ modelValue: true })
    await nextTick()
    const pLoader = wrapper.findComponent({ name: 'PLoader' })
    expect(pLoader.exists()).toBeTruthy()
  })

  it('give proper attributes to PDrawer when data are loaded', async () => {
    const expectedTitle = 'short label'
    const wrapper = createWrapper({ modelValue: true })
    await flushPromises()
    await nextTick()

    const pLoader = wrapper.findComponent({ name: 'PLoader' })
    const pDrawer = wrapper.findComponent({ name: 'PDrawer' })

    expect(pLoader.exists()).toBeFalsy()
    expect(pDrawer.props('pTitle')).toBe(expectedTitle)
  })

  it('should emit update:model-value false when drawer is closed', async () => {
    const wrapper = createWrapper({ modelValue: true })
    await flushPromises()

    const pDrawer = wrapper.findComponent({ name: 'pDrawer' })
    pDrawer.vm.$emit('close-drawer-button')
    expect(wrapper.emitted('update:model-value')).toStrictEqual([[false]])
  })

  it('should display properly', async () => {
    const wrapper = createWrapper({ modelValue: true })
    await flushPromises()

    const fields = wrapper.findAll('[data-testid*="occurrence-drawer-"]')
    const display = fields.reduce((texts, field) => {
      const dataTextId = field.attributes('data-testid') ?? ''
      texts[dataTextId] = field.text()

      return texts
    }, {} as Record<string, string>)

    const expectedDisplay: Record<string, string> = {
      'occurrence-drawer-long-label': 'long label',
      'occurrence-drawer-frequency-label': 'Frequency label',
      'occurrence-drawer-delete': 'Delete',
      'occurrence-drawer-description': 'Description',
      'occurrence-drawer-created-by': 'Created bycreatedby label',
      'occurrence-drawer-occurrence-date': 'Wednesday, May 1, 2024',
    }

    expect(display).toStrictEqual(expectedDisplay)
  })

  it('should call postDeadlineAccountStatus when DeadlineAccount emits toggle-status', async () => {
    const postDeadlineAccountStatusSpy = vi.spyOn(scheduleServices, 'postDeadlineAccountStatus')
    const accountId = 12
    const status = 'Todo'
    const expectedStatus = 'Done'

    const wrapper = createWrapper({ modelValue: true })
    await flushPromises()

    const firstDeadlineAccount = wrapper.findComponent({ name: 'DeadlineAccounts' })
    firstDeadlineAccount.vm.$emit('toggle-status', accountId, status)
    await nextTick()

    expect(postDeadlineAccountStatusSpy).toHaveBeenCalledOnce()
    expect(postDeadlineAccountStatusSpy).toHaveBeenNthCalledWith(1, occurrenceId, accountId, expectedStatus)
  })
  it('should show alert note when not checked', async () => {
    const wrapper = createWrapper({ isCollab: false })
    await flushPromises()
    expect(wrapper.findComponent({ name: 'PAlert' }).exists()).toBeTruthy()
  })
  it('should hide alert note when clicked', async () => {
    const wrapper = createWrapper({ isCollab: false })
    await flushPromises()
    await wrapper.findComponent({ name: 'PAlert' }).vm.$emit('close')
    expect(wrapper.findComponent({ name: 'PAlert' }).exists()).toBeFalsy()
  })
  it('should display delete button only to Collab', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    expect(wrapper.find('[data-testid=occurrence-drawer-delete]').exists()).toBeTruthy()
    await wrapper.setProps({ isCollab: false })
    expect(wrapper.find('[data-testid=occurrence-drawer-delete]').exists()).toBeFalsy()
  })
})

