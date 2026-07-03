import { logger } from '@pulse/toolbox'
import { api } from '@pulse/common/api'
import { CollaboratorRole } from '@pulse/common/enums'
import { API_PREFIXES } from '@pulse/common/constants'
import { useUserStore } from '@pulse/common/stores'
import { getStoreMock } from '@pulse/common/mocks/vitest'
import type { ContactResponseItem } from './contact.types'

import { EntityContactService } from './entity-contact.service'

vi.mock('@pulse/toolbox')
vi.mock('@pulse/common/api')
vi.mock('../../api/interceptors/request-token.interceptor')

const accountId = 42

const userStoreMock = getStoreMock(useUserStore)

const buildApiItem = (overrides: Partial<ContactResponseItem> = {}): ContactResponseItem => ({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  mobilePhone: '0600000000',
  personaName: 'Account manager',
  labels: [{ code: CollaboratorRole.CLP, collaboratorLabel: 'Responsable de compte', customerLabel: 'Mon conseiller' }],
  ...overrides,
})

describe('EntityContactService', () => {
  beforeEach(() => {
    // Default the viewer to a collaborator user; individual tests override when needed.
    userStoreMock.isCollab = true
  })

  describe('getProspectContacts', () => {
    it('should call the account contacts endpoint', async () => {
      vi.mocked(api.gateway.get).mockResolvedValueOnce({ data: [] })

      await EntityContactService.getProspectContacts(accountId)

      expect(vi.mocked(api.gateway.get)).toHaveBeenCalledExactlyOnceWith(
        `${API_PREFIXES.ACCOUNT}/prospects/${accountId}/contacts/currentuser`,
      )
    })

    it('should keep only contacts having a CLP or AM label code and use the backend collaboratorLabel for a collaborator user', async () => {
      const clpContact = buildApiItem({
        firstName: 'Anna',
        lastName: 'Smith',
        personaName: 'ESC',
        mobilePhone: '0611111111',
        email: 'anna@example.com',
        labels: [
          { code: 'HM', collaboratorLabel: 'Hierarchical manager' },
          { code: CollaboratorRole.CLP, collaboratorLabel: 'Responsable de compte', customerLabel: 'Mon conseiller' },
        ],
      })
      const amContact = buildApiItem({
        firstName: 'Bob',
        lastName: 'Stone',
        personaName: 'Account master',
        mobilePhone: '0622222222',
        email: 'bob@example.com',
        labels: [{ code: CollaboratorRole.AM, collaboratorLabel: 'Maître de dossier', customerLabel: 'Mon gestionnaire' }],
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
        data: [clpContact, amContact, otherCollab, withoutLabels],
      })

      const result = await EntityContactService.getProspectContacts(accountId)

      expect(result).toStrictEqual([
        {
          firstname: 'Anna',
          lastname: 'Smith',
          role: 'Responsable de compte',
          phoneNumber: '0611111111',
          email: 'anna@example.com',
        },
        {
          firstname: 'Bob',
          lastname: 'Stone',
          role: 'Maître de dossier',
          phoneNumber: '0622222222',
          email: 'bob@example.com',
        },
      ])
    })

    it('should use the backend customerLabel for a customer user', async () => {
      userStoreMock.isCollab = false

      vi.mocked(api.gateway.get).mockResolvedValueOnce({
        data: [
          buildApiItem({
            labels: [{ code: CollaboratorRole.CLP, collaboratorLabel: 'Responsable de compte', customerLabel: 'Mon conseiller' }],
          }),
        ],
      })

      const [contact] = await EntityContactService.getProspectContacts(accountId)

      expect(contact.role).toBe('Mon conseiller')
    })

    it('should display the account manager (CLP) first then the account master (AM), whatever the API order', async () => {
      const amContact = buildApiItem({
        firstName: 'Bob',
        lastName: 'Stone',
        email: 'bob@example.com',
        labels: [{ code: CollaboratorRole.AM, collaboratorLabel: 'Maître de dossier' }],
      })
      const clpContact = buildApiItem({
        firstName: 'Anna',
        lastName: 'Smith',
        email: 'anna@example.com',
        labels: [{ code: CollaboratorRole.CLP, collaboratorLabel: 'Responsable de compte' }],
      })

      vi.mocked(api.gateway.get).mockResolvedValueOnce({
        data: [amContact, clpContact],
      })

      const result = await EntityContactService.getProspectContacts(accountId)

      expect(result.map(contact => contact.role)).toStrictEqual([
        'Responsable de compte',
        'Maître de dossier',
      ])
    })

    it('should keep one contact with one role unchanged when the user appears once', async () => {
      vi.mocked(api.gateway.get).mockResolvedValueOnce({
        data: [
          buildApiItem({
            firstName: 'Anna',
            lastName: 'Smith',
            email: 'anna@example.com',
            labels: [{ code: CollaboratorRole.CLP, collaboratorLabel: 'Responsable de compte' }],
          }),
        ],
      })

      const result = await EntityContactService.getProspectContacts(accountId)

      expect(result).toStrictEqual([
        {
          firstname: 'Anna',
          lastname: 'Smith',
          role: 'Responsable de compte',
          phoneNumber: '0600000000',
          email: 'anna@example.com',
        },
      ])
    })

    it('should merge distinct roles from multiple labels on the same contact', async () => {
      vi.mocked(api.gateway.get).mockResolvedValueOnce({
        data: [
          buildApiItem({
            firstName: 'Oussema',
            lastName: 'Ben Amor',
            email: 'obenamor@rydge.fr',
            landPhone: '',
            mobilePhone: '0123456789',
            labels: [
              {
                code: CollaboratorRole.CLP,
                customerLabel: 'Responsable de Compte',
                collaboratorLabel: 'Responsable de Compte',
              },
              {
                code: CollaboratorRole.AM,
                customerLabel: 'Maître de Dossier',
                collaboratorLabel: 'Maître de Dossier',
              },
            ],
          }),
        ],
      })

      const result = await EntityContactService.getProspectContacts(accountId)

      expect(result).toStrictEqual([
        {
          firstname: 'Oussema',
          lastname: 'Ben Amor',
          role: 'Responsable de Compte | Maître de Dossier',
          phoneNumber: '0123456789',
          email: 'obenamor@rydge.fr',
        },
      ])
    })

    it('should not duplicate identical role labels from the same contact labels', async () => {
      vi.mocked(api.gateway.get).mockResolvedValueOnce({
        data: [
          buildApiItem({
            firstName: 'Anna',
            lastName: 'Smith',
            email: 'anna@example.com',
            labels: [
              { code: CollaboratorRole.CLP, collaboratorLabel: 'Responsable de compte' },
              { code: CollaboratorRole.CLP, collaboratorLabel: 'Responsable de compte' },
            ],
          }),
        ],
      })

      const result = await EntityContactService.getProspectContacts(accountId)

      expect(result).toStrictEqual([
        {
          firstname: 'Anna',
          lastname: 'Smith',
          role: 'Responsable de compte',
          phoneNumber: '0600000000',
          email: 'anna@example.com',
        },
      ])
    })

    it('should keep separate cards for different contacts', async () => {
      const firstContact = buildApiItem({
        firstName: 'Anna',
        lastName: 'Smith',
        email: 'anna@example.com',
        labels: [{ code: CollaboratorRole.CLP, collaboratorLabel: 'Responsable de compte' }],
      })
      const secondContact = buildApiItem({
        firstName: 'Anna',
        lastName: 'Smith',
        email: 'anna.other@example.com',
        labels: [{ code: CollaboratorRole.CLP, collaboratorLabel: 'Responsable de compte' }],
      })

      vi.mocked(api.gateway.get).mockResolvedValueOnce({
        data: [firstContact, secondContact],
      })

      const result = await EntityContactService.getProspectContacts(accountId)

      expect(result).toStrictEqual([
        {
          firstname: 'Anna',
          lastname: 'Smith',
          role: 'Responsable de compte',
          phoneNumber: '0600000000',
          email: 'anna@example.com',
        },
        {
          firstname: 'Anna',
          lastname: 'Smith',
          role: 'Responsable de compte',
          phoneNumber: '0600000000',
          email: 'anna.other@example.com',
        },
      ])
    })

    it('should filter out contacts whose labels field is missing', async () => {
      vi.mocked(api.gateway.get).mockResolvedValueOnce({
        data: [
          buildApiItem({ labels: undefined }),
        ],
      })

      const result = await EntityContactService.getProspectContacts(accountId)

      expect(result).toStrictEqual([])
    })

    it('should fall back to landPhone when mobilePhone is missing', async () => {
      vi.mocked(api.gateway.get).mockResolvedValueOnce({
        data: [
          buildApiItem({
            mobilePhone: undefined,
            landPhone: '0140000000',
          }),
        ],
      })

      const [contact] = await EntityContactService.getProspectContacts(accountId)

      expect(contact.phoneNumber).toBe('0140000000')
    })

    it('should fall back to mobilePhone when landPhone is an empty string', async () => {
      vi.mocked(api.gateway.get).mockResolvedValueOnce({
        data: [
          buildApiItem({
            landPhone: '',
            mobilePhone: '0600000000',
          }),
        ],
      })

      const [contact] = await EntityContactService.getProspectContacts(accountId)

      expect(contact.phoneNumber).toBe('0600000000')
    })

    it('should default phoneNumber to empty string when both phones are empty strings', async () => {
      vi.mocked(api.gateway.get).mockResolvedValueOnce({
        data: [
          buildApiItem({
            landPhone: '',
            mobilePhone: '',
          }),
        ],
      })

      const [contact] = await EntityContactService.getProspectContacts(accountId)

      expect(contact.phoneNumber).toBe('')
    })

    it('should default the role to an empty string when the label for the user type is missing', async () => {
      vi.mocked(api.gateway.get).mockResolvedValueOnce({
        data: [
          buildApiItem({
            labels: [{ code: CollaboratorRole.CLP, customerLabel: 'Mon conseiller' }],
          }),
        ],
      })

      const [contact] = await EntityContactService.getProspectContacts(accountId)

      expect(contact.role).toBe('')
    })

    it('should default phoneNumber to empty string when both phones are missing', async () => {
      vi.mocked(api.gateway.get).mockResolvedValueOnce({
        data: [
          buildApiItem({
            mobilePhone: undefined,
            landPhone: undefined,
          }),
        ],
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

    it('should return an empty array when the response data is missing', async () => {
      vi.mocked(api.gateway.get).mockResolvedValueOnce({ data: undefined })

      const result = await EntityContactService.getProspectContacts(accountId)

      expect(result).toStrictEqual([])
    })
  })
})
