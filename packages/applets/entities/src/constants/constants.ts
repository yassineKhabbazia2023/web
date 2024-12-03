import { EntityStatus } from '@entities/pages/wallet/components/Filters/FiltersTypes'
import type { DefineDateTimeFormat } from 'vue-i18n'
import { PFilterOptionProps } from '@pulse/styleguide/types'

export const DATE_TIME_FORMATS = {
  'en-US': {
    short: {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    },
  },
  'fr-FR': {
    short: {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
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
  ACTIVATE_OFFER: 'COOFF001',
  EDIT_COMPANY_DATA: 'COINFO002',
}

export const ENTITY_STATUS_COLOR: Record<EntityStatus, PFilterOptionProps['pColor']> = {
  [EntityStatus.TO_DEPLOY]: 'warning',
  [EntityStatus.IN_PROGRESS]: 'amethyste',
  [EntityStatus.CONNECTED]: 'success',
}

export const ENTITY_STATUS_ICON_NAME: Record<EntityStatus, string> = {
  [EntityStatus.TO_DEPLOY]: 'PIArrowUpCircle',
  [EntityStatus.IN_PROGRESS]: 'PIArrowRepeat',
  [EntityStatus.CONNECTED]: 'PICheckCircle',
}
