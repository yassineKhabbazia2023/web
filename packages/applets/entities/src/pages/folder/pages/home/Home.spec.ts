import { defineStore } from 'pinia'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
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

describe('clientHome', () => {
  const wrapper = createWrapper()
  it('should render the the component', () => {
    expect(wrapper.find('.home-folder').exists()).toBeTruthy()
  })
  it('displays correctly the header of the page', () => {
    const wrapper = createWrapper()
    const arrowRightIcon = wrapper.findComponent({ name: 'PIArrowRight' })

    expect(arrowRightIcon.exists()).toBeTruthy()
    expect(wrapper.find('[data-testid=home-folder-name]').text()).toBe(
      mockedEntity.legalName,
    )
    expect(wrapper.find('[data-testid=home-folder-account-number]').text()).toBe(
      mockedEntity.accountNumber,
    )
  })
  it('should display the tooltip button when the user is a collab', () => {
    const btnAction = wrapper.findComponent(
      '[data-testid=home-folder-button]',
    ) as VueWrapper

    expect(btnAction.classes()).toContain('el-tooltip__trigger')
  })
  it('should correctly display the page header for the client', async () => {
    const wrapper = createWrapper()
    const store = commonStore()
    // @ts-expect-error: Getter is read only
    store.isCollab = false
    await flushPromises()

    const arrowRightIcon = wrapper.find('[data-testid=join-arrow-right-icon]')
    expect(arrowRightIcon.exists()).toBeTruthy()
  })
})
