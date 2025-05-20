import { EntityStatus } from '@entities/pages/wallet/components/Filters/FiltersTypes'
import type { DefineDateTimeFormat } from 'vue-i18n'
import { IconName, PFilterOptionProps } from '@pulse/styleguide/types'

export const DATE_TIME_FORMATS = {
  'en-US': {
    short: {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    },
    long: {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    },
  },
  'fr-FR': {
    short: {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    },
    long: {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    },
  },
} as Record<string, DefineDateTimeFormat>

export const PAGE_SIZES = [15, 30, 45, 60]

export const PERMISSION_CODES = {
  // Global Permissions
  MANDATE: 'COMAND001',
  SUBSCRIPTIONS: 'COOFF002',
  COLLABORATORS: 'COADMI001',
  POWERBI_REPORT: 'CORAP001',
  ACCOUNT_MANAGEMENT: 'COADMI004',
  MODIFY_ACCOUNT_RIGHTS: 'COADMI005',
  ENTITY_CREATOR: 'COADMI007',
  HISTORY: 'COGES001',
  USERS: 'CLUSER001',
  LAUNCHER: 'COSILA001',
  // Account Permissions
  ACCOUNT_INVOICES: ['CLINVO001', 'COINVO001'],
  ACCOUNT_COLLABORATORS: ['CLUSER001', 'COUSER002'],
  ACCOUNT_USERS: ['CLUSER001', 'COUSER001'],
  ACCOUNT_OFFER: ['CLOFF001', 'COOFF003'],
  ACCOUNT_INFORMATION: ['CLINFO001', 'COINFO001'],
  ACCOUNT_POWERBI_REPORT: ['CLRAPP001', 'CORAPP001'],
  // Action Permissions
  ADD_USERS: 'CLUSER002',
  MODIFY_RIGHTS_USER: 'CLUSER004',
  MODIFY_RIGHTS_COLLAB: 'COADMI003',
  MANAGE_ACCESS: 'COUSER001',
  DELETE_USER: 'CLUSER003',
  DELETE_COLLAB: 'COADMI002',
  DELETE_ACCOUNT_COLLAB: 'COUSER002',
  COLLAB_REMOVE_USER: 'COUSER003',
  ACTIVATE_OFFER: 'COOFF001',
  EDIT_COMPANY_DATA: 'COINFO002',
}

export const ENTITY_STATUS_COLOR: Record<EntityStatus, PFilterOptionProps['pColor']> = {
  [EntityStatus.TO_DEPLOY]: 'warning',
  [EntityStatus.IN_PROGRESS]: 'fuschia',
  [EntityStatus.CONNECTED]: 'success',
}

export const ENTITY_STATUS_ICON_NAME: Record<EntityStatus, IconName> = {
  [EntityStatus.TO_DEPLOY]: 'arrowUpCircle',
  [EntityStatus.IN_PROGRESS]: 'arrowRepeat',
  [EntityStatus.CONNECTED]: 'checkCircle',
}
