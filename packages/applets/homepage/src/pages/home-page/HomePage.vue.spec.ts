import { mount, type VueWrapper } from '@vue/test-utils'
import { getStoreMock, getMockedEntitySummary, getMockedEntity } from '@pulse/common/mocks'
import { useCurrentEntityStore } from '@pulse/common/stores'
import { FeatureFlagManager } from '@pulse/common/managers'

import HomePage from './HomePage.vue'

const mockedEntity = getMockedEntity()
const entitySummaryMock = getMockedEntitySummary(mockedEntity)
const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)

const createWrapper = (): VueWrapper<any> => mount(HomePage, {
  global: {
    stubs: {
      PEntityHeader: true,
      WidgetsHome: true,
      LegacyHome: true,
      TopBar: true,
    },
  },
})

describe('HomePage', () => {
  beforeEach(async () => {
    currentEntityStoreMock.currentEntity = entitySummaryMock
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
