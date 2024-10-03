import mockedEntities from '@app/mocks/entities.mock.json'
import type { Entity } from '@pulse/common'

export const getMockedFavoriteEntities = (): Entity[] => {
  return mockedEntities as Entity[]
}
