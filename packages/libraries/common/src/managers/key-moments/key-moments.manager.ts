import { logger } from '@pulse/toolbox'
import { useCurrentEntityStore, useUserStore } from '@pulse/common/stores'
import { FeatureFlagManager } from '../feature-flag/feature-flag.manager'
import { PublishedKeyMomentsService } from '../../services/key-moments/key-moments.service'

export class KeyMomentsManager {
  /**
   * Whether the key moments entry belongs in the navigation.
   *
   * The two surfaces read it differently: the firm arbitrates the key moment,
   * so its entry stays reachable on an account it has published nothing on yet,
   * where the client only gets the entry once there is something to read — an
   * entry leading to an empty screen would take a call to understand.
   */
  static async canShowKeyMoments(): Promise<boolean> {
    if (FeatureFlagManager.isKeyMomentsActivated() === false) {
      return false
    }

    const userStore = useUserStore()
    if (userStore.isCollab === true) {
      return true
    }

    const currentEntityStore = useCurrentEntityStore()
    if (currentEntityStore.currentEntityId === undefined) {
      return false
    }

    try {
      return await PublishedKeyMomentsService.hasPublishedKeyMoments(currentEntityStore.currentEntityId)
    } catch (error) {
      // An absence (404/403) and a real failure lead to the same place: no
      // entry. Warn rather than raise — nothing is broken for the reader.
      logger.warn('[KeyMoments] unable to know whether the account has a published key moment', error)

      return false
    }
  }
}
