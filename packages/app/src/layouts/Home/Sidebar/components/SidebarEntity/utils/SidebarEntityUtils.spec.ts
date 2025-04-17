import { describe, it, expect, vi } from 'vitest'
import { getMockedFavoriteEntities } from '@app/__mocks__/entities.mocks'

import { getDefaultEntity } from '.'

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
  })
})
