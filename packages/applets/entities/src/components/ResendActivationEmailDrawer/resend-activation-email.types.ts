import type { MaybeRefOrGetter } from 'vue'
import type { AccountType } from '@pulse/common/enums'

export interface UseResendActivationEmailOptions {
  accountId: MaybeRefOrGetter<number>
  accountType: MaybeRefOrGetter<AccountType>
  // Called after the invitation request has resolved to refresh the users list
  refreshUsers: () => Promise<void>
}
