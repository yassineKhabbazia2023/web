import { updateCustomerRelation } from '@entities/services/account'
import type { UpdateCustomerRelationResponse } from '@entities/services/account'
import type { SelectedFolder } from '../DelegationDrawer/DelegationDrawerTypes'
import type {
  BulkCustomerRelationNotification,
  BulkCustomerRelationTranslations,
} from './bulk-customer-relation-drawer.types'

export class BulkCustomerRelationManager {
  static isAlreadyInTargetStatus(folder: SelectedFolder, targetCustomerRelationStatus: boolean): boolean {
    return folder.isCustomerRelation === targetCustomerRelationStatus
  }

  static async updateSelectedFolders(
    selectedFolderIds: number[],
    targetCustomerRelationStatus: boolean,
  ): Promise<UpdateCustomerRelationResponse> {
    return await updateCustomerRelation(
      selectedFolderIds,
      targetCustomerRelationStatus,
    )
  }

  static getActionableFolderIds(
    selectedFolders: SelectedFolder[],
    targetCustomerRelationStatus: boolean,
  ): number[] {
    return selectedFolders
      .filter(folder => this.isAlreadyInTargetStatus(folder, targetCustomerRelationStatus) === false)
      .map(({ id }) => id)
  }

  static getNotification(
    response: UpdateCustomerRelationResponse,
    translations: BulkCustomerRelationTranslations,
  ): BulkCustomerRelationNotification {
    if (response.failed.length === 0 && response.succeeded.length > 0) {
      return {
        type: 'success',
        message: translations.success,
      }
    }

    if (response.succeeded.length > 0) {
      return {
        type: 'warning',
        message: translations.partialSuccess,
      }
    }

    return {
      type: 'error',
      message: translations.failure,
    }
  }
}
