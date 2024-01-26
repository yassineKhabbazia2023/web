import { flushPromises, mount, VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import Filters from '.'
import { EntityStatus } from './types'

const statistic = {
  entityToDeploy: 20,
  entityConnected: 100,
  entityInProgress: 30,
  userDeclared: 10,
  userConnected: 70,
  userInvited: 25
}
vi.mock('@kpmg/common', () => ({
  commonApi: () => ({
    wallet: {
      get: () => Promise.resolve({
        data: statistic
      })
    }
  })
}))

const pinia = createPinia()

describe('filter', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    wrapper = mount(Filters)
    setActivePinia(pinia)
  })

  it('renders filter correctly', async () => {
    await flushPromises()

    const options = wrapper.findAll('.filter-option')
    expect(options).toHaveLength(Object.keys(statistic).length)
    expect(options[0].text()).toBe(statistic.entityToDeploy + ' To Deploy')
    expect(options[1].text()).toBe(statistic.entityInProgress + ' In progress')
    expect(options[2].text()).toBe(statistic.entityConnected + ' Connected')
    expect(options[3].text()).toBe(statistic.userDeclared + ' Declared')
    expect(options[4].text()).toBe(statistic.userConnected + ' Connected')
    expect(options[5].text()).toBe(statistic.userInvited + ' Guest(s)')
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
    await firstTagWrapper.vm.$emit('close')
    expect(wrapper.emitted('removeFilter')).toBeTruthy()
  })

})
