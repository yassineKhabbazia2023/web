import { getMockedUserApi } from '@pulse/common/mocks'
import { createCustomer, addContactToEntity, fetchAccountContactsByEmail } from '../../services/account/account.service'
import { HTTP_RESPONSES } from '@pulse/common/constants'
import { AccountType } from '@pulse/common/enums'
import type { UserInfoApi } from '@pulse/common/types'
import type { AxiosResponse } from 'axios'
import type { CreateCustomerRequest } from '../../services/account/create-customer.types'

import { AccountManager } from './account.manager'

const createCustomerMock = vi.mocked(createCustomer)
const addContactToEntityMock = vi.mocked(addContactToEntity)
const fetchAccountContactsByEmailMock = vi.mocked(fetchAccountContactsByEmail)

beforeEach(() => {
  createCustomerMock.mockResolvedValue(undefined as unknown as UserInfoApi)
  addContactToEntityMock.mockResolvedValue(undefined as unknown as AxiosResponse)
  fetchAccountContactsByEmailMock.mockResolvedValue(undefined)
})

describe('AccountManager', () => {
  describe('createOrAddCustomerToAccount', () => {
    const accountId = 234
    const accountNumberMock = '432101'
    const accountTypeMock = AccountType.REGULAR
    const newCustomerMock = getMockedUserApi()
    const customer: CreateCustomerRequest = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      mobilePhone: '065432101',
      title: 'M',
    }

    it('should return newCustomerId when is does not exist', async () => {
      const expectedParams = [
        customer,
        accountNumberMock,
        accountTypeMock,
      ]

      createCustomerMock.mockResolvedValue(newCustomerMock)
      const newCustomerId = await AccountManager.createOrAddCustomerToAccount(customer, accountId, accountNumberMock, accountTypeMock)

      expect(createCustomerMock).toHaveBeenCalledExactlyOnceWith(...expectedParams)

      expect(newCustomerId).toStrictEqual(newCustomerMock.id)
    })

    it('should return customerId when is does exist but not associated with account', async () => {
      const contactIdMock = 7543
      const expectedParams = [
        accountId,
        customer.email,
      ]

      createCustomerMock.mockRejectedValue({
        response: {
          status: HTTP_RESPONSES.CONFLICT,
        },
      })
      fetchAccountContactsByEmailMock.mockResolvedValue({
        items: [{
          contactId: contactIdMock,
        }],
      })
      const newCustomerId = await AccountManager.createOrAddCustomerToAccount(customer, accountId, accountNumberMock, accountTypeMock)

      expect(addContactToEntityMock).toHaveBeenCalledExactlyOnceWith(...expectedParams)

      expect(fetchAccountContactsByEmailMock).toHaveBeenCalledExactlyOnceWith(...expectedParams)

      expect(newCustomerId).toStrictEqual(contactIdMock)
    })

    it('should rethrow the error when the server returns an unprocessable entity (422)', async () => {
      const errorMock = {
        response: {
          status: HTTP_RESPONSES.UNPROCESSABLE_ENTITY,
          data: { errorMessage: 'Email domain is not allowed' },
        },
      }

      createCustomerMock.mockRejectedValue(errorMock)

      await expect(
        AccountManager.createOrAddCustomerToAccount(customer, accountId, accountNumberMock, accountTypeMock),
      ).rejects.toBe(errorMock)

      expect(addContactToEntityMock).not.toHaveBeenCalled()
      expect(fetchAccountContactsByEmailMock).not.toHaveBeenCalled()
    })

    it('should not return customerId when something wrong occurs', async () => {
      const errorMock = 'error mock'

      createCustomerMock.mockRejectedValue(errorMock)

      const newCustomerId = await AccountManager.createOrAddCustomerToAccount(customer, accountId, accountNumberMock, accountTypeMock)

      expect(addContactToEntityMock).not.toHaveBeenCalled()
      expect(fetchAccountContactsByEmailMock).not.toHaveBeenCalled()
      expect(newCustomerId).toBeUndefined()
    })
  })
})
