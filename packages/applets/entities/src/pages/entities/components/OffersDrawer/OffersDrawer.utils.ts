import { ContactWithRoles } from '../ManageCollaborators/ManageCollaboratorsTypes'
import { ClientContact } from '../PrincipalContact/PrincipalContactTypes'
import { SubscriptionOfferServices } from '../SubscriptionOffers/SubscriptionOffersTypes'
import { OffersDrawerStep } from './OffersDrawer.enums'
import { get, setWith } from 'lodash-es'
import { addPathValue } from '@entities/services/PatchRecordService/PatchRecordService'
import { type Account } from '@entities/services/account'
import { type PatchValue } from '@entities/services/PatchRecordService'

export function getHasNoSignatory(
  currentStep: OffersDrawerStep,
  principalContacts: ClientContact[],
  currentSubscriptionOffer: SubscriptionOfferServices,
) {
  const needSignatory = currentStep === OffersDrawerStep.CUSTOMERS || !currentSubscriptionOffer.approvalRequired

  return needSignatory && principalContacts.length === 0
}

export function getIsNoCollaboratorSelected(
  currentStep: OffersDrawerStep,
  selectedCollaboratorsWithRoles: ContactWithRoles[],
) {
  return currentStep === OffersDrawerStep.COLLABORATORS &&
    selectedCollaboratorsWithRoles.length === 0
}

export function getIsAllCollaboratorRoleSelected(
  currentSubscriptionOffer: SubscriptionOfferServices,
  selectedCollaboratorsWithRoles: ContactWithRoles[],
) {
  const { functions: collaboratorRoles } = currentSubscriptionOffer
  const roleIds = selectedCollaboratorsWithRoles.flatMap(({ roleIds }) => roleIds)

  const isAllCollaboratorRoleSelected = roleIds.length === (collaboratorRoles?.length ?? 0)

  return isAllCollaboratorRoleSelected
}

export function getIsMissingCollaboratorRole(
  currentSubscriptionOffer: SubscriptionOfferServices,
  selectedCollaboratorsWithRoles: ContactWithRoles[],
) {
  const { functions: collaboratorRoles } = currentSubscriptionOffer
  if ((collaboratorRoles?.length ?? 0) === 0) {
    return false
  }
  const hasCollaboratorWithoutRole = selectedCollaboratorsWithRoles.some(({ roleIds }) => roleIds.length === 0)

  return hasCollaboratorWithoutRole
}

export function getIsNextButtonDisabled({
  currentSubscriptionOffer,
  currentStep,
  selectedCollaboratorsWithRoles,
  principalContacts,
}: {
  currentSubscriptionOffer?: SubscriptionOfferServices,
  currentStep: OffersDrawerStep,
  selectedCollaboratorsWithRoles: ContactWithRoles[],
  principalContacts: ClientContact[],
}) {
  if (currentSubscriptionOffer === undefined) {
    return true
  }

  const hasNoSignatory = getHasNoSignatory(
    currentStep,
    principalContacts,
    currentSubscriptionOffer,
  )
  if (hasNoSignatory) {
    return true
  }

  const isNoCollaboratorSelected = getIsNoCollaboratorSelected(currentStep, selectedCollaboratorsWithRoles)
  if (isNoCollaboratorSelected) {
    return true
  }

  if (currentStep === OffersDrawerStep.COLLABORATORS) {
    const isMissingCollaboratorRole = getIsMissingCollaboratorRole(
      currentSubscriptionOffer,
      selectedCollaboratorsWithRoles,
    )
    if (isMissingCollaboratorRole) {
      return true
    }

    const isAllCollaboratorRoleSelected = getIsAllCollaboratorRoleSelected(
      currentSubscriptionOffer,
      selectedCollaboratorsWithRoles,
    )
    if (!isAllCollaboratorRoleSelected) {
      return true
    }
  }

  return false
}

export function updateAccountOnInput(
  fieldKey: string,
  fieldValue: any,
  patchValues: PatchValue[],
  account?: Account,
) {
  const previousValue = get(account, fieldKey)
  addPathValue(patchValues, fieldKey, previousValue, fieldValue)
  if (account !== undefined) {
    setWith(account, fieldKey, fieldValue, Object)
  }
  return account
}
