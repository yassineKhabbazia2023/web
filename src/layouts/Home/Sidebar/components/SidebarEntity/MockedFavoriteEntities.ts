import mockedEntities from '@/mocks/entities.mock.json'
import type { Entity } from '@kpmg/common'

export const getMockedFavoriteEntities = (): Entity[] => {
  return mockedEntities as Entity[]
}
