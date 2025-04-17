import { setActivePinia, createPinia } from 'pinia'
import { useFavoriteEntitiesStore } from './favorite-entities.store'
import { getMockedEntity } from '@common/__mocks__'

const favoriteEntitiesMock = [
  getMockedEntity(),
  getMockedEntity({
    accountId: 2,
    accountNumber: '3524433298',
    legalName: 'Test 2',
    color: 'cyan',
  }),
]

describe('test favoriteEntitiesStore', () => {
  let favoriteEntitiesStore: ReturnType<typeof useFavoriteEntitiesStore>

  beforeEach(() => {
    setActivePinia(createPinia())

    favoriteEntitiesStore = useFavoriteEntitiesStore()
  })

  it('should set favoriteEntities properly when call setEntities()', () => {
    favoriteEntitiesStore.setFavoriteEntities(favoriteEntitiesMock)

    expect(favoriteEntitiesStore.favoriteEntities).toStrictEqual(favoriteEntitiesMock)
  })
})
