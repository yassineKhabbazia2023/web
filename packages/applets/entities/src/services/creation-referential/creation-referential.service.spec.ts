import { API_PREFIXES } from '@pulse/common/constants'
import { apiGatewayGetMock } from '@pulse/common/mocks/vitest'
import { CreationReferentialService } from './creation-referential.service'
import type { CreationDropdownContent } from './creation-referential.types'

describe('CreationReferentialService', () => {
  it('should GET the creation referential infos and return the data', async () => {
    const responseData: CreationDropdownContent = {
      contactTitle: { M: 'Monsieur', Mme: 'Madame' },
      contactService: {},
      contactHierarchicalLevel: {},
      contactType: {},
      legalForm: {},
      legalStructure: {},
    }
    apiGatewayGetMock.mockResolvedValueOnce({ data: responseData })

    const result = await CreationReferentialService.fetchCreationDropdownContent()

    expect(apiGatewayGetMock).toHaveBeenCalledWith(`${API_PREFIXES.PROSPECT}/referential-infos`)
    expect(result).toEqual(responseData)
  })

  it('should GET the user creation referential infos and return the data', async () => {
    const responseData: CreationDropdownContent = {
      contactTitle: { M: 'Monsieur', Mme: 'Madame' },
      contactService: {},
      contactHierarchicalLevel: {},
      contactType: {},
      legalForm: {},
      legalStructure: {},
    }
    apiGatewayGetMock.mockResolvedValueOnce({ data: responseData })

    const result = await CreationReferentialService.fetchUserCreationDropdownContent()

    expect(apiGatewayGetMock).toHaveBeenCalledWith(`${API_PREFIXES.REFERENTIAL}/infos`)
    expect(result).toEqual(responseData)
  })
})
