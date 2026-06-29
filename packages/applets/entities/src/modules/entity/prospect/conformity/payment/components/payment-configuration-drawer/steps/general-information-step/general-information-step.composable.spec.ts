import { ref } from 'vue'
import { flushPromises } from '@vue/test-utils'
import { withSetup } from '@pulse/toolbox/utils/test'
import { extractRibFromPdf } from '@pulse/toolbox/utils/rib-extraction'
import { useGeneralInformationStep } from './general-information-step.composable'
import type { MandateBankDetails } from '@entities/modules/entity/prospect/conformity/payment/components/payment-configuration-drawer/payment-configuration-drawer.types'

// Factory mock so the real module (and its `pdfjs-dist` import) is never evaluated under jsdom.
vi.mock('@pulse/toolbox/utils/rib-extraction', () => ({
  extractRibFromPdf: vi.fn(),
}))
vi.mock('@pulse/toolbox')

const extractRibFromPdfMock = vi.mocked(extractRibFromPdf)

// Canonical valid French IBAN + a matching (FR) and a mismatching (DE) BIC.
const VALID_FR_IBAN = 'FR1420041010050500013M02606'
const MATCHING_FR_BIC = 'BNPAFRPP'
const MISMATCHING_DE_BIC = 'DEUTDEFF'

const ribPdf = new File(['rib'], 'rib.pdf', { type: 'application/pdf' })

const buildExtraction = (iban: string, bic: string) => ({
  iban,
  bic,
  validation: { ibanValid: true, ibanChecksum: true, bicValid: true, ribKeyValid: false },
  confidence: 1,
})

const createBankDetails = (overrides: Partial<MandateBankDetails> = {}): MandateBankDetails => ({
  holder: '',
  addressLine1: '',
  addressLine2: '',
  postalCode: '',
  city: '',
  country: '',
  iban: '',
  bic: '',
  ...overrides,
})

const setup = (bankDetailsInit?: Partial<MandateBankDetails>) => {
  const bankDetails = ref<MandateBankDetails>(createBankDetails(bankDetailsInit))
  const ribFile = ref<File | null>(null)
  const [step] = withSetup(() => useGeneralInformationStep({
    bankDetails,
    ribFile,
  }))
  return { bankDetails, ribFile, step }
}

describe('general-information-step.composable', () => {
  beforeEach(() => {
    extractRibFromPdfMock.mockResolvedValue(buildExtraction(VALID_FR_IBAN, MATCHING_FR_BIC))
  })

  describe('onRibSelected', () => {
    it('should auto-fill IBAN/BIC, leave holder/address empty and mark the RIB as processed', async () => {
      const { bankDetails, ribFile, step } = setup()

      await step.onRibSelected(ribPdf)
      await flushPromises()

      expect(extractRibFromPdfMock).toHaveBeenCalledWith(ribPdf)
      expect(bankDetails.value.iban).toBe(VALID_FR_IBAN)
      expect(bankDetails.value.bic).toBe(MATCHING_FR_BIC)
      expect(bankDetails.value.holder).toBe('')
      expect(bankDetails.value.addressLine1).toBe('')
      expect(ribFile.value).toBe(ribPdf)
      expect(step.isRibProcessed.value).toBe(true)
    })

    it('should flag the RIB as unrecognized when no valid IBAN/BIC could be read', async () => {
      extractRibFromPdfMock.mockResolvedValue({
        validation: { ibanValid: false, ibanChecksum: false, bicValid: false, ribKeyValid: false },
        confidence: 0,
      })

      const { step } = setup()

      await step.onRibSelected(ribPdf)
      await flushPromises()

      expect(step.isRibUnrecognized.value).toBe(true)
    })

    it('should not flag the RIB as unrecognized when a valid, consistent IBAN/BIC is read', async () => {
      const { step } = setup()

      await step.onRibSelected(ribPdf)
      await flushPromises()

      expect(step.isRibUnrecognized.value).toBe(false)
    })

    it('should keep the upload alert tied to the OCR result, decoupled from later manual edits', async () => {
      const { bankDetails, step } = setup()

      await step.onRibSelected(ribPdf)
      await flushPromises()

      // The OCR read a valid pair: the upload alert is off.
      expect(step.isRibUnrecognized.value).toBe(false)

      // Manually breaking the BIC flags the form-level mismatch but never re-triggers the upload alert.
      bankDetails.value.bic = 'INVALID'
      expect(step.hasIbanBicMismatch.value).toBe(true)
      expect(step.isRibUnrecognized.value).toBe(false)
    })

    it('should clear only the IBAN/BIC and keep the holder/address when another RIB is uploaded', async () => {
      const { bankDetails, step } = setup({ holder: 'Hugo Morel', addressLine1: '49 Rue Victor Hugo' })

      await step.onRibSelected(ribPdf)
      await flushPromises()

      // The next RIB yields no readable IBAN/BIC, proving the previous values are cleared (not kept).
      extractRibFromPdfMock.mockResolvedValueOnce({
        validation: { ibanValid: false, ibanChecksum: false, bicValid: false, ribKeyValid: false },
        confidence: 0,
      })
      await step.onRibSelected(ribPdf)
      await flushPromises()

      expect(bankDetails.value.holder).toBe('Hugo Morel')
      expect(bankDetails.value.addressLine1).toBe('49 Rue Victor Hugo')
      expect(bankDetails.value.iban).toBe('')
      expect(bankDetails.value.bic).toBe('')
    })

    it('should flag the extraction failure and reset the RIB when extraction throws', async () => {
      extractRibFromPdfMock.mockRejectedValue(new Error('boom'))

      const { ribFile, step } = setup()

      await step.onRibSelected(ribPdf)
      await flushPromises()

      expect(step.hasRibExtractionFailed.value).toBe(true)
      expect(step.isRibUnrecognized.value).toBe(false)
      expect(ribFile.value).toBeNull()
      expect(step.isRibProcessed.value).toBe(false)
    })
  })

  describe('onRibRemoved', () => {
    it('should clear only the IBAN/BIC and keep the holder when the RIB upload is removed', async () => {
      const { bankDetails, ribFile, step } = setup({ holder: 'Hugo Morel' })

      await step.onRibSelected(ribPdf)
      await flushPromises()
      expect(step.isRibProcessed.value).toBe(true)

      step.onRibRemoved()

      expect(bankDetails.value.holder).toBe('Hugo Morel')
      expect(bankDetails.value.iban).toBe('')
      expect(bankDetails.value.bic).toBe('')
      expect(ribFile.value).toBeNull()
      expect(step.isRibProcessed.value).toBe(false)
    })
  })

  describe('concurrent OCR runs', () => {
    it('should drop a stale extraction result when the RIB is removed mid-extraction', async () => {
      let resolveExtraction!: (value: ReturnType<typeof buildExtraction>) => void
      const pendingExtraction = new Promise<ReturnType<typeof buildExtraction>>((resolve) => {
        resolveExtraction = resolve
      })
      extractRibFromPdfMock.mockReturnValueOnce(pendingExtraction)

      const { bankDetails, ribFile, step } = setup()

      const selectPromise = step.onRibSelected(ribPdf)
      // The user removes the RIB while the OCR is still running.
      step.onRibRemoved()
      expect(ribFile.value).toBeNull()

      // The slow extraction finally resolves with data for the now-removed RIB.
      resolveExtraction(buildExtraction(VALID_FR_IBAN, MATCHING_FR_BIC))
      await selectPromise
      await flushPromises()

      expect(bankDetails.value.iban).toBe('')
      expect(bankDetails.value.bic).toBe('')
      expect(ribFile.value).toBeNull()
      expect(step.isExtractingRib.value).toBe(false)
    })

    it('should keep the latest RIB result when an earlier extraction resolves last', async () => {
      const newerRib = new File(['rib2'], 'rib2.pdf', { type: 'application/pdf' })
      let resolveFirstExtraction!: (value: ReturnType<typeof buildExtraction>) => void
      const firstExtraction = new Promise<ReturnType<typeof buildExtraction>>((resolve) => {
        resolveFirstExtraction = resolve
      })
      extractRibFromPdfMock.mockReturnValueOnce(firstExtraction)

      const { bankDetails, ribFile, step } = setup()

      const firstSelect = step.onRibSelected(ribPdf)
      // A newer RIB is selected and its (fast) extraction fills the latest data.
      await step.onRibSelected(newerRib)
      await flushPromises()
      expect(ribFile.value).toBe(newerRib)
      expect(bankDetails.value.iban).toBe(VALID_FR_IBAN)

      // The earlier, slower extraction resolves last with different data — it must be ignored.
      resolveFirstExtraction(buildExtraction('FR7630006000011234567890189', MISMATCHING_DE_BIC))
      await firstSelect
      await flushPromises()

      expect(ribFile.value).toBe(newerRib)
      expect(bankDetails.value.iban).toBe(VALID_FR_IBAN)
      expect(bankDetails.value.bic).toBe(MATCHING_FR_BIC)
      // The stale run's early return must not leave the spinner stuck on: the latest run cleared it.
      expect(step.isExtractingRib.value).toBe(false)
    })
  })

  describe('isGeneralInformationValid / hasIbanBicMismatch', () => {
    it('should be valid when the RIB is processed, every field is filled and IBAN/BIC are consistent', async () => {
      const { bankDetails, step } = setup({
        holder: 'Hugo Morel',
        addressLine1: '49 Rue Victor Hugo',
        postalCode: '69002',
        city: 'Lyon',
        country: 'France',
      })

      await step.onRibSelected(ribPdf)
      await flushPromises()

      expect(bankDetails.value.iban).toBe(VALID_FR_IBAN)
      expect(step.hasIbanBicMismatch.value).toBe(false)
      expect(step.isGeneralInformationValid.value).toBe(true)
    })

    it('should flag a mismatch and stay invalid when IBAN and BIC countries differ', async () => {
      extractRibFromPdfMock.mockResolvedValue(buildExtraction(VALID_FR_IBAN, MISMATCHING_DE_BIC))

      const { step } = setup({
        holder: 'Hugo Morel',
        addressLine1: '49 Rue Victor Hugo',
        postalCode: '69002',
        city: 'Lyon',
        country: 'France',
      })

      await step.onRibSelected(ribPdf)
      await flushPromises()

      // The OCR read individually-valid IBAN and BIC, so the upload alert stays off; only the
      // form-level mismatch (different countries) fires.
      expect(step.isRibUnrecognized.value).toBe(false)
      expect(step.hasIbanBicMismatch.value).toBe(true)
      expect(step.isGeneralInformationValid.value).toBe(false)
    })
  })
})
