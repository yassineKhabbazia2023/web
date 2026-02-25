import { logger } from '@pulse/toolbox'
import type { RouteLocationNormalized } from 'vue-router'
import { CurrentEntityManager } from '@pulse/common/managers'
import { fetchEntityById } from '@pulse/common/services/entities'
import type { AccountRow, Entity } from '@pulse/common/types'
import { useCurrentEntityStore, useLoadingStore } from '@pulse/common/stores'
import { RouteName, RouteParam } from '@pulse/common/enums'
import { RouterHelpers } from '@pulse/common/helpers'

export async function currentEntityGuard(to: RouteLocationNormalized, from: RouteLocationNormalized) {
  if (to.params[RouteParam.ENTITY_ID] === undefined) {
    // the route does not require an entity id, exit the guard
    return
  }

  const toEntityId = RouterHelpers.getRouteParamAsInt(to, RouteParam.ENTITY_ID)
  const fromEntityId = RouterHelpers.getRouteParamAsInt(from, RouteParam.ENTITY_ID)

  if (toEntityId === null) {
    logger.trace(`Entity Router Guard - Target route should have a valid Entity Id (${toEntityId}) but does not`)
    return { name: RouteName.ERROR403 }
  }

  if (isEntityAlreadySelected(toEntityId) === true) {
    // everything is fine, the entity is already selected, proceed
    return
  }

  if (toEntityId !== fromEntityId) {
    const loadingStore = useLoadingStore()
    loadingStore.startContentLoading()

    try {
      logger.trace('Entity Router Guard - Fetching entity in guard')
      const entity = await fetchEntityById(toEntityId)
      if (!entity) {
        logger.error(`Entity Router Guard - No entity (${toEntityId}) to load has been found`)
        return { name: RouteName.ERROR403 }
      }

      await CurrentEntityManager.initializeCurrentEntity(entity)

    } catch (error) {
      logger.error(`Entity Router Guard - Error while trying to fetch user entity (${toEntityId})`, error)
      return { name: RouteName.ERROR403 }
    } finally {
      loadingStore.stopContentLoading()
    }
  }

  // if we reach this point, let the user go where they want to go
}

export function findEntityWithId(entities: AccountRow[], entityId: Entity['accountId']) {
  return entities.find(entity => entity.accountId === entityId)
}

export function isEntityAlreadySelected(targetEntityId: Entity['accountId']) {
  const currentEntityStore = useCurrentEntityStore()
  return targetEntityId === currentEntityStore.currentEntityId
}
