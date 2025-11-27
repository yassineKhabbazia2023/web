import { loggerMock } from '@pulse/toolbox/mocks'
import { getMockedUserApi } from '@pulse/common/mocks'
import { createCustomer, addContactToEntity, fetchAccountContactsByEmail } from '../../services/account/accountServices'
import { HTTP_RESPONSES } from '@pulse/common/constants'

import { AccountManager } from './account.manager'

vi.mock('@pulse/toolbox', () => ({
  logger: loggerMock,
}))
vi.mock('../../services/account/accountServices')
const createCustomerMock = vi.mocked(createCustomer)
const addContactToEntityMock = vi.mocked(addContactToEntity)
const fetchAccountContactsByEmailMock = vi.mocked(fetchAccountContactsByEmail)

describe('AccountManager', () => {
  describe('createOrAddCustomerToAccount', () => {
    const accountId = 234
    const accountNumberMock = '432101'
    const newCustomerMock = getMockedUserApi()
    const customer = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      mobilePhone: '065432101',
    }

    it('should return newCustomerId when is does not exist', async () => {
      const expectedParams = [
        customer,
        accountNumberMock,
      ]

      createCustomerMock.mockResolvedValue(newCustomerMock)
      const newCustomerId = await AccountManager.createOrAddCustomerToAccount(customer, accountId, accountNumberMock)

      expect(createCustomerMock).toHaveBeenCalledOnce()
      expect(createCustomerMock).toHaveBeenCalledWith(...expectedParams)

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
      const newCustomerId = await AccountManager.createOrAddCustomerToAccount(customer, accountId, accountNumberMock)

      expect(addContactToEntityMock).toHaveBeenCalledOnce()
      expect(addContactToEntityMock).toHaveBeenCalledWith(...expectedParams)

      expect(fetchAccountContactsByEmailMock).toHaveBeenCalledOnce()
      expect(fetchAccountContactsByEmailMock).toHaveBeenCalledWith(...expectedParams)

      expect(newCustomerId).toStrictEqual(contactIdMock)
    })

    it('should not return customerId when something wrong occurs', async () => {
      const errorMock = 'error mock'

      createCustomerMock.mockRejectedValue(errorMock)

      const newCustomerId = await AccountManager.createOrAddCustomerToAccount(customer, accountId, accountNumberMock)

      expect(addContactToEntityMock).not.toHaveBeenCalled()
      expect(fetchAccountContactsByEmailMock).not.toHaveBeenCalled()
      expect(newCustomerId).toBeUndefined()
    })
  })
})
