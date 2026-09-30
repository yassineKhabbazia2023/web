import { apiGatewayMock } from '../../__mocks__/vitest'
import { API_PREFIXES } from '../../constants/api-prefixes'
import { HTTP_RESPONSES } from '../../constants/http-responses-status'

import { ContactPreferencesService } from './contact-preferences.service'

const expectedUrl = `${API_PREFIXES.ACCOUNT}/preferences/selected-account`

describe('ContactPreferencesService', () => {
  describe('fetchLastSelectedEntity', () => {
    it('should return the last selected entity when the API answers with content', async () => {
      const lastSelectedEntity = {
        accountId: 42,
        accountNumber: '199900046522',
        legalName: 'Test SCA',
        iconName: 'icon',
      }
      apiGatewayMock.get.mockResolvedValueOnce({ status: HTTP_RESPONSES.OK, data: lastSelectedEntity })

      const result = await ContactPreferencesService.fetchLastSelectedEntity()

      expect(result).toStrictEqual(lastSelectedEntity)
      expect(apiGatewayMock.get).toHaveBeenCalledExactlyOnceWith(expectedUrl)
    })

    it('should return undefined when the API answers no content', async () => {
      apiGatewayMock.get.mockResolvedValueOnce({ status: HTTP_RESPONSES.NO_CONTENT, data: '' })

      const result = await ContactPreferencesService.fetchLastSelectedEntity()

      expect(result).toBeUndefined()
    })

    it('should propagate API errors', async () => {
      const error = new Error('Network error')
      apiGatewayMock.get.mockRejectedValueOnce(error)

      await expect(ContactPreferencesService.fetchLastSelectedEntity()).rejects.toBe(error)
    })
  })

  describe('saveLastSelectedEntity', () => {
    it('should put the selected account id as a query parameter', async () => {
      apiGatewayMock.put.mockResolvedValueOnce({ status: HTTP_RESPONSES.NO_CONTENT })

      await ContactPreferencesService.saveLastSelectedEntity(42)

      expect(apiGatewayMock.put).toHaveBeenCalledExactlyOnceWith(expectedUrl, undefined, { params: { accountId: 42 } })
    })

    it('should propagate API errors', async () => {
      const error = new Error('Network error')
      apiGatewayMock.put.mockRejectedValueOnce(error)

      await expect(ContactPreferencesService.saveLastSelectedEntity(42)).rejects.toBe(error)
    })
  })
})
