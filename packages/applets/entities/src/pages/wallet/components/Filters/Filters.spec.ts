import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { getMockedEntitiesStatistics } from './FiltersMocks'
import { EntityStatus } from './FiltersTypes'
import { nextTick } from 'vue'
import Filters from '.'

const pinia = createPinia()
const statistics = getMockedEntitiesStatistics()

vi.mock('@pulse/Common', () => ({
  commonApi: () => ({
    gateway: {
      get: () => Promise.resolve({
        data: statistics,
      }),
    },
  }),
}))

describe('filter', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    wrapper = mount(Filters)
    setActivePinia(pinia)
  })

  it('renders filter correctly', async () => {
    await flushPromises()

    const options = wrapper.findAll('.filter-option')
    expect(options).toHaveLength(Object.keys(statistics).length)
    const optionsText = options.map(option => option.text())
    const expectedOptionsText = [
      `${statistics.accountToDeploy} To Deploy`,
      `${statistics.accountInProgress} In progress`,
      `${statistics.accountConnected} Connected`,
      `${statistics.contactDeclared} Declared`,
      `${statistics.contactConnected} Connected`,
      `${statistics.contactInvited} Guest(s)`,
    ]
    expect(optionsText).toStrictEqual(expectedOptionsText)
  })

  it('should emit event filterByStatus when click on the entityStatus button', async () => {
    await flushPromises()
    const options = wrapper.findAll('.filter-option')
    await options[0].trigger('click')
    expect(wrapper.emitted('filterByStatus')).toBeTruthy()
    expect(wrapper.emitted('filterByStatus')?.at(0)?.at(0)).toBe(EntityStatus.TO_DEPLOY)
  })

  it('should emit event removeFilter when the close event is triggered', async () => {
    await flushPromises()
    const filterOption = wrapper.findAllComponents('[data-testid=filter-option]')
    const firstTagWrapper = filterOption[0] as VueWrapper
    firstTagWrapper.vm.$emit('close')
    await nextTick()
    expect(wrapper.emitted('removeFilter')).toBeTruthy()
  })
})
