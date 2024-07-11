import { defineStore } from 'pinia'
import { mount, type VueWrapper } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import { commonStore } from '@kpmg/common'
import { createTestingPinia } from '@pinia/testing'
import { mockedEntity } from '../../../wallet/components/TableData/mockData'
import Home from '.'

const pinia = createTestingPinia()
vi.mock('@kpmg/common', () => ({
  commonStore: defineStore('common', {
    getters: {
      isCollab: () => true,
      defaultEntity: () => mockedEntity,
    },
  }),
}))

const createWrapper = (): VueWrapper<any> => mount(Home, {
  global: {
    plugins: [pinia],
  },
})

describe('homeclient', () => {
  const wrapper = createWrapper()
  it('should render the the component', () => {
    expect(wrapper.find('.home-folder').exists()).toBeTruthy()
  })
  it('displays correctly the header of the page', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('[data-testid=home-folder-name]').text()).toBe(
      mockedEntity.legalName,
    )
    expect(wrapper.find('[data-testid=home-folder-account-number]').text()).toBe(
      mockedEntity.accountNumber,
    )
  })
  it('should display the tooltip button when the user is a collab', () => {
    const store = commonStore()
    // @ts-expect-error: Getter is read only
    store.isCollab = true
    const btnAction = wrapper.findComponent(
      '[data-testid=home-folder-button]',
    ) as VueWrapper
    expect(btnAction.classes()).toContain('el-tooltip__trigger')
  })
})
