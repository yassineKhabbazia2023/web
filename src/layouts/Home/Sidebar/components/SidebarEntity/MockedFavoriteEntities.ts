import mockedEntities from '@/mocks/entities.mock.json'
import type { Entity } from './components/EntityAvatar/EntityAvatarTypes'

export const getMockedFavoriteEntities = (): Entity[] => {
  return mockedEntities as Entity[]
}
