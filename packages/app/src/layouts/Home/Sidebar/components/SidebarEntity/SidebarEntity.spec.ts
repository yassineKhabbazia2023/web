import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import type { Entity } from '@pulse/common/types'
import { getMockedFavoriteEntities } from '@app/__mocks__/entities.mocks'
import {
  getStoreMock,
  SelectedEntityManagerMock,
  defineSelectedEntityMock,
  getMockedEntity,
} from '@pulse/common/mocks'
import { useFavoriteEntitiesStore, useUserStore } from '@pulse/common/stores'

import SidebarEntity from '.'

const defaultEntityMock = getMockedEntity()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  useRoute: () => ({
    fullPath: '/portefeuille',
  }),
}))

const favoriteEntitiesStoreMock = getStoreMock(useFavoriteEntitiesStore)
const userStoreMock = getStoreMock(useUserStore)

const getDefaultEntityMock = vi.hoisted(() => vi.fn())
vi.mock('./utils', () => ({
  getDefaultEntity: getDefaultEntityMock,
}))

const entities: Entity[] = getMockedFavoriteEntities()

vi.mock('@pulse/common', () => ({
  dataProvider: () => {
    return {
      fetchUserData: vi.fn(),
    }
  },
}))

vi.mock('@pulse/common/managers', () => ({
  SelectedEntityManager: SelectedEntityManagerMock,
}))

const createWrapper = () => {
  const wrapper = mount(SidebarEntity, {
    props: {
      entities,
      totalEntities: entities.length,
      selectedEntity: getMockedEntity(),
    },
  })

  return wrapper
}

const findSidebarToggle = (wrapper: VueWrapper) =>
  wrapper.find('[data-testid=sidebar-toggle]')
const findSelectedEntity = (wrapper: VueWrapper) =>
  wrapper.find('[data-testid=selected-entity]')

describe('sidebarEntity', () => {
  let wrapper: ReturnType<typeof createWrapper>
  beforeEach(() => {
    userStoreMock.isCollab = true
    favoriteEntitiesStoreMock.favoriteEntities = entities
    getDefaultEntityMock.mockReturnValue(defaultEntityMock)
    wrapper = createWrapper()
  })

  describe('display', () => {
    it.skip('should display the sidebar correctly with actions and entities', () => {
      const sidebarToggle = findSidebarToggle(wrapper)
      const walletItem = wrapper.find('[data-testid=wallet-item]')
      const selectedEntity = findSelectedEntity(wrapper)
      const starDivider = wrapper.find('[data-testid=star-divider]')
      const favoriteEntities = wrapper.find('[data-testid=favorite-entities]')
      const EntityAvatars = favoriteEntities.findAllComponents({ name: 'EntityAvatar' })

      expect(sidebarToggle.exists()).toBeTruthy()
      expect(walletItem.exists()).toBeTruthy()
      expect(selectedEntity.exists()).toBeTruthy()
      expect(starDivider.exists()).toBeTruthy()
      expect(favoriteEntities.exists()).toBeTruthy()
      expect(EntityAvatars).toHaveLength(entities.length)
    })

    it.skip('should call SelectedEntityManager on mounted', () => {
      expect(defineSelectedEntityMock).toHaveBeenCalledOnce()
      expect(defineSelectedEntityMock).toHaveBeenNthCalledWith(1, defaultEntityMock)
    })

    it.skip('should call SelectedEntityManager when click on EntityAvatar', () => {
      const favoriteEntities = wrapper.find('[data-testid=favorite-entities]')
      const EntityAvatars = favoriteEntities.findAllComponents({ name: 'EntityAvatar' })
      const secondEntityAvatar = EntityAvatars.at(1)
      const entity = entities.at(1)
      secondEntityAvatar.vm.$emit('entity-selected', entity)

      expect(defineSelectedEntityMock).toHaveBeenCalledTimes(2)
      expect(defineSelectedEntityMock).toHaveBeenNthCalledWith(2, entity)
    })

    it.skip('should display the sidebar with the appropriate background color', async () => {
      const sidenavEntity = wrapper.find('[data-testid="sidenav-entity"]')

      expect(sidenavEntity.classes()).includes('sidenav-entity--is-collab')

      userStoreMock.isCollab = false
      await flushPromises()

      expect(sidenavEntity.classes()).not.includes('sidenav-entity--is-collab')
    })
    it.skip('should display all favorite entities correctly', () => {
      const favoriteEntities = wrapper.findAll(
        '[data-testid=favorite-entity]',
      )

      expect(favoriteEntities).toHaveLength(entities.length)
    })
    it.skip('should display the selected entity correctly after clicking on a random entity avatar', async () => {
      const firstFavoriteEntity = wrapper.find(
        '[data-testid=favorite-entity] button',
      )
      const selectedEntity = findSelectedEntity(wrapper)

      expect(selectedEntity.exists()).toBeTruthy()

      await firstFavoriteEntity.trigger('click')

      const selectedEntity2 = findSelectedEntity(wrapper)
      const entityName = selectedEntity2.find('.entity-wrapper__details-name')
      const entityIbs = selectedEntity2.find('.entity-wrapper__details-ibs')
      // entities are sorted now
      const sortedEntities = [...entities].sort((a, b) =>
        a.legalName.localeCompare(b.legalName),
      )

      expect(selectedEntity2.exists()).toBeTruthy()
      expect(entityName.text()).toBe(sortedEntities[0].legalName)
      expect(entityIbs.text()).toBe(sortedEntities[0].accountNumber)
    })
  })
  describe('events', () => {
    it.skip('should open the sidebar when clicking on the toggle button', async () => {
      const sidenavEntity = wrapper.find('[data-testid="sidenav-entity"]')
      const sidebarToggle = findSidebarToggle(wrapper)
      const pIcon = wrapper.findComponent({ name: 'PIcon' })

      expect(pIcon.props('pName')).toBe('arrowBarRight')

      await sidebarToggle.trigger('click')

      expect(pIcon.props('pName')).toBe('arrowBarLeft')
      expect(sidenavEntity.classes()).includes('sidenav-entity--opened')
    })
    it.skip('should not display appVersion when sidebar is closed', async () => {
      const sidenavEntity = wrapper.find('[data-testid="sidenav-entity"]')
      const appVersion = wrapper.find('[data-testid=app-version]')

      expect(sidenavEntity.classes()).not.includes('sidenav-entity--opened')
      expect(appVersion.exists()).not.toBeTruthy()
    })
    it.skip('should display appVersion when sidebar is opened', async () => {
      const sidenavEntity = wrapper.find('[data-testid="sidenav-entity"]')
      const sidebarToggle = findSidebarToggle(wrapper)

      await sidebarToggle.trigger('click')

      const appVersion = wrapper.find('[data-testid=app-version]')

      expect(sidenavEntity.classes()).includes('sidenav-entity--opened')
      expect(appVersion.exists()).toBeTruthy()
    })
  })
})
