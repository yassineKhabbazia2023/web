import {
  currentEntityGuard,
  isEntityAlreadySelected,
  navigateToCurrentEntityHomepage,
} from './current-entity.guard'

import {
  getMockedEntities,
  entitiesServiceMocks,
} from '@pulse/common/mocks'

const entities = getMockedEntities()
import { getStoreMock } from '@pulse/common/mocks/vitest'

import { useCurrentEntityStore, useLoadingStore } from '@pulse/common/stores'
import { AccountType, RouteParam, RouteName } from '@pulse/common/enums'
import { CurrentEntityManager } from '@pulse/common/managers'
import type { RouteLocationNormalizedGeneric, RouteRecordNormalized } from 'vue-router'
vi.mock('@pulse/common/managers')

function makeMatchedRecord(name: RouteName): RouteRecordNormalized {
  return { name } as RouteRecordNormalized
}

function createMockedRoute(entityId?: string, entityRootRouteName?: RouteName): RouteLocationNormalizedGeneric {
  // Mirror the real nested route structure: the authenticated wrapper is matched[0],
  // and the ENTITY/PROSPECT root sits deeper in the chain.
  const matched: RouteRecordNormalized[] = entityRootRouteName !== undefined
    ? [makeMatchedRecord(RouteName.AUTHENTICATED), makeMatchedRecord(entityRootRouteName)]
    : []

  return {
    path: 'route/path',
    name: 'routeName',
    params: {
      ...(entityId !== undefined ? { [RouteParam.ENTITY_ID]: entityId } : {}),
    },
    // necessary properties to satisfy the RouteLocationNormalizedGeneric type
    matched,
    query: {},
    hash: '',
    fullPath: '',
    redirectedFrom: undefined,
    meta: {},
  }
}

const fetchEntityByIdMock = vi.hoisted(() => vi.fn(() => entitiesServiceMocks.fetchEntityById))
vi.mock('@pulse/common/services/entities', () => ({
  fetchEntityById: fetchEntityByIdMock,
}))

describe('verify entity change', () => {
  it('allows navigation without fetching entities if target route doesn\'t contain an entity id in the route params', async () => {
    const from = createMockedRoute('123')
    const to = createMockedRoute()
    const result = await currentEntityGuard(to, from)

    expect(fetchEntityByIdMock).not.toHaveBeenCalled()
    expect(result).toBeUndefined()
  })

  it('allows navigation without fetching entities if entityId param from TO is the same as stored currentEntityId', async () => {
    const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)
    currentEntityStoreMock.currentEntityId = entities[1].accountId

    const from = createMockedRoute(entities[0].accountId.toString())
    const to = createMockedRoute(entities[1].accountId.toString())
    const result = await currentEntityGuard(to, from)

    expect(fetchEntityByIdMock).not.toHaveBeenCalled()
    expect(result).toBeUndefined()
  })

  it('fetches entities when entityId from TO is different than stored currentEntityId', async () => {
    const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)
    currentEntityStoreMock.currentEntityId = entities[1].accountId

    const from = createMockedRoute('')
    const to = createMockedRoute(entities[0].accountId.toString())
    await currentEntityGuard(to, from)

    expect(fetchEntityByIdMock).toHaveBeenCalled()
    expect(CurrentEntityManager.initializeCurrentEntity).toHaveBeenCalled()
  })

  it('calls startContentLoading and stopContentLoading when fetching entity', async () => {
    const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)
    currentEntityStoreMock.currentEntityId = entities[1].accountId
    const loadingStoreMock = getStoreMock(useLoadingStore)

    const from = createMockedRoute('')
    const to = createMockedRoute(entities[0].accountId.toString())
    await currentEntityGuard(to, from)

    expect(loadingStoreMock.startContentLoading).toHaveBeenCalled()
    expect(loadingStoreMock.stopContentLoading).toHaveBeenCalled()
  })

  it('does not call content loading when route does not have entity id', async () => {
    const loadingStoreMock = getStoreMock(useLoadingStore)

    const from = createMockedRoute('123')
    const to = createMockedRoute()
    await currentEntityGuard(to, from)

    expect(loadingStoreMock.startContentLoading).not.toHaveBeenCalled()
  })

  it('does not call content loading when entity is already selected', async () => {
    const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)
    currentEntityStoreMock.currentEntityId = entities[1].accountId
    const loadingStoreMock = getStoreMock(useLoadingStore)

    const from = createMockedRoute(entities[0].accountId.toString())
    const to = createMockedRoute(entities[1].accountId.toString())
    await currentEntityGuard(to, from)

    expect(loadingStoreMock.startContentLoading).not.toHaveBeenCalled()
  })

  it('calls stopContentLoading when entity fetch fails', async () => {
    const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)
    currentEntityStoreMock.currentEntityId = entities[1].accountId
    const loadingStoreMock = getStoreMock(useLoadingStore)
    fetchEntityByIdMock.mockRejectedValueOnce(new Error('Network error'))

    const from = createMockedRoute('')
    const to = createMockedRoute(entities[0].accountId.toString())
    await currentEntityGuard(to, from)

    expect(loadingStoreMock.startContentLoading).toHaveBeenCalled()
    expect(loadingStoreMock.stopContentLoading).toHaveBeenCalled()
  })
})

describe('verify entity change - edge cases', () => {
  it('redirects to ERROR403 when entityId param is not a valid number', async () => {
    const from = createMockedRoute('')
    const to = createMockedRoute('not-a-number')
    const result = await currentEntityGuard(to, from)

    expect(result).toEqual({ name: RouteName.ERROR403 })
    expect(fetchEntityByIdMock).not.toHaveBeenCalled()
  })

  it('redirects to ERROR403 when fetchEntityById returns null', async () => {
    const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)
    currentEntityStoreMock.currentEntityId = entities[1].accountId
    fetchEntityByIdMock.mockResolvedValueOnce(null as never)

    const from = createMockedRoute('')
    const to = createMockedRoute(entities[0].accountId.toString())
    const result = await currentEntityGuard(to, from)

    expect(result).toEqual({ name: RouteName.ERROR403 })
  })

  it('redirects to ERROR403 when fetchEntityById returns undefined', async () => {
    const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)
    currentEntityStoreMock.currentEntityId = entities[1].accountId
    fetchEntityByIdMock.mockResolvedValueOnce(undefined as never)

    const from = createMockedRoute('')
    const to = createMockedRoute(entities[0].accountId.toString())
    const result = await currentEntityGuard(to, from)

    expect(result).toEqual({ name: RouteName.ERROR403 })
  })

  it('redirects to ERROR403 when fetchEntityById throws an error', async () => {
    const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)
    currentEntityStoreMock.currentEntityId = entities[1].accountId
    fetchEntityByIdMock.mockRejectedValueOnce(new Error('API Error'))

    const from = createMockedRoute('')
    const to = createMockedRoute(entities[0].accountId.toString())
    const result = await currentEntityGuard(to, from)

    expect(result).toEqual({ name: RouteName.ERROR403 })
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

describe('navigateToCurrentEntityHomepage', () => {
  it('returns prospect homepage route when account type is PROSPECT', () => {
    const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)
    currentEntityStoreMock.currentEntityId = entities[0].accountId
    currentEntityStoreMock.currentAccountType = AccountType.PROSPECT

    const result = navigateToCurrentEntityHomepage()

    expect(result).toEqual({
      name: RouteName.PROSPECT_HOMEPAGE,
      params: { [RouteParam.ENTITY_ID]: entities[0].accountId },
    })
  })

  it('returns regular homepage route when account type is REGULAR', () => {
    const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)
    currentEntityStoreMock.currentEntityId = entities[0].accountId
    currentEntityStoreMock.currentAccountType = AccountType.REGULAR

    const result = navigateToCurrentEntityHomepage()

    expect(result).toEqual({
      name: RouteName.HOMEPAGE,
      params: { [RouteParam.ENTITY_ID]: entities[0].accountId },
    })
  })

  it('returns ERROR403 when current entity ID is undefined', () => {
    const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)
    currentEntityStoreMock.currentEntityId = undefined

    const result = navigateToCurrentEntityHomepage()

    expect(result).toEqual({ name: RouteName.ERROR403 })
  })

  it('defaults to regular homepage route when account type is unknown', () => {
    const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)
    currentEntityStoreMock.currentEntityId = entities[0].accountId
    currentEntityStoreMock.currentAccountType = 'unknown' as AccountType

    const result = navigateToCurrentEntityHomepage()

    expect(result).toEqual({
      name: RouteName.HOMEPAGE,
      params: { [RouteParam.ENTITY_ID]: entities[0].accountId },
    })
  })
})

describe('currentEntityGuard - account type mismatch on URL tampering', () => {
  it('redirects to prospect homepage when /dossier/:id is accessed with a prospect entity (already selected)', async () => {
    const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)
    currentEntityStoreMock.currentEntityId = entities[0].accountId
    currentEntityStoreMock.currentAccountType = AccountType.PROSPECT

    const from = createMockedRoute('')
    const to = createMockedRoute(entities[0].accountId.toString(), RouteName.ENTITY)
    const result = await currentEntityGuard(to, from)

    expect(fetchEntityByIdMock).not.toHaveBeenCalled()
    expect(result).toEqual({
      name: RouteName.PROSPECT_HOMEPAGE,
      params: { [RouteParam.ENTITY_ID]: entities[0].accountId },
    })
  })

  it('redirects to regular homepage when /contact/:id is accessed with a regular entity (already selected)', async () => {
    const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)
    currentEntityStoreMock.currentEntityId = entities[0].accountId
    currentEntityStoreMock.currentAccountType = AccountType.REGULAR

    const from = createMockedRoute('')
    const to = createMockedRoute(entities[0].accountId.toString(), RouteName.PROSPECT)
    const result = await currentEntityGuard(to, from)

    expect(fetchEntityByIdMock).not.toHaveBeenCalled()
    expect(result).toEqual({
      name: RouteName.HOMEPAGE,
      params: { [RouteParam.ENTITY_ID]: entities[0].accountId },
    })
  })
})
