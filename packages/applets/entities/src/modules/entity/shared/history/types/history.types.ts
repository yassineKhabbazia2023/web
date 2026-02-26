export interface ActivityUser {
  userId: number
  userType: 'Collaborator' | 'Customer'
  name: string
  email: string
}

export interface ActivityAccount {
  accountId: number
  legalName: string
  accountNumber: string
}

export interface ActivityCategory {
  categoryId: number
  name: string
  themeId: number
  theme: {
    themeId: number
    name: string
  }
}

export interface ActivityAction {
  actionId: number
  code: string
  label: string
  type: string
  visibility: 'CollaboratorOnly' | 'CustomerOnly' | 'All'
  categoryId: number
  category: ActivityCategory
}

export interface Activity {
  activityId: number
  label: string
  creationDate: string
  details: string
  actionId: number
  userId: number
  targetUserId: number | null
  accountId: number
  account: ActivityAccount
  action: ActivityAction
  targetUser: ActivityUser | null
  user: ActivityUser
}

export interface ActivitiesResponse {
  items: Activity[]
  totalItems: number
  currentPage: number
  totalPages: number
}

export interface ActivitySearchCriteria {
  accountId: number
  page: number
  pageSize: number
}
