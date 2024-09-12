import mockedEntities from '@app/mocks/entities.mock.json'
import type { Entity } from '@pulse/Common'

export const getMockedFavoriteEntities = (): Entity[] => {
  return mockedEntities as Entity[]
}
