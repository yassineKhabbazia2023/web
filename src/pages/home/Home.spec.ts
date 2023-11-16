import { defineStore } from 'pinia'
import { describe, it, expect, vi } from 'vitest'
import wrapperFactory from '../../../tests/utils/wrapperFactory'
import Header from '@/components/Common/Header'
import ListMandate from '@/components/DisplayMandate/Table'
import Pagination from '@/components/DisplayMandate/Pagination'
import Home from '@/pages/home'
import {
  waitForAsyncImports
} from '@kpmg/common/src/testing-helpers'

vi.mock('@kpmg/common', () => ({
  commonStore: defineStore('common', {
    state: () => ({})
  })
}))

const createWrapper = (props: any) =>
  wrapperFactory(Home, {
    props,
    stubs: {
      Header: true,
      ListMandate: true,
      Pagination: true
    }
  })

describe('componentName.vue', () => {
  it('renders Header component', async () => {
    const wrapper = createWrapper({})
    await waitForAsyncImports(50)
    expect(wrapper.findComponent(Header).exists()).toBeTruthy()
    expect(wrapper.findComponent(ListMandate).exists()).toBeTruthy()
    expect(wrapper.findComponent(Pagination).exists()).toBeTruthy()
  })
})
