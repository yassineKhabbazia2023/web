import { isNotNullNorEmpty } from '@pulse/toolbox/utils/validator'

export const getLockStatusLabel = (isLocked: boolean): string => {
  return isLocked === true ? 'Verrouillé' : 'Déverrouillé'
}

export const getLockStatusColor = (isLocked: boolean): 'danger' | 'success' => {
  return isLocked === true ? 'danger' : 'success'
}

export const formatNullableText = (value: string | null): string => {
  return isNotNullNorEmpty(value) ? value : '-'
}
