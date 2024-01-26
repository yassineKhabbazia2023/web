import { describe, it, expect, vi, beforeEach } from 'vitest'
import { VueWrapper, mount } from '@vue/test-utils'
import { getMockedFavoritedEntites } from './MockedFavoritedEntites'
import type { Entity } from './components/EntityAvatar/EntityAvatarTypes'
import SidebarEntity from '.'

const entities: Entity[] = getMockedFavoritedEntites()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn()
  }),
  useRoute: () => ({
    fullPath: '/portefeuille'
  })
}))

const createWrapper = () => {
  const wrapper = mount(SidebarEntity)

  return wrapper
}

const findOpenCloseToggle = (wrapper: VueWrapper) =>
  wrapper.find('[data-testid=open-close-toggle]')
const findSelectedEntity = (wrapper: VueWrapper) =>
  wrapper.find('[data-testid=selected-entity]')

describe('sidebarEntity', () => {
  let wrapper: VueWrapper<any>
  beforeEach(() => {
    wrapper = createWrapper()
  })
  describe('display', () => {
    it('should display navbar with actions and entities', () => {
      const openCloseToggle = findOpenCloseToggle(wrapper)
      const walletItem = wrapper.find('[data-testid=wallet-item]')
      const selectedEntity = findSelectedEntity(wrapper)
      const starDivider = wrapper.find('[data-testid=star-divider]')
      const favoritesEntitites = wrapper.find(
        '[data-testid=favorites-entities]'
      )

      expect(openCloseToggle.exists()).toBeTruthy()
      expect(walletItem.exists()).toBeTruthy()
      expect(selectedEntity.exists()).toBeFalsy()
      expect(starDivider.exists()).toBeTruthy()
      expect(favoritesEntitites.exists()).toBeTruthy()
    })
    it('should display all favorites entities correctly', () => {
      const favoritesEntitites = wrapper.findAll(
        '[data-testid=favorite-entity]'
      )

      expect(favoritesEntitites).toHaveLength(entities.length)
    })
    it('should display selected entity correctly after click on a random entity avatar', async () => {
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
    it('should open sidebase when click on toggle button', async () => {
      const openCloseToggle = findOpenCloseToggle(wrapper)
      const arrowBarRightIcon = wrapper.findComponent({
        name: 'PIArrowBarRight'
      })

      expect(arrowBarRightIcon.exists()).toBeTruthy()

      await openCloseToggle.trigger('click')

      const arrowBarLeftIcon = wrapper.findComponent({ name: 'PIArrowBarLeft' })

      expect(arrowBarRightIcon.exists()).toBeFalsy()
      expect(arrowBarLeftIcon.exists()).toBeTruthy()
      expect(wrapper.classes()).includes('sidenav-entity--opened')
    })
  })
})
