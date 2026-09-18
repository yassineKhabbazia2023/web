import { setActivePinia, createPinia } from 'pinia'
import { logger } from '@pulse/toolbox'
import { getDematAccountResponseMock, getInvoicesAccessResponseMock, getMockedUser } from '../../__mocks__'
import { FeatureFlagManager } from '../../managers/feature-flag/feature-flag.manager'
import { InvoicesService } from '../../services/invoices/invoices.service'
import { InvoicesTracking } from '../../services/invoices/invoices.tracking.service'
import {
  DematMailLocalisation,
  DematMailRoutingCode,
} from '../../services/invoices/invoices.enums'
import { useUserStore } from '../user/user.store'
import { useInvoicesAccessStore } from '../invoices-access/invoices-access.store'
import { useDematMailStore } from './demat-mail.store'

const ACCOUNT_ID = 26
const USER_EMAIL = 'contact@example.com'
const DEMAT_EMAIL = 'facture@example.com'

function setUpCustomerUser() {
  useUserStore().setUser(getMockedUser({ isCollab: false, email: USER_EMAIL }))
}

function setUpCollabUser() {
  useUserStore().setUser(getMockedUser({ isCollab: true, email: USER_EMAIL }))
}

// Simulates the invoices-access store having already fetched fresh data for ACCOUNT_ID
// (populated by the navigation guard, independently of demat-mail.store.ts's own load()).
// externalDematMail defaults to null here (unlike the mock's own default) so each test only
// exercises it when it explicitly overrides it.
function setUpAccessData(overrides: Parameters<typeof getInvoicesAccessResponseMock>[0] = {}) {
  useInvoicesAccessStore().setAccessData(ACCOUNT_ID, getInvoicesAccessResponseMock({
    externalDematMail: null,
    ...overrides,
  }))
}

async function loadEligibleStore(routingCode: string = DematMailRoutingCode.B2C, modalClosedAt: string | null = null) {
  vi.spyOn(InvoicesService, 'fetchDematAccount')
    .mockResolvedValue(getDematAccountResponseMock({ accountId: ACCOUNT_ID, dematMail: null, routingCode, modalClosedAt }))

  const store = useDematMailStore()
  await store.load(ACCOUNT_ID)

  return store
}

describe('useDematMailStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    setUpCustomerUser()
    vi.spyOn(FeatureFlagManager, 'isDematMailCollectActivated').mockReturnValue(true)
    vi.spyOn(InvoicesTracking, 'trackDialogOpened').mockReturnValue(undefined)
    vi.spyOn(InvoicesTracking, 'trackSubmissionSuccess').mockReturnValue(undefined)
    vi.spyOn(InvoicesTracking, 'trackSubmissionFail').mockReturnValue(undefined)
    vi.spyOn(InvoicesService, 'closeDematModal').mockResolvedValue(undefined)
    vi.spyOn(InvoicesService, 'hasHubspotSubmission').mockResolvedValue(false)
  })

  describe('initial state', () => {
    it('should not be eligible before any account is loaded', () => {
      const store = useDematMailStore()

      expect(store.isEligible).toBe(false)
      expect(store.shouldShowBanner).toBe(false)
      expect(store.shouldAutoOpenDialog).toBe(false)
      expect(store.isDialogOpen).toBe(false)
    })
  })

  describe('load', () => {
    it('should map the demat account and make an empty-mail B2C account eligible', async () => {
      const store = await loadEligibleStore()

      expect(store.accountId).toBe(ACCOUNT_ID)
      expect(store.dematMail).toBeNull()
      expect(store.routingCode).toBe(DematMailRoutingCode.B2C)
      expect(store.isDialogDismissed).toBe(false)
      expect(store.isEligible).toBe(true)
      expect(store.shouldShowBanner).toBe(true)
      expect(store.shouldAutoOpenDialog).toBe(true)
    })

    it('should make an empty-mail B2B international account eligible', async () => {
      const store = await loadEligibleStore(DematMailRoutingCode.B2B_INTERNATIONAL)

      expect(store.isEligible).toBe(true)
    })

    it('should not be eligible when the demat mail is already filled', async () => {
      vi.spyOn(InvoicesService, 'fetchDematAccount')
        .mockResolvedValue(getDematAccountResponseMock({ dematMail: DEMAT_EMAIL }))

      const store = useDematMailStore()
      await store.load(ACCOUNT_ID)

      expect(store.isEligible).toBe(false)
    })

    it('should not be eligible for a routing code out of scope', async () => {
      const store = await loadEligibleStore('0-B2B')

      expect(store.isEligible).toBe(false)
    })

    it('should not be eligible when the routing code is missing', async () => {
      vi.spyOn(InvoicesService, 'fetchDematAccount')
        .mockResolvedValue(getDematAccountResponseMock({ routingCode: null }))

      const store = useDematMailStore()
      await store.load(ACCOUNT_ID)

      expect(store.isEligible).toBe(false)
    })

    it('should not be eligible when the feature flag is disabled', async () => {
      vi.mocked(FeatureFlagManager.isDematMailCollectActivated).mockReturnValue(false)

      const store = await loadEligibleStore()

      expect(store.isEligible).toBe(false)
      expect(store.shouldShowBanner).toBe(false)
      expect(store.shouldAutoOpenDialog).toBe(false)
    })

    it('should not fetch the account when the feature flag is disabled', async () => {
      vi.mocked(FeatureFlagManager.isDematMailCollectActivated).mockReturnValue(false)
      const fetchSpy = vi.spyOn(InvoicesService, 'fetchDematAccount')

      const store = useDematMailStore()
      await store.load(ACCOUNT_ID)

      expect(fetchSpy).not.toHaveBeenCalled()
    })

    it('should not be eligible for a collaborator', async () => {
      setUpCollabUser()

      const store = await loadEligibleStore()

      expect(store.isEligible).toBe(false)
    })

    it('should not auto-open the dialog once closed, but keep the banner visible', async () => {
      const store = await loadEligibleStore(DematMailRoutingCode.B2C, '2026-08-20T10:00:00.000Z')

      expect(store.isEligible).toBe(true)
      expect(store.isDialogDismissed).toBe(true)
      expect(store.shouldAutoOpenDialog).toBe(false)
      expect(store.shouldShowBanner).toBe(true)
    })

    it('should not be eligible when another contact already submitted an external demat mail', async () => {
      setUpAccessData({ externalDematMail: DEMAT_EMAIL })

      const store = await loadEligibleStore()

      expect(store.isEligible).toBe(false)
      expect(store.shouldShowBanner).toBe(false)
      expect(store.shouldAutoOpenDialog).toBe(false)
    })

    it('should ignore externalDematMail left over in invoices-access from a previously loaded account', async () => {
      const otherAccountId = 99
      useInvoicesAccessStore().setAccessData(otherAccountId, getInvoicesAccessResponseMock({
        externalDematMail: DEMAT_EMAIL,
      }))

      const store = await loadEligibleStore()

      expect(store.isEligible).toBe(true)
      expect(store.shouldAutoOpenDialog).toBe(true)
    })

    it('should not be eligible when a submission was already dispatched to HubSpot', async () => {
      vi.mocked(InvoicesService.hasHubspotSubmission).mockResolvedValue(true)

      const store = await loadEligibleStore()

      expect(store.hasHubspotSubmission).toBe(true)
      expect(store.isEligible).toBe(false)
      expect(store.shouldShowBanner).toBe(false)
      expect(store.shouldAutoOpenDialog).toBe(false)
      expect(vi.mocked(InvoicesService.hasHubspotSubmission)).toHaveBeenCalledExactlyOnceWith(ACCOUNT_ID)
    })

    it('should not check the HubSpot submission when the demat mail is already filled', async () => {
      vi.spyOn(InvoicesService, 'fetchDematAccount')
        .mockResolvedValue(getDematAccountResponseMock({ dematMail: DEMAT_EMAIL }))

      const store = useDematMailStore()
      await store.load(ACCOUNT_ID)

      expect(vi.mocked(InvoicesService.hasHubspotSubmission)).not.toHaveBeenCalled()
    })

    it('should not check the HubSpot submission for a routing code out of scope', async () => {
      await loadEligibleStore('0-B2B')

      expect(vi.mocked(InvoicesService.hasHubspotSubmission)).not.toHaveBeenCalled()
    })

    it('should log and stay eligible when the HubSpot submission check fails', async () => {
      vi.mocked(InvoicesService.hasHubspotSubmission).mockRejectedValue(new Error('boom'))

      const store = await loadEligibleStore()

      expect(store.hasHubspotSubmission).toBe(false)
      expect(store.isEligible).toBe(true)
      expect(vi.mocked(logger.error)).toHaveBeenCalledWith('Error fetching hubspot submission state :', expect.any(Error))
    })

    it('should ignore a HubSpot submission response superseded by a faster folder switch', async () => {
      const otherAccountId = 99
      vi.spyOn(InvoicesService, 'fetchDematAccount').mockResolvedValue(getDematAccountResponseMock())
      vi.mocked(InvoicesService.hasHubspotSubmission).mockImplementation(async (accountId) => (
        accountId === ACCOUNT_ID
      ))

      const store = useDematMailStore()
      const firstLoad = store.load(ACCOUNT_ID)
      const secondLoad = store.load(otherAccountId)
      await Promise.all([firstLoad, secondLoad])

      expect(store.accountId).toBe(otherAccountId)
      expect(store.hasHubspotSubmission).toBe(false)
    })

    it('should ignore a response superseded by a faster folder switch', async () => {
      const otherAccountId = 99
      vi.spyOn(InvoicesService, 'fetchDematAccount')
        .mockResolvedValueOnce(getDematAccountResponseMock({ accountId: ACCOUNT_ID }))
        .mockResolvedValueOnce(getDematAccountResponseMock({
          accountId: otherAccountId,
          dematMail: DEMAT_EMAIL,
        }))

      const store = useDematMailStore()
      const firstLoad = store.load(ACCOUNT_ID)
      const secondLoad = store.load(otherAccountId)
      await Promise.all([firstLoad, secondLoad])

      expect(store.accountId).toBe(otherAccountId)
      expect(store.dematMail).toBe(DEMAT_EMAIL)
    })

    it('should stay silent when the account cannot be fetched', async () => {
      vi.spyOn(InvoicesService, 'fetchDematAccount').mockRejectedValue(new Error('boom'))

      const store = useDematMailStore()
      await store.load(ACCOUNT_ID)

      expect(store.isEligible).toBe(false)
      expect(store.accountId).toBeNull()
    })

    it('should not refetch an account already loaded', async () => {
      const store = await loadEligibleStore()

      await store.load(ACCOUNT_ID)

      expect(InvoicesService.fetchDematAccount).toHaveBeenCalledTimes(1)
      expect(store.accountId).toBe(ACCOUNT_ID)
      expect(store.isEligible).toBe(true)
    })

    it('should retry an account whose previous fetch failed', async () => {
      vi.spyOn(InvoicesService, 'fetchDematAccount')
        .mockRejectedValueOnce(new Error('boom'))
        .mockResolvedValueOnce(getDematAccountResponseMock({ accountId: ACCOUNT_ID, dematMail: null }))

      const store = useDematMailStore()
      await store.load(ACCOUNT_ID)
      await store.load(ACCOUNT_ID)

      expect(InvoicesService.fetchDematAccount).toHaveBeenCalledTimes(2)
      expect(store.accountId).toBe(ACCOUNT_ID)
    })
  })

  describe('openDialog', () => {
    it('should open the dialog and track the localisation', async () => {
      const store = await loadEligibleStore()

      store.openDialog(DematMailLocalisation.CONNECTION)

      expect(store.isDialogOpen).toBe(true)
      expect(vi.mocked(InvoicesTracking.trackDialogOpened))
        .toHaveBeenCalledWith(DematMailLocalisation.CONNECTION)
    })

    it('should still open the dialog when explicitly requested even though it was auto-dismissed', async () => {
      const store = await loadEligibleStore(DematMailRoutingCode.B2C, '2026-08-20T10:00:00.000Z')

      store.openDialog(DematMailLocalisation.HEADER)

      expect(store.isDialogOpen).toBe(true)
    })

    it('should not track twice when the dialog is already open', async () => {
      const store = await loadEligibleStore()

      store.openDialog(DematMailLocalisation.CONNECTION)
      store.openDialog(DematMailLocalisation.HOME)

      expect(vi.mocked(InvoicesTracking.trackDialogOpened)).toHaveBeenCalledOnce()
    })

    it('should do nothing when the account is not eligible', async () => {
      vi.mocked(FeatureFlagManager.isDematMailCollectActivated).mockReturnValue(false)
      const store = await loadEligibleStore()

      store.openDialog(DematMailLocalisation.HOME)

      expect(store.isDialogOpen).toBe(false)
      expect(vi.mocked(InvoicesTracking.trackDialogOpened)).not.toHaveBeenCalled()
    })
  })

  describe('closeDialog', () => {
    it('should close the dialog and persist the closure', async () => {
      const store = await loadEligibleStore()
      store.openDialog(DematMailLocalisation.CONNECTION)

      store.closeDialog()

      expect(store.isDialogOpen).toBe(false)
      expect(store.isDialogDismissed).toBe(true)
      expect(store.shouldAutoOpenDialog).toBe(false)
      expect(vi.mocked(InvoicesService.closeDematModal)).toHaveBeenCalledExactlyOnceWith(ACCOUNT_ID)
    })

    it('should keep the banner visible', async () => {
      const store = await loadEligibleStore()
      store.openDialog(DematMailLocalisation.CONNECTION)

      store.closeDialog()

      expect(store.shouldShowBanner).toBe(true)
    })

    it('should not persist again when called while already closed', async () => {
      const store = await loadEligibleStore()
      store.openDialog(DematMailLocalisation.CONNECTION)

      store.closeDialog()
      store.closeDialog()
      store.closeDialog()

      expect(vi.mocked(InvoicesService.closeDematModal)).toHaveBeenCalledOnce()
    })

    it('should not persist again when reopened manually after an already dismissed load', async () => {
      const store = await loadEligibleStore(DematMailRoutingCode.B2C, new Date().toISOString())
      store.openDialog(DematMailLocalisation.HEADER)

      store.closeDialog()

      expect(vi.mocked(InvoicesService.closeDematModal)).not.toHaveBeenCalled()
    })

    it('should not persist anything when no account is loaded', () => {
      const store = useDematMailStore()

      store.closeDialog()

      expect(vi.mocked(InvoicesService.closeDematModal)).not.toHaveBeenCalled()
    })

    it('should log and not throw when the closure call fails', async () => {
      vi.mocked(InvoicesService.closeDematModal).mockRejectedValue(new Error('boom'))
      const store = await loadEligibleStore()
      store.openDialog(DematMailLocalisation.CONNECTION)

      expect(() => store.closeDialog()).not.toThrow()
      expect(store.isDialogOpen).toBe(false)
    })
  })

  describe('submit', () => {
    it('should post the mail, stop soliciting and track the success', async () => {
      vi.spyOn(InvoicesService, 'submitDematMail').mockResolvedValue(undefined)
      const store = await loadEligibleStore()
      store.openDialog(DematMailLocalisation.CONNECTION)

      const result = await store.submit(DEMAT_EMAIL)

      expect(result).toBe(true)
      expect(vi.mocked(InvoicesService.submitDematMail)).toHaveBeenCalledWith(ACCOUNT_ID, {
        dematerializationEmail: DEMAT_EMAIL,
        requesterEmail: USER_EMAIL,
      })
      expect(store.isEligible).toBe(false)
      expect(store.isDialogOpen).toBe(false)
      expect(store.shouldShowBanner).toBe(false)
      expect(store.isSubmitting).toBe(false)
      // No need to persist the closure explicitly: dematMail mirrored above already makes this
      // account ineligible, so the dialog will not auto-open again regardless of isDialogDismissed.
      expect(vi.mocked(InvoicesService.closeDematModal)).not.toHaveBeenCalled()
      expect(vi.mocked(InvoicesTracking.trackSubmissionSuccess)).toHaveBeenCalledOnce()
    })

    it('should flag the error, keep the dialog open and track the failure', async () => {
      vi.spyOn(InvoicesService, 'submitDematMail').mockRejectedValue(new Error('boom'))
      const store = await loadEligibleStore()
      store.openDialog(DematMailLocalisation.CONNECTION)

      const result = await store.submit(DEMAT_EMAIL)

      expect(result).toBe(false)
      expect(store.hasSubmitError).toBe(true)
      expect(store.isDialogOpen).toBe(true)
      expect(store.isEligible).toBe(true)
      expect(store.isSubmitting).toBe(false)
      expect(vi.mocked(InvoicesTracking.trackSubmissionFail)).toHaveBeenCalledOnce()
    })

    it('should do nothing when no account is loaded', async () => {
      vi.spyOn(InvoicesService, 'submitDematMail').mockResolvedValue(undefined)
      const store = useDematMailStore()

      const result = await store.submit(DEMAT_EMAIL)

      expect(result).toBe(false)
      expect(vi.mocked(InvoicesService.submitDematMail)).not.toHaveBeenCalled()
    })
  })

  describe('reset', () => {
    it('should clear the loaded account', async () => {
      const store = await loadEligibleStore()

      store.reset()

      expect(store.accountId).toBeNull()
      expect(store.dematMail).toBeNull()
      expect(store.routingCode).toBeNull()
      expect(store.isEligible).toBe(false)
    })
  })
})
