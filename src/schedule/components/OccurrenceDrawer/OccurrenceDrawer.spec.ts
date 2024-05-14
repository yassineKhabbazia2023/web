import { nextTick } from 'vue'
import wrapperFactory from '@/schedule/tests/utils/wrapperFactory'
import OccurrenceDrawer from '.'
import { expect, describe, it, vi } from 'vitest'
import { accountsCollection } from '@/schedule/tests/mocks/Account'
import type { OccurrenceDrawerProps } from './OccurrenceDrawerTypes'
import { frequenciesMock } from '@/schedule/tests/mocks/Schedule'
import { flushPromises } from '@vue/test-utils'
import { getMockedOccurrence } from '@/schedule/tests/mocks/Occurrence'

const mockedOccurrence = getMockedOccurrence()

const createWrapper = (override: Partial<OccurrenceDrawerProps> = {}) => {
  const defaultProps: OccurrenceDrawerProps = {
    modelValue: true,
    occurrenceId: 442,
  }
  const props = {
    ...defaultProps,
    ...override,
  }

  return wrapperFactory(OccurrenceDrawer, {
    props,
  })
}

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
  }
})

describe('drawer.vue', () => {
  it('should display loader until data are loaded', async () => {
    const wrapper = createWrapper({ modelValue: true })
    await nextTick()
    const pLoader = wrapper.findComponent({ name: 'PLoader' })
    expect(pLoader.exists()).toBeTruthy()
  })

  it('give proper attributes to PDrawer when data are loaded', async () => {
    const expectedTitle = mockedOccurrence.template.typeLong
    const wrapper = createWrapper({ modelValue: true })
    await flushPromises()

    const pLoader = wrapper.findComponent({ name: 'PLoader' })
    const pDrawer = wrapper.findComponent({ name: 'PDrawer' })

    expect(pLoader.exists()).toBeFalsy()
    expect(pDrawer.props('pTitle')).toBe(expectedTitle)
  })
})

