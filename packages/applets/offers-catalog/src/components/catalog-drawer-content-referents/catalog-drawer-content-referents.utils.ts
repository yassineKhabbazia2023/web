import { useClipboard } from '@vueuse/core'
import { logger } from '@pulse/toolbox'
import { PNotification } from '@pulse/styleguide'
import type { IconName } from '@pulse/styleguide/types'
import type { OfferCatalogReferent } from '../../types/offers-catalog.types'
import { getInitials } from '@pulse/common/utils'

export function getTableReferentsColumns(columnLabels: Record<string, string>) {
  return [{
    columnProp: 'name',
    columnLabel: columnLabels.name,
  }, {
    columnProp: 'hub',
    columnLabel: columnLabels.hub,
  }, {
    columnProp: 'email',
    columnLabel: columnLabels.email,
  }]
}

export function getFormattedReferents(offerReferents?: OfferCatalogReferent[]) {
  return (offerReferents ?? [])
    .map(({ firstName, lastName, region, email }) => ({
      name: `${firstName} ${lastName}`,
      hub: region?.name ?? '',
      email,
      initials: getInitials(firstName, lastName),
    }))
}

export function showNotification(message: string, isSuccess: boolean) {
  const customClass = isSuccess ? 'success' : 'error'
  const iconName: IconName = isSuccess ? 'check' : 'exclamationTriangle'

  PNotification({
    message,
    iconName,
    showClose: true,
    customClass,
    position: 'bottom-left',
  })
}

export function copyColumnContent(
  value: string,
  successMessage: string,
  errorMessage: string,
) {
  const { copy, isSupported } = useClipboard()

  try {
    if (isSupported.value === false) {
      throw new Error('clipboard is not supported')
    }
    copy(value)
    showNotification(successMessage, true)
  } catch (e) {
    logger.error(e)
    showNotification(errorMessage, false)
  }
}
