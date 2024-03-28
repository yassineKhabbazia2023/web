import { describe, it, vi, expect } from 'vitest'
import { API_PREFIXES } from '../config'
import { getCollaboratorsByIdEntity } from '.'
import { mockCollabsData } from '@/pages/folder/pages/collaborators/mockData'

const idEntity = '5'

const mockGatewayGet = vi.fn(() => {
  return Promise.resolve({
    data: mockCollabsData,
  })
})

vi.mock('@kpmg/common', () => ({
  commonApi: () => ({
    gateway: {
      get: mockGatewayGet,
    },
  }),
}))

describe('wallet', () => {
  describe('getCollaboratorsByIdEntity', () => {
    it('should return list of collaborators', async () => {
      const collaborators = await getCollaboratorsByIdEntity(idEntity)

      expect(collaborators).toStrictEqual(mockCollabsData)

      expect(mockGatewayGet)
        .toHaveBeenNthCalledWith(1, `${API_PREFIXES.CUSTOMER_WALLER}/accounts/${idEntity}/contacts?Type=Collaborator`)
    })
  })
})
