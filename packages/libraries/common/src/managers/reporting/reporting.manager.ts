import { ACCOUNT_PERMISSIONS } from '../../constants'
import { FeatureFlagManager } from '@pulse/core'
import { useSelectedEntityStore, useUserStore } from '@pulse/common/stores'
import { CurrentUserManager } from '../current-user/current-user.manager'
import { ReportingService } from '../../services/reporting/reporting.service'

export class ReportingManager {
  static async canShowBIReports() {
    const selectedEntityStore = useSelectedEntityStore()
    if (selectedEntityStore.selectedEntityId === undefined) {
      return false
    }

    const hasPowerBIAccess = CurrentUserManager.hasPermission(ACCOUNT_PERMISSIONS.POWERBI_REPORT)
    if (hasPowerBIAccess !== true) {
      return false
    }

    const totalItems = await ReportingService.getTotalBIReports(selectedEntityStore.selectedEntityId)

    const userStore = useUserStore()
    const hasReports = totalItems > 0
    const isClarityVisible = selectedEntityStore.selectedEntity?.isClarityVisible === true
    const isSignatory = selectedEntityStore.selectedEntity?.isSignatory === true
    const isCollaborator = userStore.isCollab === true

    // Show BI reports if clarity is visible and the current user is a signatory
    const shouldShowBasedOnClarity = isClarityVisible && isSignatory

    // Show BI reports if the user is a collaborator and clarity is visible
    const shouldShowBasedOnCollabAndClarity = isClarityVisible && isCollaborator

    return hasReports || shouldShowBasedOnClarity || shouldShowBasedOnCollabAndClarity
  }

  static canShowSmartOfferWidget() {
    const { selectedEntity } = useSelectedEntityStore()
    const { user } = useUserStore()

    if (selectedEntity === undefined || selectedEntity === null || user === undefined || user === null) {
      return false
    }

    const clarityFeatureActive = FeatureFlagManager.isClarityOfferActivated()
    if (clarityFeatureActive === false || selectedEntity.isClarityVisible === false) {
      return false
    }

    const userHasAccess = user.isCollab === true || selectedEntity.isSignatory === true

    return userHasAccess
  }
}
