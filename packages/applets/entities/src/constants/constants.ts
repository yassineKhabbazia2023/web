import { EntityStatus } from '@entities/pages/wallet/components/Filters/FiltersTypes'
import type { DefineDateTimeFormat } from 'vue-i18n'
import { IconName, PFilterOptionProps } from '@pulse/styleguide/types'
import { ReportTypeEnum, ReportTypeLabelEnum } from '@entities/common/types/BIReports.enums'
import { ReportTypeTag } from '@entities/pages/wallet/pages/biReportsList/components/ReportErrorDrawer/components/ReportErrorCard/report-error-card.type'

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
  LAUNCHER: ['COSILA001', 'COPEN001'],
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

export const REPORT_TYPES: Record<ReportTypeEnum, ReportTypeTag> = {
  [ReportTypeEnum.LOOP]: { text: ReportTypeLabelEnum.LOOP, iconName: 'loopColor' },
  [ReportTypeEnum.SILAE]: { text: ReportTypeLabelEnum.SILAE, iconName: 'silaeColor' },
  [ReportTypeEnum.FORMS]: { text: ReportTypeLabelEnum.FORMS, iconName: 'clipboardData' },
  [ReportTypeEnum.PAYFIT]: { text: ReportTypeLabelEnum.PAYFIT, iconName: 'payfit' },
  [ReportTypeEnum.PENNYLANE]: { text: ReportTypeLabelEnum.PENNYLANE, iconName: 'pennylaneColor' },
  [ReportTypeEnum.ESC]: { text: ReportTypeLabelEnum.ESC, iconName: 'clipboardData' },
  [ReportTypeEnum.RH]: { text: ReportTypeLabelEnum.RH, iconName: 'clipboardData' },
  [ReportTypeEnum.AUT]: { text: ReportTypeLabelEnum.AUT, iconName: 'clipboardData' },
  [ReportTypeEnum.UNKNOWN]: { text: ReportTypeLabelEnum.UNKNOWN, iconName: 'clipboardData' },
}
