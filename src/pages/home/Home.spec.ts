import { describe, it, expect, vi } from 'vitest'
import wrapperFactory from '../../../tests/utils/wrapperFactory'
import Header from '@/components/Common/Header'
import Home from '@/pages/home'

const createWrapper = (props: any) =>
  wrapperFactory(Home, {
    props,
    stubs: {
      Header: true
    }
  })

describe('componentName.vue', () => {
  it('renders Header component', async () => {
    const wrapper = createWrapper({})
    await vi.dynamicImportSettled()
    expect(wrapper.findComponent(Header).exists()).toBeTruthy()
  })
})
