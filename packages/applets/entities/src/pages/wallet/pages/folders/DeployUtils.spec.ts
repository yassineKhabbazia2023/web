import { describe, expect, it, vi, beforeEach } from 'vitest'
import {
  fetchWalletData,
  getSearchParams,
  getMappedAccount,
} from './DeployUtils'
import {
  getMockedMappedAccount,
  getMockedSearchCriteria,
} from './DeployUtilsMock'
import type { DeploymentStatus, SearchCriteria } from '../../types'
import * as accountService from '@entities/services/account'
import {
  getMockedAccountQueryResult,
  getMockedAccountRow,
} from '@entities/services/account/accountMock'
import { ENTITY_STATUS_COLOR } from '@entities/constants'
import { EntityStatus } from '@entities/pages/wallet/components/Filters/FiltersTypes'

const deploymentStatuses: DeploymentStatus[] = [
  {
    text: 'toDeploy',
    color: ENTITY_STATUS_COLOR[EntityStatus.TO_DEPLOY],
    iconName: 'arrowUpCircle',
  },
]

vi.mock('@entities/services/account', () => {
  return {
    fetchAccounts: vi.fn(),
  }
})

vi.mock('@pulse/common', () => {
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

      const queryResult = await fetchWalletData(
        deploymentStatuses,
        searchCriteria,
      )
      const item1 = getMockedMappedAccount({
        deploymentStatus: deploymentStatuses[0],
      })
      const item2 = getMockedMappedAccount(
        {
          accountId: 2,
          accountNumber: '10102',
          deploymentStatus: deploymentStatuses[0],
        },
      )
      const expectedQueryResult = {
        currentPage: 0,
        items: [item1, item2],
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
      expect(queryParams).toBe(expectedSearchParams)
    })
    it('should return the correct query parameters when the allAccounts parameter is set to true', () => {
      const searchCriteria = getMockedSearchCriteria({
        currentPage: 1,
      })
      const queryParams = getSearchParams(searchCriteria, true)
      const expectedSearchParams = [
        'all',
        `?pageNumber=${searchCriteria.currentPage}`,
        `&pageSize=${searchCriteria.limit}`,
      ].join('')

      expect(queryParams).toBe(expectedSearchParams)
    })
  })

  describe('getMappedAccount', () => {
    it('should return proper mapped account', () => {
      const account = getMockedAccountRow()
      const index = 1
      const mappedAccount = getMappedAccount(deploymentStatuses, account, index)
      const expected = getMockedMappedAccount(
        {
          deploymentStatus: deploymentStatuses[0],
        },
      )

      expect(mappedAccount).toMatchObject(expected)
    })

    it('should return the correctly mapped account when signatory, hub, and city are all undefined', () => {
      const account = {
        ...getMockedAccountRow(),
        signatory: undefined,
        hub: undefined,
        address: { city: undefined },
      } as any
      const index = 1
      const mappedAccount = getMappedAccount(deploymentStatuses, account, index)
      const expected = getMockedMappedAccount(
        {
          deploymentStatus: deploymentStatuses[0],
          owner: {
            contactId: undefined,
            firstName: undefined,
            lastName: undefined,
            email: undefined,
          } as any,
          hub: '',
          city: '',
        },
      )

      expect(mappedAccount).toMatchObject(expected)
    })
  })
})
