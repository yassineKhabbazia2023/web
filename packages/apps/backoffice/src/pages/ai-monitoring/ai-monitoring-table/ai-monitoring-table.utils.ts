import type { IconName, PTagProps } from '@pulse/styleguide/types'
import { AppColors } from '@pulse/styleguide'
import type { AiSearchHistoryUser, SubFeatureType } from '@backoffice/types/ai-monitoring.type'

export function getSubFeatureIcon(subFeature: SubFeatureType): IconName {
  const iconMap: Record<SubFeatureType, IconName> = {
    Recherche: 'search',
    Explication: 'questionCircle',
    Vente: 'currencyEuro',
    Autres: 'threeDots',
  }
  return iconMap[subFeature] ?? 'chatSquareDots'
}

export function getSubFeatureColor(subFeature: SubFeatureType): PTagProps['pColor'] {
  const colorMap: Record<SubFeatureType, PTagProps['pColor']> = {
    Recherche: 'light-green',
    Explication: 'light-blue',
    Vente: 'purple',
    Autres: 'tranquil',
  }
  return colorMap[subFeature] ?? 'light-gray'
}

export function hasUserFullName(user: AiSearchHistoryUser): boolean {
  return user.first_name !== null && user.last_name !== null
}

export function getUserFullName(user: AiSearchHistoryUser): string {
  if (hasUserFullName(user) === false) {
    return ''
  }
  return `${user.first_name} ${user.last_name}`
}

export function formatCost(cost: number): string {
  return `${cost.toFixed(4)} €`
}

export function formatDurationInSeconds(timeInSeconds: number): string {
  return timeInSeconds.toFixed(2)
}

export function getEvaluationIcon(evaluation: boolean): IconName {
  return evaluation === true ? 'thumbsUp' : 'thumbsDown'
}

export function getEvaluationColor(evaluation: boolean): string {
  return evaluation === true ? AppColors.ICON_SUCCESS : AppColors.ICON_ERROR
}
