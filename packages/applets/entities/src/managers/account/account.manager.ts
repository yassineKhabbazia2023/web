import { createCustomer, addContactToEntity, fetchAccountContactsByEmail } from '../../services/account/account.service'
import { type createCustomerBody } from '../../services/account/account.service'
import { logger } from '@pulse/toolbox'
import { HTTP_RESPONSES } from '@pulse/common/constants'

export class AccountManager {
  static async createOrAddCustomerToAccount(
    customer: createCustomerBody,
    accountId: number,
    accountNumber: string,
  ): Promise<number | undefined> {
    const { email } = customer

    try {
      const user = await createCustomer(customer, accountNumber)

      return user.id
    } catch (error: any) {
      if (error?.response?.status === HTTP_RESPONSES.CONFLICT) {
        try {
          await addContactToEntity(accountId, email)

          // retrieve the user from their email
          const { items } = await fetchAccountContactsByEmail(accountId, email)
          const user = items.at(0)

          return user?.contactId
        } catch (e) {
          logger.warn(`Failed to add contact to entity, accountId = ${accountId}, email = ${email}`, e)
        }
      } else {
        logger.warn(`Failed create user for account, accountId = ${accountId}, email = ${email}`, error)
      }
    }
  }
}
