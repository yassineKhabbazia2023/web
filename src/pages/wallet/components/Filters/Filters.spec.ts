import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
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
    const optionsText = options.map(option => option.text())
    const expectedOptionsText = [
      `${statistic.entityToDeploy} To Deploy`,
      `${statistic.entityInProgress} In progress`,
      `${statistic.entityConnected} Connected`,
      `${statistic.userDeclared} Declared`,
      `${statistic.userConnected} Connected`,
      `${statistic.userInvited} Guest(s)`
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
    await firstTagWrapper.vm.$emit('close')
    expect(wrapper.emitted('removeFilter')).toBeTruthy()
  })
})
