import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import Tags from './'

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

describe('tags', () => {
  beforeEach(() => {
    setActivePinia(pinia)
  })

  it('renders tags correctly', async () => {
    const wrapper = mount(Tags)
    await flushPromises()

    const tags = wrapper.findAll('.wrapper')
    expect(tags).toHaveLength(Object.keys(statistic).length)
    expect(tags[0].text()).toBe(statistic.entityToDeploy + ' To Deploy')
    expect(tags[1].text()).toBe(statistic.entityInProgress + ' In progress')
    expect(tags[2].text()).toBe(statistic.entityConnected + ' Connected')
    expect(tags[3].text()).toBe(statistic.userDeclared + ' Declared')
    expect(tags[4].text()).toBe(statistic.userConnected + ' Connected')
    expect(tags[5].text()).toBe(statistic.userInvited + ' Guest(s)')
  })
})
