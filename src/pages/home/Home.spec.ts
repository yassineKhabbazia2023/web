import { describe, it, expect } from 'vitest'
import wrapperFactory from 'tests/utils/wrapperFactory'
import Header from '@/components/Common/Header'
import Home from './'

const createWrapper = (props: any) =>
  wrapperFactory(Home, {
    props,
    stubs: {
      Header: true
    }
  })

describe('ComponentName.vue', () => {
  it('renders Header component', () => {
    const wrapper = createWrapper({})

    expect(wrapper.findComponent(Header).exists()).toBe(true)
  })
})
