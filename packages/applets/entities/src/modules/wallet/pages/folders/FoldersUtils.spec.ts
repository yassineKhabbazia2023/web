import { describe, expect, it, vi, beforeEach } from 'vitest'
import {
  fetchWalletData,
  getMappedAccount,
} from './FoldersUtils'
import {
  getMockedMappedAccount,
  getMockedSearchCriteria,
} from '@entities/__mocks__/deploy-utils.mocks'
import type { DeploymentStatus, SearchCriteria } from '@entities/modules/wallet/types'
import * as accountService from '@entities/services/account'
import {
  getMockedAccountQueryResult,
  getMockedAccountRow,
} from '@entities/__mocks__/account-row.mocks'
import { ENTITY_STATUS_COLOR } from '@entities/constants'
import { EntityStatus } from '@entities/modules/wallet/enums'
import { MockEntityId, MockEntityData } from '@pulse/common/mocks'

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

vi.mock('@pulse/common/api', () => {
  return {
    api: ({
      gateway: {
        get: (url: string) => ({
          data: [url],
        }),
      },
    }),
  }
})

describe('test FoldersUtils', () => {
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
          accountId: MockEntityId.LEGACY_GED,
          accountNumber: MockEntityData.LEGACY_GED.accountNumber,
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
