import { getMockedUser } from '@pulse/common/mocks'
import { getStoreMock } from '@pulse/common/mocks/vitest'
import { useCurrentEntityStore, useUserStore } from '@pulse/common/stores'
import { sanitizeUrl } from '@pulse/toolbox/utils/url'
import { formatFrenchPhoneNumber } from '@pulse/toolbox/utils/string'
import { InvoicesTracking } from '@entities/services/invoices/invoices.tracking.service'
import { InvoicesFormStep, InvoicesAssistanceFormParam } from '@entities/modules/entity/enums'

import { INVOICES_ASSISTANCE_FORM_URL } from '../../invoices.constants'
import { useInvoicesAssistance } from './invoices-assistance.composable'

vi.mock('@pulse/toolbox/utils/url')
vi.mock('@pulse/toolbox/utils/string')
vi.mock('@entities/services/invoices/invoices.tracking.service')

const userStoreMock = getStoreMock(useUserStore)
const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)

describe('useInvoicesAssistance', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(sanitizeUrl).mockImplementation((url) => url as string)
    vi.mocked(formatFrenchPhoneNumber).mockReturnValue('+33612345678')
    userStoreMock.isCollab = false
    userStoreMock.getUser.mockReturnValue(
      getMockedUser({ firstName: 'Jean', lastName: 'Dupont', email: 'jean.dupont@example.com', officeMobile: '0612345678' }),
    )
    currentEntityStoreMock.currentEntity = { legalName: 'Acme Corp' } as any
    currentEntityStoreMock.currentEntityAccountNumber = 'ACC-123'
  })

  describe('isCollab', () => {
    it('should return false when user is not a collaborator', () => {
      const { isCollab } = useInvoicesAssistance(InvoicesFormStep.EMAIL_AND_TERMS)

      expect(isCollab.value).toBe(false)
    })

    it('should return true when user is a collaborator', () => {
      userStoreMock.isCollab = true

      const { isCollab } = useInvoicesAssistance(InvoicesFormStep.EMAIL_AND_TERMS)

      expect(isCollab.value).toBe(true)
    })
  })

  describe('iframeUrl', () => {
    it('should build the URL with all user and entity fields encoded', () => {
      const { iframeUrl } = useInvoicesAssistance(InvoicesFormStep.EMAIL_AND_TERMS)

      const expectedUrl = `${INVOICES_ASSISTANCE_FORM_URL}?firstname=Jean&0-1%2Flastname=Dupont&0-1%2Femail=jean.dupont%40example.com&0-1%2Fphone=%2B33612345678&0-1%2Fcompany=Acme+Corp&0-1%2Fcode_client=ACC-123`

      expect(iframeUrl.value).toBe(expectedUrl)
      expect(vi.mocked(sanitizeUrl)).toHaveBeenCalledWith(expectedUrl)
    })

    it('should delegate phone formatting to formatFrenchPhoneNumber', () => {
      const { iframeUrl } = useInvoicesAssistance(InvoicesFormStep.EMAIL_AND_TERMS)

      expect(iframeUrl.value).toContain(`${encodeURIComponent(InvoicesAssistanceFormParam.PHONE)}=%2B33612345678`)
      expect(vi.mocked(formatFrenchPhoneNumber)).toHaveBeenCalledWith('0612345678')
    })

    it('should use empty strings when user and entity fields are missing', () => {
      userStoreMock.getUser.mockReturnValue(undefined)
      vi.mocked(formatFrenchPhoneNumber).mockReturnValue('')
      currentEntityStoreMock.currentEntity = undefined as any
      currentEntityStoreMock.currentEntityAccountNumber = ''

      const { iframeUrl } = useInvoicesAssistance(InvoicesFormStep.EMAIL_AND_TERMS)

      const expectedUrl = `${INVOICES_ASSISTANCE_FORM_URL}?firstname=&0-1%2Flastname=&0-1%2Femail=&0-1%2Fphone=&0-1%2Fcompany=&0-1%2Fcode_client=`

      expect(iframeUrl.value).toBe(expectedUrl)
      expect(vi.mocked(sanitizeUrl)).toHaveBeenCalledWith(expectedUrl)
    })

    it('should encode special characters in user data', () => {
      userStoreMock.getUser.mockReturnValue(
        getMockedUser({ firstName: 'Jean-François', lastName: "O'Connor", email: 'jf@example.com', officeMobile: '0612345678' }),
      )
      currentEntityStoreMock.currentEntity = { legalName: 'Müller & Co' } as any

      const { iframeUrl } = useInvoicesAssistance(InvoicesFormStep.EMAIL_AND_TERMS)

      expect(iframeUrl.value).toContain(`${InvoicesAssistanceFormParam.FIRSTNAME}=Jean-Fran%C3%A7ois`)
      expect(iframeUrl.value).toContain(`${encodeURIComponent(InvoicesAssistanceFormParam.LASTNAME)}=O%27Connor`)
      expect(iframeUrl.value).toContain(`${encodeURIComponent(InvoicesAssistanceFormParam.COMPANY)}=M%C3%BCller+%26+Co`)
    })
  })

  describe('isDialogOpen', () => {
    it('should be false initially', () => {
      const { isDialogOpen } = useInvoicesAssistance(InvoicesFormStep.EMAIL_AND_TERMS)

      expect(isDialogOpen.value).toBe(false)
    })
  })

  describe('handleOpenDialog', () => {
    it('should open the dialog and track when user is not a collaborator', () => {
      const { isDialogOpen, handleOpenDialog } = useInvoicesAssistance(InvoicesFormStep.EMAIL_AND_TERMS)

      handleOpenDialog()

      expect(isDialogOpen.value).toBe(true)
      expect(vi.mocked(InvoicesTracking.trackAssistanceButtonClick)).toHaveBeenCalledWith(
        InvoicesFormStep.EMAIL_AND_TERMS,
      )
    })

    it('should not open the dialog when user is a collaborator', () => {
      userStoreMock.isCollab = true

      const { isDialogOpen, handleOpenDialog } = useInvoicesAssistance(InvoicesFormStep.EMAIL_AND_TERMS)

      handleOpenDialog()

      expect(isDialogOpen.value).toBe(false)
      expect(vi.mocked(InvoicesTracking.trackAssistanceButtonClick)).not.toHaveBeenCalled()
    })
  })
})
