import mockedEntities from '@app/mocks/entities.mock.json'
import type { Entity } from '@pulse/common/types'

export const getMockedFavoriteEntities = (): Entity[] => {
  return mockedEntities as Entity[]
}
