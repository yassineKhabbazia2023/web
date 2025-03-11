import mockedEntities from '@app/__mocks__/entities.mocks.json'
import type { Entity } from '@pulse/common/types'

export const getMockedFavoriteEntities = (): Entity[] => {
  return mockedEntities as Entity[]
}
