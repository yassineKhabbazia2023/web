import { describe, it, expect, vi, beforeEach } from 'vitest'
import { VueWrapper, flushPromises, mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { defineStore, createPinia, setActivePinia } from 'pinia'
import { commonPinia as pinia, type Entity, commonStore } from '@kpmg/common'
import { getMockedFavoriteEntities } from './MockedFavoriteEntities'
import SidebarEntity from '.'

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn()
  }),
  useRoute: () => ({
    fullPath: '/portefeuille'
  })
}))

const entities: Entity[] = getMockedFavoriteEntities()

vi.mock('@kpmg/common', () => ({
  commonPinia: () => createPinia(),
  commonStore: defineStore('common', {
    getters: {
      isAuthenticated: () => true,
      isCollab: () => true,
      favoriteEntities: () => entities,
      defaultEntity: () => entities[0]
    }
  })
}))

const createWrapper = () => {
  const wrapper = mount(SidebarEntity, {
    props: {
      favoriteEntities: entities,
      totalEntities: entities.length
    },
    plugins: [createTestingPinia()]
  })

  return wrapper
}

const findSidebarToggle = (wrapper: VueWrapper) =>
  wrapper.find('[data-testid=sidebar-toggle]')
const findSelectedEntity = (wrapper: VueWrapper) =>
  wrapper.find('[data-testid=selected-entity]')

describe('sidebarEntity', () => {
  let wrapper: VueWrapper<any>
  setActivePinia(pinia)
  beforeEach(() => {
    wrapper = createWrapper()
  })
  describe('display', () => {
    it('should display the sidebar correctly with actions and entities', () => {
      const sidebarToggle = findSidebarToggle(wrapper)
      const walletItem = wrapper.find('[data-testid=wallet-item]')
      const selectedEntity = findSelectedEntity(wrapper)
      const starDivider = wrapper.find('[data-testid=star-divider]')
      const favoriteEntities = wrapper.find(
        '[data-testid=favorite-entities]'
      )

      expect(sidebarToggle.exists()).toBeTruthy()
      expect(walletItem.exists()).toBeTruthy()
      expect(selectedEntity.exists()).toBeFalsy()
      expect(starDivider.exists()).toBeTruthy()
      expect(favoriteEntities.exists()).toBeTruthy()
    })
    it('should display the sidebar with the appropriate background color', async () => {
      const store = commonStore()
      const sidenavEntity = wrapper.find('[data-testid=sidenav-entity]')

      expect(sidenavEntity.classes()).includes('sidenav-entity--is-collab')

      // @ts-expect-error: Getter is read only
      store.isCollab = false
      await flushPromises()

      expect(sidenavEntity.classes()).not.includes('sidenav-entity--is-collab')
    })
    it('should display all favorite entities correctly', () => {
      const favoriteEntities = wrapper.findAll(
        '[data-testid=favorite-entity]'
      )

      expect(favoriteEntities).toHaveLength(entities.length)
    })
    it('should display the selected entity correctly after clicking on a random entity avatar', async () => {
      const firstFavoriteEntity = wrapper.find(
        '[data-testid=favorite-entity] button'
      )
      const selectedEntity = findSelectedEntity(wrapper)

      expect(selectedEntity.exists()).toBeFalsy()

      await firstFavoriteEntity.trigger('click')

      const selectedEntity2 = findSelectedEntity(wrapper)
      const entityName = selectedEntity2.find('.entity-wrapper__details-name')
      const entityIbs = selectedEntity2.find('.entity-wrapper__details-ibs')

      expect(selectedEntity2.exists()).toBeTruthy()
      expect(entityName.text()).toBe(entities[0].name)
      expect(entityIbs.text()).toBe(entities[0].ibs)
    })
  })
  describe('events', () => {
    it('should open the sidebar when clicking on the toggle button', async () => {
      const sidenavEntity = wrapper.find('[data-testid=sidenav-entity]')
      const sidebarToggle = findSidebarToggle(wrapper)
      const arrowBarRightIcon = wrapper.findComponent({
        name: 'PIArrowBarRight'
      })

      expect(arrowBarRightIcon.exists()).toBeTruthy()

      await sidebarToggle.trigger('click')

      const arrowBarLeftIcon = wrapper.findComponent({ name: 'PIArrowBarLeft' })

      expect(arrowBarRightIcon.exists()).toBeFalsy()
      expect(arrowBarLeftIcon.exists()).toBeTruthy()
      expect(sidenavEntity.classes()).includes('sidenav-entity--opened')
    })
  })
})
