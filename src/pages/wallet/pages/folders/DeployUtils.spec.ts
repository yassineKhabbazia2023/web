import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fetchWalletData, getSearchParams, getMappedAccount } from './DeployUtils'
import { getMockedMappedAccount, getMockedSearchCriteria } from './DeployUtilsMock'
import { PIArrowUpCircle } from '@kpmg/styleguide'
import type { DeploymentStatus, SearchCriteria } from '../../types'
import * as accountService from '@/services/account'
import { getMockedAccountQueryResult, getMockedAccountRow } from '@/services/account/accountMock'

const deploymentStatuses: DeploymentStatus[] = [{
  text: 'toDeploy',
  icon: PIArrowUpCircle,
  color: 'warning',
}]

vi.mock('@/services/account', () => {
  return {
    fetchAccounts: vi.fn(),
  }
})

vi.mock('@kpmg/common', () => {
  return {
    commonApi: () => ({
      gateway: {
        get: (url: string) => ({
          data: [url],
        }),
      },
    }),
  }
})

describe('test DeployUtils', () => {
  let searchCriteria: SearchCriteria
  beforeEach(() => {
    searchCriteria = getMockedSearchCriteria()
  })

  describe('fetchWalletData', () => {
    it('should return proper queryParams', async () => {
      const mockedAccountQueryResult = getMockedAccountQueryResult({
        currentPage: 0,
      })
      const fetchAccountsSpy = vi
        .spyOn(accountService, 'fetchAccounts')
        .mockResolvedValue(mockedAccountQueryResult)
      const expectedArguments = [
        'currentuser',
        `?pageNumber=${searchCriteria.currentPage}`,
        `&pageSize=${searchCriteria.limit}`,
      ].join('')

      const queryResult = await fetchWalletData(deploymentStatuses, searchCriteria)
      const item1 = getMockedMappedAccount({
        deploymentStatus: undefined,
      })
      const item2 = getMockedMappedAccount({
        accountId: 2,
        accountNumber: '10102',
        deploymentStatus: undefined,
      }, 'orange')
      const expectedQueryResult = {
        currentPage: 0,
        items: [
          item1,
          item2,
        ],
        totalItems: 2,
        totalPage: 1,
      }

      expect(fetchAccountsSpy).toHaveBeenCalledOnce()
      expect(fetchAccountsSpy).toHaveBeenNthCalledWith(1, expectedArguments)
      expect(queryResult).toMatchObject(expectedQueryResult)
    })
  })

  describe('getSearchParams', () => {
    it('should return proper queryParams', () => {
      const searchCriteria = getMockedSearchCriteria({
        currentPage: 1,
      })
      const queryParams = getSearchParams(searchCriteria)
      const expectedSearchParams = [
        'currentuser',
        `?pageNumber=${searchCriteria.currentPage}`,
        `&pageSize=${searchCriteria.limit}`,
      ].join('')
      expect(queryParams).toMatchObject(expectedSearchParams)
    })
  })

  describe('getMappedAccount', () => {
    it('should return proper mapped account', () => {
      const account = getMockedAccountRow()
      const index = 1
      const mappedAccount = getMappedAccount(deploymentStatuses, account, index)
      const expected = {
        accountId: 1,
        accountNumber: '10102',
        city: 'Paris',
        deploymentStatus: undefined,
        hub: 'Paris',
        id: 'account-global-unique-id',
        isFavorite: false,
        name: 'Legal Name',
        owner: {
          avatarColor: 'orange',
          email: 'sign@kpmg.fr',
          firstName: 'Signa',
          initials: 'ST',
          lastName: 'Tory',
        },
      }

      expect(mappedAccount).toMatchObject(expected)
    })
  })
})
