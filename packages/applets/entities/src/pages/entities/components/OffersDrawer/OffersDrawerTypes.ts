import type { UserInfo } from '@pulse/common/types'

export interface OffersDrawerProps {
  modelValue: boolean
  selectedCompanyName: string
  accountNumber: string
  accountId: number
  currentUser: UserInfo
}
