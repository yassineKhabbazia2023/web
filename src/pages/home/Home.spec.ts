import { describe, it, expect } from 'vitest'
import wrapperFactory from '../../../tests/utils/wrapperFactory'
import Header from '@/components/Common/Header'
import ListMandate from '@/components/DisplayMandate/Table'
import Home from '@/pages/home'
import {
  waitForAsyncImports
} from '@kpmg/common/src/testing-helpers'

const createWrapper = (props: any) =>
  wrapperFactory(Home, {
    props,
    stubs: {
      Header: true,
      ListMandate: true
    }
  })

describe('componentName.vue', () => {
  it('renders Header component', async () => {
    const wrapper = createWrapper({})
    await waitForAsyncImports(50)
    expect(wrapper.findComponent(Header).exists()).toBeTruthy()
    expect(wrapper.findComponent(ListMandate).exists()).toBeTruthy()
  })
})
