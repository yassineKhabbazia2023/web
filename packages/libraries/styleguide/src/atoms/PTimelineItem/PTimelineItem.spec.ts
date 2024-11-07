import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import PTimelineItem from './'

const createWrapper = () => mount(PTimelineItem)

describe('pTimelineItem', () => {
  it('should render correctly', () => {
    const wrapper: VueWrapper<any> = createWrapper()

    const component = wrapper.findComponent({ name: 'PTimelineItem' })
    expect(component.exists()).toBeTruthy()
  })
})
