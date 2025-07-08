import { nextTick } from 'vue'
import { shallowMount } from '@vue/test-utils'
import type { Entity } from '@pulse/common/types'
import { getMockedFavoriteEntities } from '@app/__mocks__/entities.mocks'
import {
  getStoreMock,
  SelectedEntityManagerMock,
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
  const wrapper = shallowMount(SidebarEntity, {
    props: {
      entities,
      totalEntities: entities.length,
      selectedEntity: getMockedEntity(),
    },
    global: {
      stubs: {
        SidebarEntityItem: {
          name: 'SidebarEntityItem',
          template: '<sidebar-entity-item-stub><slot /></sidebar-entity-item-stub>',
        },
      },
    },
  })

  return wrapper
}

describe('sidebarEntity', () => {
  let wrapper: ReturnType<typeof createWrapper>
  beforeEach(() => {
    userStoreMock.isCollab = true
    userStoreMock.favoriteEntities = entities
    wrapper = createWrapper()
  })

  describe('display', () => {
    it('should display the sidebar correctly with actions and entities', () => {
      const sidebarToggle = wrapper.findComponent({ name: 'SidebarEntityItem' })
      const walletItem = wrapper.find('[data-testid=wallet-item]')
      const selectedEntity = wrapper.find('[data-testid=selected-entity]')
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
  })
  describe('events', () => {
    it('should open the sidebar when clicking on the toggle button', async () => {
      const sidenavEntity = wrapper.find('[data-testid="sidenav-entity"]')
      const sidebarToggle = wrapper.findComponent({ name: 'SidebarEntityItem' })
      const pIcon = wrapper.findComponent({ name: 'PIcon' })

      expect(pIcon.props('pName')).toBe('arrowBarRight')

      await sidebarToggle.vm.$emit('item-clicked')

      expect(pIcon.props('pName')).toBe('arrowBarLeft')
      expect(sidenavEntity.classes()).includes('sidenav-entity--opened')
    })

    it('should not display appVersion when sidebar is closed', async () => {
      const sidenavEntity = wrapper.find('[data-testid="sidenav-entity"]')
      const appVersion = wrapper.findComponent({ name: 'AppVersion' })

      expect(sidenavEntity.classes()).not.includes('sidenav-entity--opened')
      expect(appVersion.exists()).toBe(false)
    })

    it('should display appVersion when sidebar is opened', async () => {
      const sidenavEntity = wrapper.find('[data-testid="sidenav-entity"]')
      const sidebarToggle = wrapper.findComponent({ name: 'SidebarEntityItem' })

      await sidebarToggle.vm.$emit('item-clicked')

      const appVersion = wrapper.findComponent({ name: 'AppVersion' })

      expect(sidenavEntity.classes()).includes('sidenav-entity--opened')
      expect(sidenavEntity.classes()).includes('sidenav-entity--opened')
      expect(appVersion.exists()).toBe(true)
    })
  })
})
