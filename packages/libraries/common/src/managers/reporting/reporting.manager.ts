import { ACCOUNT_PERMISSIONS } from '../../constants'
import { FeatureFlagManager } from '../feature-flag/feature-flag.manager'
import { useCurrentEntityStore, useUserStore } from '@pulse/common/stores'
import { CurrentUserManager } from '../current-user/current-user.manager'
import { ReportingService } from '../../services/reporting/reporting.service'
import { VITE_SMART_OFFER_DIFFERENT_RATE_ACCOUNTS, VITE_SMART_OFFER_DIFFERENT_RATE_PRICE } from 'env-vars'

export class ReportingManager {
  static readonly SMART_OFFER_DEFAULT_PRICE = '30'

  static async canShowBIReports() {
    const currentEntityStore = useCurrentEntityStore()
    if (currentEntityStore.currentEntityId === undefined) {
      return false
    }

    const hasPowerBIAccess = CurrentUserManager.hasPermission(ACCOUNT_PERMISSIONS.POWERBI_REPORT)
    if (hasPowerBIAccess !== true) {
      return false
    }

    const totalItems = await ReportingService.getTotalBIReports(currentEntityStore.currentEntityId)

    const userStore = useUserStore()
    const hasReports = totalItems > 0
    const isClarityVisible = currentEntityStore.currentEntity?.isClarityVisible === true
    const isSignatory = currentEntityStore.currentEntity?.isSignatory === true
    const isCollaborator = userStore.isCollab === true

    // Show BI reports if clarity is visible and the current user is a signatory
    const shouldShowBasedOnClarity = isClarityVisible && isSignatory

    // Show BI reports if the user is a collaborator and clarity is visible
    const shouldShowBasedOnCollabAndClarity = isClarityVisible && isCollaborator

    return hasReports || shouldShowBasedOnClarity || shouldShowBasedOnCollabAndClarity
  }

  static canShowSmartOfferWidget() {
    const { currentEntity } = useCurrentEntityStore()
    const { user } = useUserStore()

    if (currentEntity === undefined || currentEntity === null || user === undefined || user === null) {
      return false
    }

    const clarityFeatureActive = FeatureFlagManager.isClarityOfferActivated()
    if (clarityFeatureActive === false || currentEntity.isClarityVisible === false) {
      return false
    }

    const userHasAccess = user.isCollab === true || currentEntity.isSignatory === true

    return userHasAccess
  }

  static calculateSmartOfferPrice() {
    const { currentEntity } = useCurrentEntityStore()

    if (currentEntity?.accountNumber === undefined || currentEntity?.accountNumber === null) {
      return this.SMART_OFFER_DEFAULT_PRICE
    }

    // Clarity POC: Temporary client-side calculation — will be refactored to backend logic soon.
    const smartOfferPrice = VITE_SMART_OFFER_DIFFERENT_RATE_PRICE
    const accountsWithDifferentRate = VITE_SMART_OFFER_DIFFERENT_RATE_ACCOUNTS?.split(',') || []

    if (accountsWithDifferentRate.includes(currentEntity.accountNumber)) {
      return smartOfferPrice
    }

    return this.SMART_OFFER_DEFAULT_PRICE
  }
}
