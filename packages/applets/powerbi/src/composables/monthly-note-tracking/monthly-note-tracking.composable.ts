import { logger } from '@pulse/toolbox'
import { useUserStore } from '@pulse/common/stores'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import { fetchAccount } from '@powerbi/services/account.service'
import type { Report } from '@powerbi/types/bi-reports.types'
import type { AccountResponse } from '@powerbi/types/account.types'
import {
  MONTHLY_NOTE_DISPLAY_EVENT,
  MONTHLY_NOTE_DISPLAY_PROPERTIES,
  MONTHLY_NOTE_REPORT_TYPE_NAME,
} from './monthly-note-tracking.consts'

/**
 * Emits the `NoteMensuelle Display` Amplitude event each time a customer displays the monthly note report.
 * The tracking never blocks the display: when the account cannot be fetched, the event is sent with empty properties.
 */
export function useMonthlyNoteTracking() {
  const userStore = useUserStore()

  // The account is fetched once per account: the same report is displayed several times on the page
  let accountRequest: Promise<AccountResponse | undefined> | undefined
  let requestedAccountId: number | undefined

  const loadAccount = (accountId: number) => {
    if (accountRequest === undefined || requestedAccountId !== accountId) {
      requestedAccountId = accountId
      accountRequest = fetchAccount(accountId).catch((error: unknown) => {
        logger.error('Unable to fetch the account for the monthly note tracking', error)

        return undefined
      })
    }

    return accountRequest
  }

  const trackMonthlyNoteDisplayed = async (report: Report) => {
    const isMonthlyNoteReport = report.type.name === MONTHLY_NOTE_REPORT_TYPE_NAME

    if (userStore.isCustomer === false || isMonthlyNoteReport === false) {
      return
    }

    const account = await loadAccount(report.accountId)

    AmplitudeService.track(MONTHLY_NOTE_DISPLAY_EVENT, {
      [MONTHLY_NOTE_DISPLAY_PROPERTIES.OFFICE]: account?.office?.name ?? '',
      [MONTHLY_NOTE_DISPLAY_PROPERTIES.HUB]: account?.hub?.hubName ?? '',
    })
  }

  return {
    trackMonthlyNoteDisplayed,
  }
}
