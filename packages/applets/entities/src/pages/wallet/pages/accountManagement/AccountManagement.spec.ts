import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import '@entities/__mocks__/common.import.mocks'
import { nextTick } from 'vue'
import { type MockInstance, describe, expect, it, vi, beforeEach } from 'vitest'
import * as DeployUtils from '../folders/DeployUtils'
import {
  getMockedWalletQueryResult,
  getMockedSearchCriteria,
} from '../folders/DeployUtilsMock'
import type { AccountRow } from '@entities/common/types'
import { SelectedEntityManagerMock } from '@pulse/common/mocks'
import { RouteParam } from '@pulse/common/enums'

import AccountManagement from '.'

vi.mock('@pulse/common/managers', () => ({
  SelectedEntityManager: SelectedEntityManagerMock,
}))

const mockRouterPush = vi.fn()
const mockedAccount: AccountRow = {
  accountId: 1,
  name: 'Pizza Planet',
  accountNumber: '70006400886',
}
const mockedQueryResult = getMockedWalletQueryResult()

const loggerDebugSpy = vi.hoisted(() => vi.fn())
const loggerWarnSpy = vi.hoisted(() => vi.fn())
const loggerErrorSpy = vi.hoisted(() => vi.fn())

vi.mock('@pulse/core', () => ({
  logger: {
    debug: loggerDebugSpy,
    warn: loggerWarnSpy,
    error: loggerErrorSpy,
  },
}))

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
}))

const createWrapper = (): VueWrapper<any> =>
  mount(AccountManagement, {
    global: {
      stubs: ['TableData', 'PTabs'],
    },
  })

describe('deploy', () => {
  let mockFetchWalletData: MockInstance
  beforeEach(() => {
    mockFetchWalletData = vi
      .spyOn(DeployUtils, 'fetchWalletData')
      .mockResolvedValue(mockedQueryResult)
  })

  describe('display', () => {
    it('should display no result component if there are no items in the API response', async () => {
      const mockedQueryResultNoItems = getMockedWalletQueryResult({
        currentPage: 1,
        totalPage: 1,
        totalItems: 0,
        items: [],
      })
      mockFetchWalletData.mockResolvedValueOnce(mockedQueryResultNoItems)

      const wrapper = createWrapper()
      await flushPromises()

      const noResult = wrapper.findComponent({ name: 'NoResult' })
      expect(noResult.exists()).toBeTruthy()
    })
  })

  describe('pagination', () => {
    it('should update the current page when the page changes', async () => {
      const wrapper = createWrapper()
      await flushPromises()
      const pagination = wrapper.findComponent({ name: 'PPagination' })
      pagination.vm.$emit('update:pCurrentPage', 3)
      await flushPromises()

      expect(wrapper.vm.searchCriteria.currentPage).toBe(3)
    })

    it('should update the page range when the number of items to show changes', async () => {
      const wrapper = createWrapper()
      await flushPromises()
      const pagination = wrapper.findComponent({ name: 'PPagination' })
      pagination.vm.$emit('on-page-range-changed', 15)
      await flushPromises()

      expect(wrapper.vm.searchCriteria.currentPage).toBe(1)
      expect(wrapper.vm.searchCriteria.limit).toBe(15)
    })
  })

  describe('events', () => {
    it('should open the folder when clicked on', async () => {
      const wrapper = createWrapper()
      await flushPromises()
      const table = wrapper.findComponent('[data-testid=accounts-table]') as VueWrapper
      table.vm.$emit('access', '8126f51d-c834-4fda-82ea-00d51ee11983')
      await nextTick()

      expect(mockRouterPush).toHaveBeenCalledTimes(1)
      expect(mockRouterPush).toHaveBeenCalledWith({
        name: 'folder',
        params: { [RouteParam.ENTITY_ID]: '8126f51d-c834-4fda-82ea-00d51ee11983' },
      })
    })
    it("should open the account rights drawer when the 'Manage Account Rights' button is clicked", async () => {
      const wrapper = createWrapper()
      await flushPromises()
      const table = wrapper.findComponent('[data-testid=accounts-table]') as VueWrapper
      table.vm.$emit('displayAccountRightsDrawer', mockedAccount)
      await nextTick()

      expect(wrapper.vm.selectedAccount).toStrictEqual(mockedAccount)
      expect(wrapper.vm.isAccountRightsDrawerOpened).toBeTruthy()
    })
    it("should emit the 'update:modelValue' event when the v-model of AccountRights is updated", async () => {
      const wrapper = createWrapper()
      await flushPromises()
      const table = wrapper.findComponent('[data-testid=accounts-table]') as VueWrapper
      table.vm.$emit('displayAccountRightsDrawer', mockedAccount)
      await nextTick()
      const accountRightsDrawer = wrapper.findComponent({ name: 'AccountRightsDrawer' })
      accountRightsDrawer.vm.$emit('update:modelValue', false)
      await nextTick()

      expect(wrapper.vm.isAccountRightsDrawerOpened).toBeFalsy()
      expect(accountRightsDrawer.emitted('update:modelValue')).toStrictEqual([[false]])
    })
    it("should open the activation email drawer when the 'Resend Activation Mail' button is clicked", async () => {
      const wrapper = createWrapper()
      await flushPromises()
      const table = wrapper.findComponent('[data-testid=accounts-table]') as VueWrapper
      table.vm.$emit('displayResendActivationEmailDrawer', mockedAccount)
      await nextTick()

      expect(wrapper.vm.selectedAccount).toStrictEqual(mockedAccount)
      expect(wrapper.vm.isResendActivationEmailDrawerVisible).toBeTruthy()
    })
    it("should emit the 'update:modelValue' event when the v-model of ResendActivationEmail is updated", async () => {
      const wrapper = createWrapper()
      await flushPromises()
      const table = wrapper.findComponent('[data-testid=accounts-table]') as VueWrapper
      table.vm.$emit('displayResendActivationEmailDrawer', mockedAccount)
      await nextTick()
      const resendActivationEmailDrawer = wrapper.findComponent({ name: 'ResendActivationEmailDrawer' })
      resendActivationEmailDrawer.vm.$emit('update:modelValue', false)
      await nextTick()

      expect(wrapper.vm.isResendActivationEmailDrawerVisible).toBeFalsy()
      expect(resendActivationEmailDrawer.emitted('update:modelValue')).toStrictEqual([[false]])
    })
    it('should call the account API to retrieve all accounts', async () => {
      const wrapper = createWrapper()
      await flushPromises()

      expect(mockFetchWalletData).toHaveBeenCalledOnce()
      expect(wrapper.findComponent({ name: 'TableData' }).exists()).toBeTruthy()
    })

    it('should log an error to the console when the API fails to fetch the account list', async () => {
      const expectedErrorMessage = 'API Error: 503 Service Unavailable'

      mockFetchWalletData.mockRejectedValue(expectedErrorMessage)
      createWrapper()
      await flushPromises()

      expect(loggerErrorSpy).toHaveBeenCalledOnce()
      expect(loggerErrorSpy).toHaveBeenCalledWith(
        'Error while fetching data',
        expectedErrorMessage,
      )
    })

    it('should call the account API when the user searches', async () => {
      const wrapper = createWrapper()
      const SEARCH_VALUE = 'customSearchValue'

      await wrapper.find('input[type="search"]').setValue(SEARCH_VALUE)
      await wrapper.find('input[type="search"]').trigger('keyup')
      await flushPromises()

      const expectedSearchCriteria = getMockedSearchCriteria({
        currentPage: 1,
        filterByDeploymentStatus: '',
        limit: 15,
        search: '',
        accountNumber: SEARCH_VALUE,
      })

      expect(mockFetchWalletData).toHaveBeenCalledTimes(2)
      expect(mockFetchWalletData).toHaveBeenNthCalledWith(
        2,
        expect.anything(),
        expectedSearchCriteria,
        true,
      )
    })

    it('should not call the API when the user searches with fewer than 3 characters', async () => {
      const wrapper = createWrapper()

      await wrapper.find('input[type="search"]').setValue('aa')
      await wrapper.find('input[type="search"]').trigger('keyup')
      await flushPromises()

      expect(mockFetchWalletData).toHaveBeenCalledOnce()
      expect(mockFetchWalletData).not.toHaveBeenCalledTimes(2)
    })
  })
})
