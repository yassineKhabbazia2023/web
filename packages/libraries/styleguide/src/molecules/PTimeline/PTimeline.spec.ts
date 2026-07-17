import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'

import PTimeline from './'

const createWrapper = () => mount(PTimeline)

describe('pTimeline', () => {
  it('should render correctly', () => {
    const wrapper: VueWrapper<any> = createWrapper()

    const component = wrapper.findComponent({ name: 'PTimeline' })
    expect(component.exists()).toBeTruthy()
  })
})
