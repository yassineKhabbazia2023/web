import type { ContactWithRoles, SubscriptionOfferServices } from '@entities/types'
import type { AccountSignatories } from '@entities/services/account/account.type'
import { OffersDrawerStep } from '@entities/enums'
import { get, setWith } from 'lodash-es'
import { addPathValue } from '@entities/services/patch-record/patch-record.service'
import { SubscriptionOfferCode } from '@pulse/common/enums'
import { type Account } from '@entities/services/account'
import { type PatchValue } from '@entities/services/patch-record'
import { HAS_NO_SIREN_FIELD_KEY } from '@entities/constants'

export function getHasNoSignatory(
  currentStep: OffersDrawerStep,
  principalContacts: AccountSignatories[],
  currentSubscriptionOffer: SubscriptionOfferServices,
) {
  const isInstantOffer = currentSubscriptionOffer.approvalRequired !== true &&
    currentSubscriptionOffer.offerCode !== SubscriptionOfferCode.RFINANCE
  const needSignatory = currentStep === OffersDrawerStep.CUSTOMERS || isInstantOffer

  return needSignatory && principalContacts.length === 0
}

export function signatoryMissingPhone(
  currentStep: OffersDrawerStep,
  principalContacts: AccountSignatories[],
  currentSubscriptionOffer: SubscriptionOfferServices,
) {
  const isCustomersStep = currentStep === OffersDrawerStep.CUSTOMERS
  const isPennylaneOffer = currentSubscriptionOffer.offerCode === SubscriptionOfferCode.PENNYLANE
  const hasMissingPhone = principalContacts.some(
    (c) => c.mobilePhone === '' || c.mobilePhone === undefined || c.mobilePhone === null,
  )

  return isCustomersStep && isPennylaneOffer && hasMissingPhone
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
  principalContacts: AccountSignatories[],
}) {
  if (currentSubscriptionOffer === undefined) {
    return true
  }

  const hasNoSignatory = getHasNoSignatory(
    currentStep,
    principalContacts,
    currentSubscriptionOffer,
  )

  const hasSignatoryWithMissingPhone = signatoryMissingPhone(currentStep, principalContacts, currentSubscriptionOffer)

  if (hasNoSignatory || hasSignatoryWithMissingPhone) {
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
  if (fieldKey === HAS_NO_SIREN_FIELD_KEY) {
    if (account !== undefined) {
      setWith(account, fieldKey, fieldValue, Object)
    }
    return account
  }

  const previousValue = get(account, fieldKey)
  addPathValue(patchValues, fieldKey, previousValue, fieldValue)
  if (account !== undefined) {
    setWith(account, fieldKey, fieldValue, Object)
  }
  return account
}
