import { beforeEach, describe, expect, it, vi } from 'vitest'
import { VueWrapper, mount } from '@vue/test-utils'
import { defineStore, setActivePinia } from 'pinia'
import helpers from '../../../tests/utils/helpers'
import Navbar from '.'

const { router, pinia, mockUser } = helpers()

vi.mock('@kpmg/common', () => ({
  commonStore: defineStore('common', {
    state: () => (mockUser)
  }),
  commonPinia: () => pinia
}))

const createWrapper = () => mount(Navbar, {
  global: {
    plugins: [router]
  }
})

describe('navbar', () => {
  beforeEach(() => {
    setActivePinia(pinia)
  })

  it('displays all the favorites entities that are in the store', () => {
    const wrapper: VueWrapper<any> = createWrapper()
    const FAVORITES_ENTITIES = mockUser.user.entities.favorites
    const [firstEntityName, secondEntityName] = FAVORITES_ENTITIES.map(({ name }) => name)

    expect(wrapper.text()).toContain(firstEntityName)
    expect(wrapper.text()).toContain(secondEntityName)
  })

  it('can have an entity activated by default', () => {
    const wrapper: VueWrapper<any> = createWrapper()
    const entityActivated = wrapper.find('.is-active.p-menu-item-entity')

    expect(entityActivated.text()).toContain(mockUser.user.entities.default.name)
  })
})
