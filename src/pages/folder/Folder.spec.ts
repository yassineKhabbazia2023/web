import { defineStore } from 'pinia'
import { beforeEach, describe, it, expect, vi } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { commonStore } from '@kpmg/common'
import { mockedEntity } from '../wallet/components/TableData/mockData'
import { PERMISSION_CODES } from '@/constants'
import Folder from './'

const pinia = createTestingPinia()
vi.mock('@kpmg/common', () => ({
  commonStore: defineStore('common', {
    state: () => ({
      user: {
        entities: {
          default: mockedEntity,
        },
      },
    }),
    getters: {
      isCollab: () => true,
      defaultEntity: () => mockedEntity,
    },
    actions: {
      fetchUserAccountPermissions: () => vi.fn(),
    },
  }),
  userPermissions: () => ({
    hasPermission: mockHasPermission,
  }),
}))

const mockRouterPush = vi.fn()
const mockHasPermission = vi.fn((_code: string[]) => true)
let useRouteResponse = {}

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
  useRoute: () => (useRouteResponse),
}))

const createWrapper = (): VueWrapper<any> =>
  mount(Folder, {
    attachTo: document.body,
    global: {
      plugins: [pinia],
    },
  })

describe('dossier', () => {
  let wrapper: VueWrapper<any>

  beforeEach(async () => {
    vi.useFakeTimers()
    useRouteResponse = {}
    wrapper = createWrapper()

    await flushPromises()
  })

  it('displays correctly the table', () => {
    expect(wrapper.find('.folder-wrapper__default-entity').text()).toBe(
      mockedEntity.legalName,
    )
  })
  const PARAMS = [
    ['collab', 'tab-collab'],
    ['usersCollab', 'tab-usersCollab'],
    ['offers', 'tab-offers'],
    ['info', 'tab-info'],
  ]
  it.each(PARAMS)('should redirect when click on %s', (tabs, tabsName) => {
    document.getElementById(tabsName)?.click()
    expect(mockRouterPush).toHaveBeenCalledTimes(1)
    expect(mockRouterPush).toHaveBeenCalledWith({
      name: tabs,
      params: {
        name: mockedEntity.legalName,
      },
    })
  })

  it('should redirect to userClient if user is a client', async () => {
    useRouteResponse = { name: 'usersCollab' }
    const store = commonStore()
    // @ts-expect-error: Getter is read only
    store.isCollab = false
    await flushPromises()

    wrapper = createWrapper()

    await document.getElementById('tab-usersClient')?.click()

    expect(mockRouterPush).toHaveBeenCalledTimes(2)
    expect(mockRouterPush).toHaveBeenNthCalledWith(1, {
      name: 'usersClient',
      params: {
        name: mockedEntity.legalName,
      },
    })
    expect(mockRouterPush).toHaveBeenNthCalledWith(2, {
      name: 'usersClient',
      params: {
        id: mockedEntity.accountId,
      },
    })
  })
  it('should only display tabs to which the user has permission to access', async () => {
    mockHasPermission.mockImplementation((permissions: string[]) =>
      permissions.includes(PERMISSION_CODES.ACCOUNT_INFORMATION[0]),
    )
    wrapper = createWrapper()
    await flushPromises()
    const folderTabsAccess = ['Information']
    const tabsPane = wrapper.findAllComponents({ name: 'PTabPane' })
    folderTabsAccess.forEach((tabPane, index) => {
      const label = tabsPane.at(index)?.props('pLabel')
      expect(label).toBe(tabPane)
    })
  })
  it("should not display the 'Add User' button if the client does not have the necessary permissions", async () => {
    const store = commonStore()
    mockHasPermission.mockReturnValue(false)
    // @ts-expect-error: Getter is read only
    store.isCollab = false
    await flushPromises()
    wrapper = createWrapper()
    const folderActionButton = wrapper.findComponent({ name: 'PButton' })

    expect(folderActionButton.exists()).toBeFalsy()
  })
  it('should display the button label when the user is a client', () => {
    const store = commonStore()
    // @ts-expect-error: Getter is read only
    store.isCollab = false
    const btnAction = wrapper.findComponent(
      '[data-testid=folder-action-button]',
    ) as VueWrapper
    expect(btnAction.text()).toBe('Add user')
  })
})
