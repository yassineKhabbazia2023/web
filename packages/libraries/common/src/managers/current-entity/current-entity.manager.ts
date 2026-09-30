import type { EntitySummary } from '@pulse/common/types'
import { useCurrentEntityStore } from '@pulse/common/stores'
import { AccountType } from '@pulse/common/enums'
import { logger } from '@pulse/toolbox'
import { usePermissionsStore } from '../../stores/permissions/permissions.store'
import { useInvoicesAccessStore } from '../../stores/invoices-access/invoices-access.store'
import { useKeyMomentsAccessStore } from '../../stores/key-moments-access/key-moments-access.store'
import { fetchUserAccountPermissions } from '../../services/permissions/permissions.service'
import { InvoicesAccessService } from '../../services/invoices-access/invoices-access.service'
import { KeyMomentsManager } from '../key-moments/key-moments.manager'
import { ContactPreferencesService } from '../../services/contact-preferences/contact-preferences.service'

interface InitializeCurrentEntityOptions {
  shouldFetchInvoicesAccess?: boolean
  shouldSaveLastSelectedEntity?: boolean
}

export class CurrentEntityManager {
  static async initializeCurrentEntity(
    entity: EntitySummary,
    options: InitializeCurrentEntityOptions = {},
  ) {
    const { accountId } = entity
    const shouldFetchInvoicesAccess = options.shouldFetchInvoicesAccess ?? false
    const shouldSaveLastSelectedEntity = options.shouldSaveLastSelectedEntity ?? false

    const permissionsStore = usePermissionsStore()
    const userAccountPermissions = await fetchUserAccountPermissions(accountId)
    permissionsStore.setCurrentEntityPermissions(userAccountPermissions)

    const currentEntityStore = useCurrentEntityStore()
    currentEntityStore.setCurrentEntity(entity)

    if (shouldSaveLastSelectedEntity) {
      CurrentEntityManager.saveLastSelectedEntity(entity)
    }

    // Read here rather than by each surface that offers the entry — the sidebar
    // and the homepage widget — so the dossier is only asked once. Not awaited:
    // this runs inside the route guard and nothing on the page waits for it,
    // the entry appears when the answer comes back.
    CurrentEntityManager.fetchKeyMomentsAccess(entity)

    if (shouldFetchInvoicesAccess === false) {
      return
    }

    await CurrentEntityManager.fetchInvoicesAccess(entity)
  }

  static async fetchInvoicesAccess(entity: EntitySummary) {
    const invoicesAccessStore = useInvoicesAccessStore()

    // Prospect entities have no invoicing folder
    if (entity.accountType === AccountType.PROSPECT) {
      invoicesAccessStore.reset()
      return
    }

    try {
      const accessData = await InvoicesAccessService.fetchInvoicesAccess(entity.accountId)
      invoicesAccessStore.setAccessData(entity.accountId, accessData)
    } catch (error) {
      logger.error('Failed to fetch invoices access data', error)
      invoicesAccessStore.setAccessData(entity.accountId, null)
    }
  }

  static async fetchKeyMomentsAccess(entity: EntitySummary) {
    const keyMomentsAccessStore = useKeyMomentsAccessStore()

    // The previous dossier's answer doesn't apply here; the entry shows until this one answers
    keyMomentsAccessStore.reset()

    // Prospect entities never carry a key moment
    if (entity.accountType === AccountType.PROSPECT) {
      return
    }

    // Reads the entity in context, so it can only be called once the store holds it
    const canShowKeyMoments = await KeyMomentsManager.canShowKeyMoments()

    // Not awaited by the guard, so check the dossier hasn't changed before writing this late answer
    if (useCurrentEntityStore().currentEntityId !== entity.accountId) {
      return
    }

    keyMomentsAccessStore.setCanShowKeyMoments(canShowKeyMoments)
  }

  /**
   * Returns the id of the entity the contact selected last, persisted server-side.
   * Resolves undefined when there is no selection, when it is no longer accessible, or when
   * it could not be read: the caller then falls back to the first entity of the wallet.
   */
  static async getLastSelectedEntityId(): Promise<number | undefined> {
    try {
      const lastSelectedEntity = await ContactPreferencesService.fetchLastSelectedEntity()

      return lastSelectedEntity?.accountId
    } catch (error) {
      logger.error('Failed to fetch the last selected entity', error)
      return undefined
    }
  }

  static async saveLastSelectedEntity(entity: EntitySummary): Promise<void> {
    // The server-side preference only covers regular entities: a prospect is never selectable there
    if (entity.accountType === AccountType.PROSPECT) {
      return
    }

    try {
      await ContactPreferencesService.saveLastSelectedEntity(entity.accountId)
    } catch (error) {
      logger.error(`Failed to save the last selected entity ${entity.accountId}`, error)
    }
  }

  static clearCurrentEntity() {
    // remove current entity from the store
    const currentEntityStore = useCurrentEntityStore()
    currentEntityStore.setCurrentEntity()
    // remove current entity permissions from the store
    const permissionsStore = usePermissionsStore()
    permissionsStore.setCurrentEntityPermissions([])
    // reset invoices access store
    const invoicesAccessStore = useInvoicesAccessStore()
    invoicesAccessStore.reset()
    // reset key moments access store
    const keyMomentsAccessStore = useKeyMomentsAccessStore()
    keyMomentsAccessStore.reset()
  }
}
