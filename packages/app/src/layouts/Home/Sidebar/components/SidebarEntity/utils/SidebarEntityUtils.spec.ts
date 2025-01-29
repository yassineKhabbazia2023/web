import { describe, it, expect, vi } from 'vitest'
import { getMockedFavoriteEntities } from '../MockedFavoriteEntities'
import { getDefaultEntity } from '.'
import type { Entity } from '@pulse/common/types'

vi.mock('@app/helper', () => ({
  getRandomColor: vi.fn(() => 'orange'),
}))

const mockedFavoriteEntities = getMockedFavoriteEntities()
const firstEntity = mockedFavoriteEntities[0]
const secondEntity = mockedFavoriteEntities[1]

describe('utils', () => {
  describe('getDefaultEntity', () => {
    it('should retrieve the default entity from localStorage if it exists', () => {
      const getItemSpy = vi
        .spyOn(Storage.prototype, 'getItem')
        .mockReturnValue(JSON.stringify(secondEntity))
      const activeEntity = getDefaultEntity(firstEntity)

      expect(getItemSpy).toHaveBeenCalledOnce()
      expect(getItemSpy).toHaveBeenNthCalledWith(1, 'selected-entity')
      expect(activeEntity).toStrictEqual(secondEntity)
    })

    it("should return first entity if there's no entity in localStorage", () => {
      const getItemSpy = vi
        .spyOn(Storage.prototype, 'getItem')
        .mockReturnValue(null)
      const activeEntity = getDefaultEntity(firstEntity)

      expect(getItemSpy).toHaveBeenCalledOnce()
      expect(getItemSpy).toHaveBeenNthCalledWith(1, 'selected-entity')
      expect(activeEntity).toStrictEqual(firstEntity)
    })

    it("should return an empty entity if there's no entity", () => {
      vi
        .spyOn(Storage.prototype, 'getItem')
        .mockReturnValue(null)
      const expectedEntity: Entity = {
        accountId: 0,
        accountNumber: '',
        legalName: '',
        color: 'orange',
      }
      const activeEntity = getDefaultEntity()

      expect(activeEntity).toStrictEqual(expectedEntity)
    })
  })
})
