export const AZURE_DEVOPS_CONFIG = {
  organization: 'https://dev.azure.com/FR-TPEME',
  project: 'PULSE',
  repository: 'PULSE.WEB',
} as const

export const AZURE_DEVOPS_API_VERSION = '7.1'

export const MAX_COMMITS_SAFETY_LIMIT = 5000
export const COMMITS_PAGE_SIZE = 100

// Work item states considered as completed
export const WORK_ITEM_COMPLETED_STATES = ['Validated', 'Closed'] as const

// Work item type colors for display
export const WORK_ITEM_TYPE_COLORS = {
  'User Story': 'info',
  'Enabler Story': 'orange',
  'Bug': 'danger',
  'Task': 'warning',
  'Feature': 'success',
  'Epic': 'purple',
} as const

// Work item state colors for display
export const WORK_ITEM_STATE_COLORS = {
  'New': 'info',
  'Active': 'info',
  'In Progress': 'warning',
  'Resolved': 'success',
  'Validated': 'success',
  'Closed': 'success',
  'Done': 'success',
  'Removed': 'danger',
} as const
