import { getMockedFavoriteEntities } from '@pulse/common/mocks'

const mockedEntities = getMockedFavoriteEntities()

const fetchEntitiesMock = vi.fn(() => ({
  items: mockedEntities,
}))
const fetchFavoriteEntitiesMock = vi.fn(() => ({
  items: mockedEntities,
}))

export const entitiesServiceMock = {
  fetchEntities: fetchEntitiesMock,
  fetchFavoriteEntities: fetchFavoriteEntitiesMock,
}
