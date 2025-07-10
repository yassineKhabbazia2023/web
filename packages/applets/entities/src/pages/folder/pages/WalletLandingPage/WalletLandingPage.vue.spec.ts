import { mount, type VueWrapper } from '@vue/test-utils'
import { getStoreMock } from '@pulse/common/mocks'
import { useSelectedEntityStore } from '@pulse/common/stores'
import { mockedEntity } from '@entities/__mocks__/entities.mocks'
import { FeatureFlagManager } from '@pulse/core'

import WalletLandingPage from '.'

const selectedEntityStoreMock = getStoreMock(useSelectedEntityStore)

const createWrapper = (): VueWrapper<any> => mount(WalletLandingPage, {
  global: {
    stubs: {
      EntityHeader: true,
      WidgetsHome: true,
      LegacyHome: true,
    },
  },
})

describe('WalletLandingPage', () => {
  const wrapper = createWrapper()
  beforeEach(async () => {
    selectedEntityStoreMock.selectedEntity = mockedEntity
  })

  describe('render', () => {
    it('should render the the component', () => {
      expect(wrapper.find('[data-testid=wallet-landing-page]').exists()).toBeTruthy()
    })

    it('renders the entity header', () => {
      const wrapper = createWrapper()
      const entityHeaderWrapper = wrapper.findComponent({ name: 'EntityHeader' })
      expect(entityHeaderWrapper.exists()).toBeTruthy()
    })
  })

  describe('widgets', () => {
    it('should render the widgets home when the widgets flag is ON', () => {
      vi.spyOn(FeatureFlagManager, 'isHomepageWidgetsActivated').mockReturnValue(true)
      const wrapper = createWrapper()

      const widgetsHomeWrapper = wrapper.findComponent({ name: 'WidgetsHome' })
      const legacyHomeWrapper = wrapper.findComponent({ name: 'LegacyHome' })

      expect(widgetsHomeWrapper.exists()).toBeTruthy()
      expect(legacyHomeWrapper.exists()).not.toBeTruthy()
    })

    it('should render the legacy home when the widgets flag is OFF', () => {
      vi.spyOn(FeatureFlagManager, 'isHomepageWidgetsActivated').mockReturnValue(false)
      const wrapper = createWrapper()

      const widgetsHomeWrapper = wrapper.findComponent({ name: 'WidgetsHome' })
      const legacyHomeWrapper = wrapper.findComponent({ name: 'LegacyHome' })

      expect(legacyHomeWrapper.exists()).toBeTruthy()
      expect(widgetsHomeWrapper.exists()).not.toBeTruthy()
    })
  })
})
