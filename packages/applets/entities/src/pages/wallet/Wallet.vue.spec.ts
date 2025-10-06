import { AmplitudeServiceMock, getHasPermissionMocked, getMockedUser, getStoreMock } from '@pulse/common/mocks'
import { flushPromises, shallowMount, type VueWrapper } from '@vue/test-utils'
import { GLOBAL_PERMISSIONS } from '@pulse/common/constants'
import { useUserStore } from '@pulse/common/stores'
import { CurrentUserManager, FeatureFlagManager } from '@pulse/common/managers'
import type { Permission } from '@pulse/common/types'

import Wallet from './'

const mockRouterPush = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
  useRoute: () => ({
    name: '',
  }),
}))

const userStoreMock = getStoreMock(useUserStore)
const userMock = getMockedUser({ firstName: 'Jack' })

vi.mock('@pulse/common/services/amplitude', () => ({
  AmplitudeService: AmplitudeServiceMock,
}))

const createWrapper = (): VueWrapper<any> =>
  shallowMount(Wallet, {
    attachTo: document.body,
    global: {
      stubs: {
        'router-view': true,
        PTabs: {
          name: 'PTabs',
          template: '<div><slot /></div>',
        },
        PTabPane: true,
      },
    },
  })
const collaboratorsTabs = ['Wallet', 'Mandate', 'Upload a BI report', 'BI Reports', 'MOD requests', 'Collaborators', 'Applications', 'Folder administration', 'Offers catalog']
const clientTabs = ['All entities', 'All users']

describe('dossier', () => {
  let wrapper: ReturnType<typeof createWrapper>

  beforeEach(async () => {
    userStoreMock.user = userMock
    userStoreMock.isCollab = true
    vi.spyOn(FeatureFlagManager, 'isFeatureActivated').mockReturnValue(true)
    vi.spyOn(CurrentUserManager, 'hasPermission').mockReturnValue(true)
    wrapper = createWrapper()
    vi.useFakeTimers()

    await flushPromises()
  })

  it('should not display Launcher when user does not have authorization', async () => {
    const noPermissions: Permission[] = []
    vi.spyOn(CurrentUserManager, 'hasPermission').mockImplementation(getHasPermissionMocked(noPermissions))
    wrapper = createWrapper()

    await flushPromises()

    const element = wrapper.find('#tab-folderLauncher')
    expect(element.exists()).toBeFalsy()
  })

  it('should only display tabs to which the user has permission to access', () => {
    vi.spyOn(CurrentUserManager, 'hasPermission').mockImplementation(getHasPermissionMocked(GLOBAL_PERMISSIONS.COLLABORATORS))
    wrapper = createWrapper()
    const collaboratorsTabsAccess = ['Wallet', 'Collaborators', 'Offers catalog']
    const tabsPane = wrapper.findAllComponents({ name: 'PTabPane' })

    collaboratorsTabsAccess.forEach((tabPane, index) => {
      const label = tabsPane.at(index)?.props('pLabel')
      expect(label).toBe(tabPane)
    })
  })

  it('should display the correct tab when user is collab', () => {
    const tabsPane = wrapper.findAllComponents({ name: 'PTabPane' })
    collaboratorsTabs.forEach((expectedLabel, index) => {
      const label = tabsPane.at(index)?.props('pLabel')
      expect(label).toBe(expectedLabel)
    })
  })

  it('should display the correct tab when user is client', () => {
    userStoreMock.isCollab = false
    vi.spyOn(CurrentUserManager, 'hasPermission').mockReturnValue(true)
    wrapper = createWrapper()
    const tabsPane = wrapper.findAllComponents({ name: 'PTabPane' })
    clientTabs.forEach((expectedLabel, index) => {
      const tabPane = tabsPane.at(index)
      const label = tabPane?.props('pLabel')
      expect(label).toBe(expectedLabel)
    })
  })
})
