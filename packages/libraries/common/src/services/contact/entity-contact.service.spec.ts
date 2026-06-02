import { logger } from '@pulse/toolbox'
import { api } from '@pulse/common/api'
import { CollaboratorRole, ContactType } from '@pulse/common/enums'
import { API_PREFIXES } from '@pulse/common/constants'
import type { ContactResponseItem } from './contact.types'

import { EntityContactService } from './entity-contact.service'

vi.mock('@pulse/toolbox')
vi.mock('@pulse/common/api')
vi.mock('../../api/interceptors/request-token.interceptor')

const accountId = 42

const buildApiItem = (overrides: Partial<ContactResponseItem> = {}): ContactResponseItem => ({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  mobilePhone: '0600000000',
  personaName: 'Account manager',
  labels: [{ code: CollaboratorRole.CLP, collaboratorLabel: 'Maitre dossier' }],
  ...overrides,
})

describe('EntityContactService', () => {
  describe('getProspectContacts', () => {
    it('should call the customer-wallet contacts endpoint filtered by Collaborator type', async () => {
      vi.mocked(api.gateway.get).mockResolvedValueOnce({ data: { items: [] } })

      await EntityContactService.getProspectContacts(accountId)

      expect(vi.mocked(api.gateway.get)).toHaveBeenCalledExactlyOnceWith(
        `${API_PREFIXES.CUSTOMER_WALLET}/accounts/${accountId}/contacts`,
        { params: { Type: ContactType.COLLABORATOR } },
      )
    })

    it('should keep only contacts having a CLP or AM label code and emit the front-forced role i18n key, ignoring the backend collaboratorLabel', async () => {
      const clpContact = buildApiItem({
        firstName: 'Anna',
        lastName: 'Smith',
        personaName: 'ESC',
        mobilePhone: '0611111111',
        email: 'anna@example.com',
        labels: [
          { code: 'HM', collaboratorLabel: 'Hierarchical manager' },
          // Intentionally inconsistent backend label: it must be overridden by the front-forced label
          { code: CollaboratorRole.CLP, collaboratorLabel: 'Backend CLP label' },
        ],
      })
      const amContact = buildApiItem({
        firstName: 'Bob',
        lastName: 'Stone',
        personaName: 'Account master',
        mobilePhone: '0622222222',
        email: 'bob@example.com',
        // Intentionally inconsistent backend label: it must be overridden by the front-forced label
        labels: [{ code: CollaboratorRole.AM, collaboratorLabel: 'Maitre dossier' }],
      })
      const otherCollab = buildApiItem({
        firstName: 'Eve',
        lastName: 'Doe',
        labels: [
          { code: 'HM', collaboratorLabel: 'Hierarchical manager' },
          { code: 'AC', collaboratorLabel: 'Accountant' },
        ],
      })
      const withoutLabels = buildApiItem({
        firstName: 'No',
        lastName: 'Label',
        labels: [],
      })

      vi.mocked(api.gateway.get).mockResolvedValueOnce({
        data: { items: [clpContact, amContact, otherCollab, withoutLabels] },
      })

      const result = await EntityContactService.getProspectContacts(accountId)

      expect(result).toStrictEqual([
        {
          firstname: 'Anna',
          lastname: 'Smith',
          role: 'widgets.contacts.roles.clp',
          phoneNumber: '0611111111',
          email: 'anna@example.com',
        },
        {
          firstname: 'Bob',
          lastname: 'Stone',
          role: 'widgets.contacts.roles.am',
          phoneNumber: '0622222222',
          email: 'bob@example.com',
        },
      ])
    })

    it('should display the account manager (CLP) first then the account master (AM), whatever the API order', async () => {
      const amContact = buildApiItem({
        firstName: 'Bob',
        lastName: 'Stone',
        email: 'bob@example.com',
        labels: [{ code: CollaboratorRole.AM, collaboratorLabel: 'Maitre dossier' }],
      })
      const clpContact = buildApiItem({
        firstName: 'Anna',
        lastName: 'Smith',
        email: 'anna@example.com',
        labels: [{ code: CollaboratorRole.CLP, collaboratorLabel: 'Responsable de compte' }],
      })

      vi.mocked(api.gateway.get).mockResolvedValueOnce({
        data: { items: [amContact, clpContact] },
      })

      const result = await EntityContactService.getProspectContacts(accountId)

      expect(result.map(contact => contact.role)).toStrictEqual([
        'widgets.contacts.roles.clp',
        'widgets.contacts.roles.am',
      ])
    })

    it('should filter out contacts whose labels field is missing', async () => {
      vi.mocked(api.gateway.get).mockResolvedValueOnce({
        data: {
          items: [
            buildApiItem({ labels: undefined }),
          ],
        },
      })

      const result = await EntityContactService.getProspectContacts(accountId)

      expect(result).toStrictEqual([])
    })

    it('should fall back to landPhone when mobilePhone is missing', async () => {
      vi.mocked(api.gateway.get).mockResolvedValueOnce({
        data: {
          items: [
            buildApiItem({
              mobilePhone: undefined,
              landPhone: '0140000000',
            }),
          ],
        },
      })

      const [contact] = await EntityContactService.getProspectContacts(accountId)

      expect(contact.phoneNumber).toBe('0140000000')
    })

    it('should emit the role i18n key from the code even when the backend collaboratorLabel is empty', async () => {
      vi.mocked(api.gateway.get).mockResolvedValueOnce({
        data: {
          items: [
            buildApiItem({
              labels: [{ code: CollaboratorRole.CLP, collaboratorLabel: '' }],
            }),
          ],
        },
      })

      const [contact] = await EntityContactService.getProspectContacts(accountId)

      expect(contact.role).toBe('widgets.contacts.roles.clp')
    })

    it('should default phoneNumber to empty string when both phones are missing', async () => {
      vi.mocked(api.gateway.get).mockResolvedValueOnce({
        data: {
          items: [
            buildApiItem({
              mobilePhone: undefined,
              landPhone: undefined,
            }),
          ],
        },
      })

      const [contact] = await EntityContactService.getProspectContacts(accountId)

      expect(contact.phoneNumber).toBe('')
    })

    it('should return an empty array and log the error when the API call fails', async () => {
      const error = new Error('boom')
      vi.mocked(api.gateway.get).mockRejectedValueOnce(error)

      const result = await EntityContactService.getProspectContacts(accountId)

      expect(result).toStrictEqual([])
      expect(vi.mocked(logger.error)).toHaveBeenCalledExactlyOnceWith(
        expect.any(String),
        error,
      )
    })

    it('should return an empty array when the response items are missing', async () => {
      vi.mocked(api.gateway.get).mockResolvedValueOnce({ data: {} })

      const result = await EntityContactService.getProspectContacts(accountId)

      expect(result).toStrictEqual([])
    })
  })
})
