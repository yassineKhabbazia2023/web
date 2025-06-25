import { flushPromises, shallowMount, type VueWrapper } from '@vue/test-utils'
import { PERMISSION_GLOBAL } from '@pulse/common/constants'
import { amplitudeServiceMock, amplitudeServiceTrackMock, CurrentUserManagerMock, hasPermissionMock, getHasPermissionMocked, getMockedUser, getStoreMock } from '@pulse/common/mocks'
import { useUserStore } from '@pulse/common/stores'

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

vi.mock('@pulse/common', () => ({
  amplitudeService: amplitudeServiceMock,
}))

vi.mock('@pulse/common/managers', () => ({
  CurrentUserManager: CurrentUserManagerMock,
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
const collaboratorsTabs = ['Wallet', 'Mandate', 'Upload a BI report', 'BI Reports', 'MOD requests', 'Collaborators']
const clientTabs = ['All entities', 'All users']

describe('dossier', () => {
  let wrapper: ReturnType<typeof createWrapper>

  beforeEach(async () => {
    userStoreMock.user = userMock
    userStoreMock.isCollab = true
    wrapper = createWrapper()
    vi.useFakeTimers()

    await flushPromises()
  })

  it('displays correctly the table', () => {
    expect(wrapper.find('.wallet__title').text()).toBe('Hello Jack')
  })

  const tabs = [
    ['folders'],
    ['subscriptions'],
    ['collaborators'],
    ['folderMandats'],
    ['folderLauncher'],
  ]
  it.each(tabs)('should redirect when click on %s', (tabName) => {
    const pTabs = wrapper.findComponent({ name: 'PTabs' })
    const tab = {
      paneName: tabName,
      props: {
        label: tabName,
      },
    }

    pTabs.vm.$emit('tab-click', tab)

    expect(amplitudeServiceTrackMock).toHaveBeenCalledOnce()
    expect(amplitudeServiceTrackMock).toHaveBeenCalledWith('Feature Consulted', {
      feature_name: tabName.toLowerCase(),
    })

    expect(mockRouterPush).toHaveBeenCalledTimes(1)
    expect(mockRouterPush).toHaveBeenCalledWith({
      name: tabName,
    })
  })

  it('should not display Launcher when user does not have authorization', async () => {
    hasPermissionMock.mockImplementation(getHasPermissionMocked([]))
    wrapper = createWrapper()

    await flushPromises()

    const element = wrapper.find('#tab-folderLauncher')
    expect(element.exists()).toBeFalsy()
  })

  it('should only display tabs to which the user has permission to access', () => {
    hasPermissionMock.mockImplementation(getHasPermissionMocked([PERMISSION_GLOBAL.COLLABORATORS]))
    wrapper = createWrapper()
    const collaboratorsTabsAccess = ['Wallet', 'Collaborators']
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
    wrapper = createWrapper()
    const tabsPane = wrapper.findAllComponents({ name: 'PTabPane' })
    clientTabs.forEach((expectedLabel, index) => {
      const tabPane = tabsPane.at(index)
      const label = tabPane?.props('pLabel')
      expect(label).toBe(expectedLabel)
    })
  })
})
