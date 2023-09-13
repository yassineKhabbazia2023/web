import { createTestingPinia } from '@pinia/testing'
import { defineStore, createPinia, setActivePinia } from 'pinia'
import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { commonPinia as pinia } from '@kpmg/common'
import useNavbarStore from './navbar-store'

vi.mock('@kpmg/common', () => ({
  commonStore: defineStore('common', {
    state: () => ({ user: {} })
  }),
  commonPinia: () => createPinia()
}))

describe('useNavbarStore', () => {
  setActivePinia(pinia)
  it('must have a defautlt value for defaultEntity', () => {
    const wrapper = mount({
      plugins: [createTestingPinia()],
      template: '<div>{{ defaultEntity?.name }}</div>',
      setup() {
        const { defaultEntity } = useNavbarStore()
        return { defaultEntity: defaultEntity[0] }
      }
    })

    expect(wrapper.text()).toBe('Entity Name')
  })

  it('must successfully update defaultEntity', async () => {
    const newEntity = [
      {
        name: 'New Entity',
        idAccount: 'New AccountNumber',
        icon: 'New PICupHot',
        color: 'blue'
      }
    ]
    localStorage.setItem('defaultEntity', JSON.stringify(newEntity))

    const wrapper = mount({
      plugins: [createTestingPinia()],
      template: '<div>{{ defaultEntity?.name }}</div>',
      setup() {
        const { defaultEntity } = useNavbarStore()
        return { defaultEntity: defaultEntity[0] }
      }
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toBe('New Entity')
  })
})
