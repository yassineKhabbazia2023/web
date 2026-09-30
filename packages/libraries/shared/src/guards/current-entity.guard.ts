import { logger } from '@pulse/toolbox'
import type { RouteLocationNormalized } from 'vue-router'
import { CurrentEntityManager } from '@pulse/common/managers'
import { fetchEntityById } from '@pulse/common/services/entities'
import type { Entity } from '@pulse/common/types'
import { useCurrentEntityStore, useLoadingStore } from '@pulse/common/stores'
import { AccountType, RouteName, RouteParam } from '@pulse/common/enums'
import { RouterHelpers } from '@pulse/common/helpers'

export async function currentEntityGuard(to: RouteLocationNormalized, from: RouteLocationNormalized) {
  if (to.params[RouteParam.ENTITY_ID] === undefined) {
    // the route does not require an entity id, exit the guard
    return
  }

  const toEntityId = RouterHelpers.getRouteParamAsInt(to, RouteParam.ENTITY_ID)

  if (toEntityId === null) {
    logger.trace(`Entity Router Guard - Target route should have a valid Entity Id (${toEntityId}) but does not`)
    return { name: RouteName.ERROR403 }
  }

  const isTargetEntityAlreadySelected = isEntityAlreadySelected(toEntityId)
  const expectedAccountType = getExpectedAccountType(to)

  if (isTargetEntityAlreadySelected === false) {
    const loadingStore = useLoadingStore()
    loadingStore.startContentLoading()

    try {
      logger.trace(`Entity Router Guard - Fetching entity ${toEntityId} in guard`)
      const entity = await fetchEntityById(toEntityId)
      if (entity === null || entity === undefined) {
        logger.error(`Entity Router Guard - No entity (${toEntityId}) to load has been found`)
        return { name: RouteName.ERROR403 }
      }

      await CurrentEntityManager.initializeCurrentEntity(entity, {
        shouldFetchInvoicesAccess: expectedAccountType === AccountType.REGULAR,
        shouldSaveLastSelectedEntity: true,
      })

    } catch (error) {
      logger.error(`Entity Router Guard - Error while trying to fetch user entity (${toEntityId})`, error)
      return { name: RouteName.ERROR403 }
    } finally {
      loadingStore.stopContentLoading()
    }
  }

  // Prevents accessing /dossier/:id with a prospect id (and vice-versa) by URL tampering.
  const currentAccountType = useCurrentEntityStore().currentAccountType
  if (expectedAccountType !== undefined && currentAccountType !== expectedAccountType) {
    logger.warn(
      `Entity Router Guard - User tried to access wrong entity type (expected ${expectedAccountType}, got ${currentAccountType}) for entity ${toEntityId}`,
    )
    return navigateToCurrentEntityHomepage()
  }

  if (
    isTargetEntityAlreadySelected === true &&
    expectedAccountType === AccountType.REGULAR &&
    isEnteringRegularEntityContext(to, from)
  ) {
    const currentEntity = useCurrentEntityStore().currentEntity
    if (currentEntity !== undefined) {
      await CurrentEntityManager.fetchInvoicesAccess(currentEntity)
    }
  }
}

function isEnteringRegularEntityContext(to: RouteLocationNormalized, from: RouteLocationNormalized) {
  const isTargetRegularEntityRoute = RouterHelpers.hasProvidedAncestor({ route: to, ancestorName: RouteName.ENTITY })
  const isSourceRegularEntityRoute = RouterHelpers.hasProvidedAncestor({ route: from, ancestorName: RouteName.ENTITY })

  return isTargetRegularEntityRoute === true && isSourceRegularEntityRoute === false
}

function getExpectedAccountType(route: RouteLocationNormalized): AccountType | undefined {
  if (RouterHelpers.hasProvidedAncestor({ route, ancestorName: RouteName.ENTITY })) {
    return AccountType.REGULAR
  }

  if (RouterHelpers.hasProvidedAncestor({ route, ancestorName: RouteName.PROSPECT })) {
    return AccountType.PROSPECT
  }
}

export function isEntityAlreadySelected(targetEntityId: Entity['accountId']) {
  const currentEntityStore = useCurrentEntityStore()
  return targetEntityId === currentEntityStore.currentEntityId
}

export function navigateToCurrentEntityHomepage() {
  const currentEntityStore = useCurrentEntityStore()
  const currentEntityId = currentEntityStore.currentEntityId
  const currentAccountType = currentEntityStore.currentAccountType

  if (currentEntityId === undefined) {
    logger.error('Entity Router Guard - No current entity ID available for homepage redirect')
    return { name: RouteName.ERROR403 }
  }

  switch (currentAccountType) {
    case AccountType.PROSPECT:
      return {
        name: RouteName.PROSPECT_HOMEPAGE,
        params: { [RouteParam.ENTITY_ID]: currentEntityId },
      }
    case AccountType.REGULAR:
    default:
      return {
        name: RouteName.HOMEPAGE,
        params: { [RouteParam.ENTITY_ID]: currentEntityId },
      }
  }
}
