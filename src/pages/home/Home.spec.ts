import { describe, it, expect, vi } from 'vitest'
import wrapperFactory from '../../../tests/utils/wrapperFactory'
import Header from '@/components/Common/Header'
import Home from '@/pages/home'

vi.mock('@kpmg/styleguide', () => {
  const PIAdd = vi.fn()
  return { PIAdd }
})

const createWrapper = (props: any) =>
  wrapperFactory(Home, {
    props,
    stubs: {
      Header: true
    }
  })

describe('componentName.vue', () => {
  it('renders Header component', () => {
    const wrapper = createWrapper({})

    expect(wrapper.findComponent(Header).exists()).toBeTruthy()
  })
})
