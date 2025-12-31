import {
  currentEntityGuard,
  findEntityWithId,
  isEntityAlreadySelected,
} from './entity.guard'

import {
  getAllMockAccountRows,
  getMockedEntities,
  entitiesServiceMocks,
} from '@pulse/common/mocks'

const accountRows = getAllMockAccountRows()
const entities = getMockedEntities()
import { getStoreMock } from '@pulse/common/mocks/vitest'

import { useCurrentEntityStore } from '@pulse/common/stores'
import { RouteParam } from '@pulse/common/enums'
import { CurrentEntityManager } from '@pulse/common/managers'
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
    await currentEntityGuard(to, from, nextMock)

    expect(fetchEntityByIdMock).not.toHaveBeenCalled()
  })

  it('directly calls next without fetching entities if entityId param is the same between TO and FROM', async () => {
    const routeWithEntityId = createMockedRoute('123')
    await currentEntityGuard(routeWithEntityId, routeWithEntityId, nextMock)

    expect(fetchEntityByIdMock).not.toHaveBeenCalled()
  })

  it('directly calls next without fetching entities if entityId param from TO is the same as stored currentEntityId', async () => {
    const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)
    currentEntityStoreMock.currentEntityId = entities[1].accountId

    const from = createMockedRoute(entities[0].accountId.toString())
    const to = createMockedRoute(entities[1].accountId.toString())
    await currentEntityGuard(to, from, nextMock)

    expect(fetchEntityByIdMock).not.toHaveBeenCalled()
  })

  it('fetches entities when entityId from TO is different than stored currentEntityId', async () => {
    const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)
    currentEntityStoreMock.currentEntityId = entities[1].accountId

    const from = createMockedRoute('')
    const to = createMockedRoute(entities[0].accountId.toString())
    await currentEntityGuard(to, from, nextMock)

    expect(fetchEntityByIdMock).toHaveBeenCalled()
    expect(CurrentEntityManager.initializeCurrentEntity).toHaveBeenCalled()
  })
})

describe('find entity with id', () => {
  it.each([
    {
      accountRowsList: accountRows,
      entityToFind: entities[0].accountId,
      expectedResult: accountRows[0],
    },
    {
      accountRowsList: accountRows,
      entityToFind: 9999, // Non-existent entity ID
      expectedResult: undefined,
    },
  ])('return the entity when it exists among a list of entities', ({ accountRowsList, entityToFind, expectedResult }) => {
    const result = findEntityWithId(accountRowsList, entityToFind)
    expect(result).toBe(expectedResult)
  })
})

describe('is entity already selected', () => {
  it.each([
    {
      testName: 'returns true when stored entity is the same as given entity id',
      storedEntityMock: entities[0],
      givenEntityId: entities[0].accountId,
      expectedResult: true,
    },
    {
      testName: 'returns false when stored entity is different than the given entity id',
      storedEntityMock: entities[0],
      givenEntityId: entities[1].accountId,
      expectedResult: false,
    },
  ])('$testName', ({ storedEntityMock, givenEntityId, expectedResult }) => {
    const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)
    currentEntityStoreMock.currentEntityId = storedEntityMock.accountId
    const result = isEntityAlreadySelected(givenEntityId)

    expect(result).toBe(expectedResult)
  })
})
