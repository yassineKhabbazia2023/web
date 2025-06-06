import {
  selectedEntityGuard,
  findEntityWithId,
  isEntityAlreadySelected,
} from './entity.guard'

import {
  accountsRowMock,
  entitiesFromAccountsRow,
  entitiesNotInAccountsRow,
  getStoreMock,
  entitiesServiceMocks,
} from '@pulse/common/mocks'

import { useSelectedEntityStore } from '@pulse/common/stores'
import { RouteParam } from '@pulse/common/enums'
import { SelectedEntityManager } from '@pulse/common/managers'
import { RouteLocationNormalizedGeneric } from 'vue-router'
vi.mock('@pulse/common/managers')

function createMockedRoute(entityId: string): RouteLocationNormalizedGeneric {
  return {
    path: 'route/path',
    name: 'routeName',
    params: {
      [RouteParam.ENTITY_ID]: entityId,
    },
    // necessary properties to satisfy the RouteLocationNormalizedGeneric type
    matched: [],
    query: {},
    hash: '',
    fullPath: '',
    redirectedFrom: undefined,
    meta: {},
  }
}
const nextMock = vi.fn()

const fetchEntityByIdMock = vi.hoisted(() => vi.fn(() => entitiesServiceMocks.fetchEntityById))
vi.mock('@pulse/common/services/entities', () => ({
  fetchEntityById: fetchEntityByIdMock,
}))

describe('verify entity change', () => {
  it('directly calls next without fetching entities if target route doesn\'t contain an entity id in the route params', async () => {
    const from = createMockedRoute('123')
    const to = createMockedRoute('')
    await selectedEntityGuard(to, from, nextMock)

    expect(fetchEntityByIdMock).not.toHaveBeenCalled()
  })

  it('directly calls next without fetching entities if entityId param is the same between TO and FROM', async () => {
    const routeWithEntityId = createMockedRoute('123')
    await selectedEntityGuard(routeWithEntityId, routeWithEntityId, nextMock)

    expect(fetchEntityByIdMock).not.toHaveBeenCalled()
  })

  it('directly calls next without fetching entities if entityId param from TO is the same as stored selectedEntityId', async () => {
    const selectedEntityStoreMock = getStoreMock(useSelectedEntityStore)
    selectedEntityStoreMock.selectedEntityId = entitiesFromAccountsRow[1].accountId

    const from = createMockedRoute(entitiesFromAccountsRow[0].accountId.toString())
    const to = createMockedRoute(entitiesFromAccountsRow[1].accountId.toString())
    await selectedEntityGuard(to, from, nextMock)

    expect(fetchEntityByIdMock).not.toHaveBeenCalled()
  })

  it('fetches entities when entityId from TO is different than stored selectedEntityId', async () => {
    const selectedEntityStoreMock = getStoreMock(useSelectedEntityStore)
    selectedEntityStoreMock.selectedEntityId = entitiesFromAccountsRow[1].accountId

    const from = createMockedRoute('')
    const to = createMockedRoute(entitiesFromAccountsRow[0].accountId.toString())
    await selectedEntityGuard(to, from, nextMock)

    expect(fetchEntityByIdMock).toHaveBeenCalled()
    expect(SelectedEntityManager.initializeSelectedEntity).toHaveBeenCalled()
  })
})

describe('find entity with id', () => {
  it.each([
    {
      entities: accountsRowMock,
      entityToFind: entitiesFromAccountsRow[0].accountId,
      expectedResult: accountsRowMock[0],
    },
    {
      entities: accountsRowMock,
      entityToFind: entitiesNotInAccountsRow[0].accountId,
      expectedResult: undefined,
    },
  ])('return the entity when it exists among a list of entities', ({ entities, entityToFind, expectedResult }) => {
    const result = findEntityWithId(entities, entityToFind)
    expect(result).toBe(expectedResult)
  })
})

describe('is entity already selected', () => {
  it.each([
    {
      testName: 'returns true when stored entity is the same as given entity id',
      storedEntityMock: entitiesFromAccountsRow[0],
      givenEntityId: entitiesFromAccountsRow[0].accountId,
      expectedResult: true,
    },
    {
      testName: 'returns false when stored entity is different than the given entity id',
      storedEntityMock: entitiesFromAccountsRow[0],
      givenEntityId: entitiesFromAccountsRow[1].accountId,
      expectedResult: false,
    },
  ])('$testName', ({ storedEntityMock, givenEntityId, expectedResult }) => {
    const selectedEntityStoreMock = getStoreMock(useSelectedEntityStore)
    selectedEntityStoreMock.selectedEntityId = storedEntityMock.accountId
    const result = isEntityAlreadySelected(givenEntityId)

    expect(result).toBe(expectedResult)
  })
})
