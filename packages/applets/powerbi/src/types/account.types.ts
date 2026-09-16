import type { Hub, Office } from '@pulse/common/types'

/** Subset of the `accounts/{accountId}/currentuser` response used by the applet. */
export interface AccountResponse {
  accountId: number
  office?: Office
  hub?: Hub
}
