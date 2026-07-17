import type { VueWrapper } from '@vue/test-utils'
import { shallowMount } from '@vue/test-utils'

import PTimelineItem from './'

const createWrapper = () => shallowMount(PTimelineItem, {
  global: {
    stubs: {
      ElTimelineItem: {
        name: 'ElTimelineItem',
        template: '<div><slot /></div>',
      },
    },
  },
})

describe('pTimelineItem', () => {
  it('should render correctly', () => {
    const wrapper: VueWrapper<any> = createWrapper()

    const component = wrapper.findComponent({ name: 'ElTimelineItem' })
    expect(component.exists()).toBeTruthy()
  })
})
