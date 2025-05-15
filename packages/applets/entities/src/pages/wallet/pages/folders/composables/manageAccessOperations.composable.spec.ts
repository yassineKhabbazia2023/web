import { contactServiceMock } from '@entities/__mocks__/contact.service.mocks'
import type { AccountOperations } from '@entities/services/contact/contactTypes'
import { getPaginationMock } from '@pulse/common/mocks'
import { getAccountOperationsListMock } from '@entities/__mocks__/operations.mocks'

import { useManageAccessOperations } from './manageAccessOperations.composable'

vi.mock('@entities/services/contact', () => contactServiceMock)

const MANAGE_ACCESS_PAGE_SIZE_MOCK = 5
const totalItemsMock = 2
const totalPagesMock = 5
const accountOperationsListMock = getAccountOperationsListMock()

const accountOperationMock = getPaginationMock<AccountOperations>({
  items: accountOperationsListMock,
  totalItems: totalItemsMock,
  totalPages: totalPagesMock,
})

describe('manageAccess.composable', () => {
  const {
    manageAccessPage,
    manageAccessCount,
    accountOperationsList,
    refreshManageAccessOperations,
    refreshPageCount,
  } = useManageAccessOperations(MANAGE_ACCESS_PAGE_SIZE_MOCK)

  beforeEach(() => {
    contactServiceMock.fetchAccountOperations.mockResolvedValue(accountOperationMock)
  })

  describe('initialization', () => {
    it('should initialize manageAccessPage with 1', () => {
      expect(manageAccessPage.value).toBe(1)
    })

    it('should initialize accountOperationsList with []', () => {
      expect(accountOperationsList.value).toStrictEqual([])
    })
  })

  describe('when call refreshManageAccessOperations', () => {
    const newCurrentPage = 2
    beforeEach(async () => {
      await refreshManageAccessOperations({
        currentPage: newCurrentPage,
      })
    })

    it('should call fetchAccountOperations with correct params', () => {
      expect(contactServiceMock.fetchAccountOperations).toHaveBeenCalledWith(
        newCurrentPage,
        MANAGE_ACCESS_PAGE_SIZE_MOCK,
      )
    })

    it('should set accountOperationsList properly', () => {
      const expectedAccountOperationsList = [...accountOperationMock.items]

      expect(accountOperationsList.value).toStrictEqual(expectedAccountOperationsList)
    })

    it('should set manageAccessCount properly', () => {
      const expectedManageAccessCount = totalItemsMock

      expect(manageAccessCount.value).toStrictEqual(expectedManageAccessCount)
    })

    it('should set manageAccessPage properly', async () => {
      const expectedManageAccessPage = newCurrentPage

      expect(manageAccessPage.value).toStrictEqual(expectedManageAccessPage)
    })

    it('should keep manageAccessPage when no currentPage is given', async () => {
      const manageAccessPageMock = 1
      const expectedManageAccessPage = manageAccessPageMock

      manageAccessPage.value = manageAccessPageMock
      await refreshManageAccessOperations()

      expect(manageAccessPage.value).toStrictEqual(expectedManageAccessPage)
    })

    it('should set manageAccessPage to totalPages if manageAccessPage is bigger than totalPages', async () => {
      const manageAccessPageMock = totalPagesMock + 1
      const expectedManageAccessPage = totalPagesMock

      manageAccessPage.value = manageAccessPageMock
      await refreshManageAccessOperations()

      expect(manageAccessPage.value).toStrictEqual(expectedManageAccessPage)
    })
  })

  describe('when call refreshPageCount', () => {
    it('should refresh manageAccessCount properly', async () => {
      const expectedManageAccessCount = totalItemsMock

      manageAccessCount.value = 0
      await refreshPageCount()

      expect(manageAccessCount.value).toStrictEqual(expectedManageAccessCount)
    })
  })
})
