import type { VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import type { Entity } from '@pulse/common/types'
import { getMockedFavoriteEntities } from '@app/__mocks__/entities.mocks'
import {
  getStoreMock,
  SelectedEntityManagerMock,
  persistSelectedEntityMock,
  getMockedEntity,
} from '@pulse/common/mocks'
import { useUserStore } from '@pulse/common/stores'

import SidebarEntity from '.'

const accountIdMock = 12314

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  useRoute: () => ({
    fullPath: '/portefeuille',
    params: {
      id: accountIdMock,
    },
  }),
}))

const userStoreMock = getStoreMock(useUserStore)
const entities: Entity[] = getMockedFavoriteEntities()

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
    userStoreMock.favoriteEntities = entities
    wrapper = createWrapper()
  })

  describe('display', () => {
    it('should display the sidebar correctly with actions and entities', () => {
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

    it('should call SelectedEntityManager when click on EntityAvatar', () => {
      const favoriteEntities = wrapper.find('[data-testid=favorite-entities]')
      const EntityAvatars = favoriteEntities.findAllComponents({ name: 'EntityAvatar' })
      const secondEntityAvatar = EntityAvatars.at(1)
      const entity = entities.at(1)
      secondEntityAvatar.vm.$emit('entity-selected', entity)

      expect(persistSelectedEntityMock).toHaveBeenCalledOnce()
      expect(persistSelectedEntityMock).toHaveBeenCalledWith(entity)
    })

    it('should display the sidebar with the appropriate background color', async () => {
      const sidenavEntityBefore = wrapper.find('[data-testid="sidenav-entity"]')

      expect(sidenavEntityBefore.exists()).toBe(true)
      expect(sidenavEntityBefore.classes()).includes('sidenav-entity--is-collab')

      userStoreMock.isCollab = false
      userStoreMock.isCustomer = true
      // we need to be sure the customer is not single entity (otherwise the sidenav is not displayed)
      userStoreMock.getIsSingleEntity.mockReturnValue(false)
      await nextTick()

      const sidenavEntityAfter = wrapper.find('[data-testid="sidenav-entity"]')

      expect(sidenavEntityAfter.exists()).toBe(true)
      expect(sidenavEntityAfter.classes()).not.includes('sidenav-entity--is-collab')
    })

    it('should display all favorite entities correctly', () => {
      const favoriteEntities = wrapper.findAll(
        '[data-testid=favorite-entity]',
      )

      expect(favoriteEntities).toHaveLength(entities.length)
    })

    it('should persist the selected entity correctly after clicking on a favorite entity avatar', async () => {
      const firstFavoriteEntity = wrapper.find('[data-testid=favorite-entity] button')

      await firstFavoriteEntity.trigger('click')

      const accountNumber = firstFavoriteEntity.find('.entity-wrapper__details-ibs')
      const selectedEntity = entities.find((entity) => entity.accountNumber === accountNumber.text())

      expect(persistSelectedEntityMock).toHaveBeenCalledTimes(1)
      expect(persistSelectedEntityMock).toHaveBeenCalledWith(selectedEntity)
    })
  })
  describe('events', () => {
    it('should open the sidebar when clicking on the toggle button', async () => {
      const sidenavEntity = wrapper.find('[data-testid="sidenav-entity"]')
      const sidebarToggle = findSidebarToggle(wrapper)
      const pIcon = wrapper.findComponent({ name: 'PIcon' })

      expect(pIcon.props('pName')).toBe('arrowBarRight')

      await sidebarToggle.trigger('click')

      expect(pIcon.props('pName')).toBe('arrowBarLeft')
      expect(sidenavEntity.classes()).includes('sidenav-entity--opened')
    })
    it('should not display appVersion when sidebar is closed', async () => {
      const sidenavEntity = wrapper.find('[data-testid="sidenav-entity"]')
      const appVersion = wrapper.find('[data-testid=app-version]')

      expect(sidenavEntity.classes()).not.includes('sidenav-entity--opened')
      expect(appVersion.exists()).not.toBeTruthy()
    })
    it('should display appVersion when sidebar is opened', async () => {
      const sidenavEntity = wrapper.find('[data-testid="sidenav-entity"]')
      const sidebarToggle = findSidebarToggle(wrapper)

      await sidebarToggle.trigger('click')

      const appVersion = wrapper.find('[data-testid=app-version]')

      expect(sidenavEntity.classes()).includes('sidenav-entity--opened')
      expect(appVersion.exists()).toBeTruthy()
    })
  })
})
