import { computed, ref } from 'vue'
import { logger } from '@pulse/toolbox'
import { isNotNullNorEmpty } from '@pulse/toolbox/utils/validator'
import { extractRibFromPdf } from '@pulse/toolbox/utils/rib-extraction'
import { areIbanAndBicCoherent } from '@pulse/toolbox/utils/banking-validators'
import type { UseGeneralInformationStepParams } from './general-information-step.types'

// Local controller for step 1: runs the RIB OCR and derives the step's validity. Its only side effects
// are on the shared bankDetails/ribFile models; the drawer reads back the file and the validity.
export function useGeneralInformationStep(params: UseGeneralInformationStepParams) {
  const isExtractingRib = ref(false)

  // Snapshot of the last OCR run, shown under the upload zone: true when the uploaded RIB could not be
  // read into a valid IBAN/BIC. Decoupled from later manual edits — those drive `hasIbanBicMismatch`.
  const isRibUnrecognized = ref(false)

  // True when the extraction itself threw (unreadable file / PDF parse error), as opposed to a readable
  // file with unrecognized data. Surfaced as an alert under the upload zone, prompting a retry.
  const hasRibExtractionFailed = ref(false)

  // A RIB is "processed" once a file is present and extraction has finished (success keeps the file,
  // failure clears it). Derived, so it resets on its own when the file is cleared (e.g. drawer reset).
  const isRibProcessed = computed(() =>
    params.ribFile.value !== null && isExtractingRib.value === false,
  )

  const areAllFieldsFilled = computed(() =>
    isNotNullNorEmpty(params.bankDetails.value.holder)
    && isNotNullNorEmpty(params.bankDetails.value.addressLine1)
    && isNotNullNorEmpty(params.bankDetails.value.postalCode)
    && isNotNullNorEmpty(params.bankDetails.value.city)
    && isNotNullNorEmpty(params.bankDetails.value.country)
    && isNotNullNorEmpty(params.bankDetails.value.iban)
    && isNotNullNorEmpty(params.bankDetails.value.bic),
  )

  // Form-level check: flag the entered pair as invalid only once both fields are filled (to avoid the
  // error showing while typing). Live, so it reacts to manual edits as well as the OCR fill.
  const hasIbanBicMismatch = computed(() =>
    isNotNullNorEmpty(params.bankDetails.value.iban)
    && isNotNullNorEmpty(params.bankDetails.value.bic)
    && areIbanAndBicCoherent(params.bankDetails.value.iban, params.bankDetails.value.bic) === false,
  )

  const isGeneralInformationValid = computed(() =>
    isRibProcessed.value
    && areAllFieldsFilled.value
    && hasIbanBicMismatch.value === false,
  )

  // Selecting (file) or removing (null) a RIB only clears the IBAN and BIC and resets the OCR error
  // flags; the holder and address already entered are kept.
  const resetRibDerivedData = (ribFile: File | null): void => {
    params.bankDetails.value.iban = ''
    params.bankDetails.value.bic = ''
    params.ribFile.value = ribFile
    isRibUnrecognized.value = false
    hasRibExtractionFailed.value = false
  }

  const onRibSelected = async (file: File): Promise<void> => {
    resetRibDerivedData(file)
    isExtractingRib.value = true
    try {
      const result = await extractRibFromPdf(file)
      if (isNotNullNorEmpty(result.iban)) {
        params.bankDetails.value.iban = result.iban
      }
      if (isNotNullNorEmpty(result.bic)) {
        params.bankDetails.value.bic = result.bic
      }
      // Only IBAN and BIC are auto-filled; the holder and address stay empty for manual entry.
      // The OCR "failed to read" when it couldn't produce a valid IBAN (format + checksum) and BIC.
      const ocrReadValidIban = result.validation.ibanValid === true && result.validation.ibanChecksum === true
      isRibUnrecognized.value = ocrReadValidIban === false || result.validation.bicValid === false
    } catch (error) {
      logger.error('Failed to extract RIB data from PDF', error)
      params.ribFile.value = null
      hasRibExtractionFailed.value = true
    } finally {
      isExtractingRib.value = false
    }
  }

  const onRibRemoved = (): void => {
    resetRibDerivedData(null)
  }

  return {
    isExtractingRib,
    isRibProcessed,
    areAllFieldsFilled,
    hasIbanBicMismatch,
    isRibUnrecognized,
    hasRibExtractionFailed,
    isGeneralInformationValid,
    onRibSelected,
    onRibRemoved,
  }
}
