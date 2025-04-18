import { mount, type VueWrapper } from '@vue/test-utils'
import { getStoreMock } from '@pulse/common/mocks'
import { useSelectedEntityStore } from '@pulse/common/stores'
import { mockedEntity } from '@entities/__mocks__/entities.mocks'

import Home from '.'

const selectedEntityStoreMock = getStoreMock(useSelectedEntityStore)

const createWrapper = (): VueWrapper<any> => mount(Home, {
  global: {
    stubs: {
      EntityHeader: true,
      PRow: true,
      PCol: true,
      PImage: true,
    },
  },
})

describe('clientHome', () => {
  const wrapper = createWrapper()
  beforeEach(async () => {
    selectedEntityStoreMock.selectedEntity = mockedEntity
  })

  it('should render the the component', () => {
    expect(wrapper.find('.home-folder').exists()).toBeTruthy()
  })

  it('renders the entity header', () => {
    const wrapper = createWrapper()
    const entityHeaderWrapper = wrapper.findComponent({ name: 'EntityHeader' })
    expect(entityHeaderWrapper.exists()).toBeTruthy()
  })
})
