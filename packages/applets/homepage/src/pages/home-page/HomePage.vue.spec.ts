import { mount, type VueWrapper } from '@vue/test-utils'
import { getStoreMock, getMockedEntitySummary, getMockedEntity } from '@pulse/common/mocks'
import { useSelectedEntityStore } from '@pulse/common/stores'
import { FeatureFlagManager } from '@pulse/common/managers'

import HomePage from '.'

const mockedEntity = getMockedEntity()
const entitySummaryMock = getMockedEntitySummary(mockedEntity)
const selectedEntityStoreMock = getStoreMock(useSelectedEntityStore)

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
    selectedEntityStoreMock.selectedEntity = entitySummaryMock
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
