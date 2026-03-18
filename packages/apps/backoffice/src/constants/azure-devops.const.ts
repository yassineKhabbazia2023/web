export const AZURE_DEVOPS_CONFIG = {
  organization: 'https://dev.azure.com/FR-TPEME',
  project: 'PULSE',
  repository: 'Pulse.Web',
} as const

export const AZURE_DEVOPS_API_VERSION = '7.1'

export const MAX_COMMITS_SAFETY_LIMIT = 5000
export const COMMITS_PAGE_SIZE = 100
export const EXPLORER_PAGE_SIZE = 30

// Contribution graph
export const CONTRIBUTION_GRAPH_WEEKS = 13
export const CONTRIBUTION_REPO_CONCURRENCY = 5
export const CONTRIBUTION_RECENT_ACTIVITY_COUNT = 10

// Work item states considered as completed
export const WORK_ITEM_COMPLETED_STATES = ['Validated', 'Closed', 'Released', 'Resolved'] as const

// Work item type colors for display
export const WORK_ITEM_TYPE_COLORS = {
  'User Story': 'info',
  'Enabler Story': 'orange',
  'Bug': 'danger',
  'Task': 'warning',
  'Feature': 'success',
  'Epic': 'purple',
} as const

// PR Completion Time
export const PR_COMPLETION_PAGE_SIZE = 100
export const PR_COMPLETION_REPO_CONCURRENCY = 5
export const PR_COMPLETION_MAX_PRS_PER_REPO = 1000
export const FRONT_REPO_NAME = 'Pulse.Web'

// Work item state colors for display
export const WORK_ITEM_STATE_COLORS = {
  'New': 'warning',
  'Active': 'warning',
  'Ready for test': 'warning',
  'Ready for check': 'warning',
  'In Progress': 'warning',
  'Resolved': 'success',
  'Validated': 'success',
  'Closed': 'dark-green',
  'Released': 'success',
  'Done': 'success',
  'Removed': 'danger',
} as const
