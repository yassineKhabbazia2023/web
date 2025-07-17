import { shallowMount } from '@vue/test-utils'
import { TopBarManager } from './top-bar.manager'
import { getStoreMock } from '@pulse/common/mocks'
import { usePermissionsStore } from '@pulse/common/stores'
import { nextTick } from 'vue'

import TopBar from './top-bar.vue'

// Mock setup
vi.mock('./top-bar.manager', () => ({
  TopBarManager: {
    shouldDisplayCustomerSSO: vi.fn(),
    isPennylaneSSODisplayed: vi.fn(),
  },
}))

getStoreMock(usePermissionsStore)

describe('TopBar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(TopBarManager.isPennylaneSSODisplayed).mockReturnValue(true)
  })

  describe('PennylaneSSO display', async () => {
    it.each([
      {
        testName: 'should display PennylaneSSOCustomer when user is customer',
        shouldDisplayCustomerSSO: true,
        component: 'pennylane-sso-customer',
      },
      {
        testName: 'should display PennylaneSSOCollab when user is collab',
        shouldDisplayCustomerSSO: false,
        component: 'pennylane-sso-collab',
      },
    ])('$testName', async ({ shouldDisplayCustomerSSO, component }) => {
      vi.mocked(TopBarManager.shouldDisplayCustomerSSO).mockReturnValue(shouldDisplayCustomerSSO)

      const wrapper = shallowMount(TopBar)
      await nextTick()
      const ssoComponent = wrapper.findComponent({ name: component })
      expect(ssoComponent.exists()).toBe(true)
    })

    it('should not display any PennylaneSSO component when isPennylaneSSODisplayed is false', () => {
      vi.mocked(TopBarManager.isPennylaneSSODisplayed).mockReturnValue(false)

      const wrapper = shallowMount(TopBar)

      const customerComponent = wrapper.findComponent({ name: 'pennylane-sso-customer' })
      const collabComponent = wrapper.findComponent({ name: 'pennylane-sso-collab' })
      expect(customerComponent.exists()).toBe(false)
      expect(collabComponent.exists()).toBe(false)
    })
  })
})
