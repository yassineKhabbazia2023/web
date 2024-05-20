import type { DefineDateTimeFormat } from 'vue-i18n'

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
  HISTORY: 'COGES001',
  USERS: 'CLUSER001',
  // Account Permissions
  ACCOUNT_INVOICES: ['CLINVO001', 'COINVO001'],
  ACCOUNT_COLLABORATORS: ['CLUSER001', 'COUSER002'],
  ACCOUNT_USERS: ['CLUSER001', 'COUSER001'],
  ACCOUNT_OFFER: ['CLOFF001', 'COOFF003'],
  ACCOUNT_INFORMATION: ['CLINFO001', 'COINFO001'],
  ACCOUNT_POWERBI_REPORT: ['CLRAPP001', 'CORAPP001'],
  // Action Permissions
  ADD_USERS: 'CLUSER002',
  MODIFY_RIGHTS: ['CLUSER004', 'COADMI003'],
  DELETE_USER: ['CLUSER003', 'COADMI002'],
}
