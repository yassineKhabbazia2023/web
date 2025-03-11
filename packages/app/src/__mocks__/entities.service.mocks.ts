import mockedEntities from '@app/__mocks__/entities.mocks.json'

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
