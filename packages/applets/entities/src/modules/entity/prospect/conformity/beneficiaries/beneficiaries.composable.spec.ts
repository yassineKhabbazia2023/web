import { flushPromises } from '@vue/test-utils'
import { withSetup } from '@pulse/toolbox/utils/test'
import { displayNotification } from '@pulse/styleguide'
import { useCurrentEntityStore } from '@pulse/common/stores'
import { getStoreMock } from '@pulse/common/mocks/vitest'
import type { EntitySummary } from '@pulse/common/types'
import { ProspectsService } from '@entities/services/prospects/prospects.service'
import { BeneficiaryDocumentType } from '@entities/modules/entity/prospect/types'
import {
  getBeneficiariesResponseMock,
  getBeneficiaryDocumentMock,
  getBeneficiaryMock,
  getFileMock,
} from '@entities/__mocks__/beneficiaries.mocks'
import { useBeneficiaries } from './beneficiaries.composable'
import { BENEFICIARIES_I18N_KEYS } from './beneficiaries.constants'
import { OnboardingStep, OnboardingStepStatus } from '../prospect-conformity.enums'

const fetchBeneficiariesMock = vi.fn()
const uploadBeneficiaryDocumentsMock = vi.fn()
const completeOnboardingStepMock = vi.fn()
const fetchOnboardingStepMock = vi.fn()
const displayNotificationMock = vi.mocked(displayNotification)

const prospectIdMock = 602
const accountIdMock = 1971

const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)

const setCurrentEntity = (prospectId: number | undefined, accountId: number | null = accountIdMock): void => {
  currentEntityStoreMock.currentEntity = prospectId === undefined
    ? undefined
    : { prospectId, accountId } as EntitySummary
  currentEntityStoreMock.currentEntityId = accountId === null ? undefined : accountId
}

const emitMock = vi.fn()

const firstBeneficiaryIdMock = 'beneficiary-1'
const secondBeneficiaryIdMock = 'beneficiary-2'

describe('beneficiaries.composable', () => {
  beforeEach(() => {
    vi.spyOn(ProspectsService, 'fetchBeneficiaries').mockImplementation(fetchBeneficiariesMock)
    vi.spyOn(ProspectsService, 'uploadBeneficiaryDocuments').mockImplementation(uploadBeneficiaryDocumentsMock)
    vi.spyOn(ProspectsService, 'completeOnboardingStep').mockImplementation(completeOnboardingStepMock)
    vi.spyOn(ProspectsService, 'fetchOnboardingStep').mockImplementation(fetchOnboardingStepMock)
    displayNotificationMock.mockImplementation(() => undefined)
    setCurrentEntity(prospectIdMock)
    fetchBeneficiariesMock.mockResolvedValue(getBeneficiariesResponseMock({
      beneficiaries: [
        getBeneficiaryMock({ beneficiaryId: firstBeneficiaryIdMock, firstName: 'Jeanne', lastName: 'Dupont' }),
        getBeneficiaryMock({ beneficiaryId: secondBeneficiaryIdMock, firstName: 'Marc', lastName: 'Martin' }),
      ],
    }))
    fetchOnboardingStepMock.mockResolvedValue({ id: OnboardingStep.Beneficiary, status: OnboardingStepStatus.ToDo })
  })

  describe('initial loading on mount', () => {
    it('should fetch beneficiaries, build form states and select the first tab', async () => {
      const [result] = withSetup(() => useBeneficiaries(emitMock))

      expect(result.isLoading.value).toBe(true)

      await flushPromises()

      expect(fetchBeneficiariesMock).toHaveBeenCalledWith(accountIdMock)
      expect(result.beneficiaries.value).toHaveLength(2)
      expect(result.activeBeneficiaryId.value).toBe(firstBeneficiaryIdMock)
      expect(result.formStateByBeneficiaryId.value[secondBeneficiaryIdMock]).toEqual({
        documentType: BeneficiaryDocumentType.CNI,
        firstName: 'Marc',
        lastName: 'Martin',
        files: [],
      })
      expect(result.isLoading.value).toBe(false)
    })

    it('should fetch the beneficiary step status on mount and expose it', async () => {
      fetchOnboardingStepMock.mockResolvedValue({
        id: OnboardingStep.Beneficiary,
        status: OnboardingStepStatus.InReview,
      })

      const [result] = withSetup(() => useBeneficiaries(emitMock))
      await flushPromises()

      expect(fetchOnboardingStepMock).toHaveBeenCalledWith(accountIdMock, OnboardingStep.Beneficiary)
      expect(result.beneficiaryStepStatus.value).toBe(OnboardingStepStatus.InReview)
    })

    it('should not fetch beneficiaries when there is no account id', async () => {
      setCurrentEntity(prospectIdMock, null)

      const [result] = withSetup(() => useBeneficiaries(emitMock))

      await flushPromises()

      expect(fetchBeneficiariesMock).not.toHaveBeenCalled()
      expect(result.isLoading.value).toBe(false)
    })

    it('should fetch beneficiaries with the account id without requiring a prospect id', async () => {
      setCurrentEntity(undefined)

      const [result] = withSetup(() => useBeneficiaries(emitMock))

      await flushPromises()

      expect(fetchBeneficiariesMock).toHaveBeenCalledWith(accountIdMock)
      expect(result.isLoading.value).toBe(false)
    })

    it('should handle fetch errors gracefully', async () => {
      fetchBeneficiariesMock.mockRejectedValue(new Error('API Error'))

      const [result] = withSetup(() => useBeneficiaries(emitMock))

      await flushPromises()

      expect(result.beneficiaries.value).toEqual([])
      expect(result.isLoading.value).toBe(false)
    })
  })

  describe('onValidateAllBeneficiaries', () => {
    it('should complete the beneficiary onboarding step with the account id and keep beneficiaries loaded by account id', async () => {
      const [result] = withSetup(() => useBeneficiaries(emitMock))
      await flushPromises()

      await result.onValidateAllBeneficiaries()

      expect(fetchBeneficiariesMock).toHaveBeenCalledWith(accountIdMock)
      expect(completeOnboardingStepMock).toHaveBeenCalledWith(accountIdMock, OnboardingStep.Beneficiary)
      expect(displayNotificationMock).toHaveBeenCalledWith('success', BENEFICIARIES_I18N_KEYS.VALIDATE_SUCCESS)
      expect(result.isValidatingAll.value).toBe(false)
      // Reloads its own status (mount + after validation), then asks the parent to refresh the stepper.
      expect(fetchOnboardingStepMock).toHaveBeenCalledTimes(2)
      expect(emitMock).toHaveBeenCalledWith('refresh-steps')
    })

    it('should not complete the beneficiary onboarding step when there is no account id', async () => {
      setCurrentEntity(prospectIdMock, null)

      const [result] = withSetup(() => useBeneficiaries(emitMock))
      await flushPromises()

      await result.onValidateAllBeneficiaries()

      expect(completeOnboardingStepMock).not.toHaveBeenCalled()
      expect(result.isValidatingAll.value).toBe(false)
    })
  })

  describe('document deletion flow', () => {
    const documentMock = getBeneficiaryDocumentMock({ id: 'doc-to-delete' })

    it('should open the dialog when a deletion is requested', async () => {
      const [result] = withSetup(() => useBeneficiaries(emitMock))
      await flushPromises()

      result.onRequestDocumentDeletion(firstBeneficiaryIdMock, documentMock)

      expect(result.isDeleteDialogOpen.value).toBe(true)
      expect(result.documentPendingDeletion.value).toEqual({
        beneficiaryId: firstBeneficiaryIdMock,
        document: documentMock,
      })
    })

    it('should clear the pending deletion when the dialog is closed', async () => {
      const [result] = withSetup(() => useBeneficiaries(emitMock))
      await flushPromises()

      result.onRequestDocumentDeletion(firstBeneficiaryIdMock, documentMock)
      result.isDeleteDialogOpen.value = false

      expect(result.documentPendingDeletion.value).toBeUndefined()
      expect(result.isDeleteDialogOpen.value).toBe(false)
    })

    it('should clear the pending deletion and reload the list once the document is deleted', async () => {
      const [result] = withSetup(() => useBeneficiaries(emitMock))
      await flushPromises()

      result.onRequestDocumentDeletion(firstBeneficiaryIdMock, documentMock)

      const deletePromise = result.onDocumentDeleted()
      expect(result.isRefreshing.value).toBe(true)

      await deletePromise

      expect(result.documentPendingDeletion.value).toBeUndefined()
      expect(result.isDeleteDialogOpen.value).toBe(false)
      expect(result.isRefreshing.value).toBe(false)
      expect(fetchBeneficiariesMock).toHaveBeenCalledTimes(2)
      expect(fetchOnboardingStepMock).toHaveBeenCalledTimes(2)
    })
  })

  describe('zone-aware file handling', () => {
    it('should store a selected file in its zone slot', async () => {
      const [result] = withSetup(() => useBeneficiaries(emitMock))
      await flushPromises()

      const verso = getFileMock('cni-verso.pdf')
      result.onFilesSelected(1, [verso])

      // The recto zone stays empty so the verso keeps its slot
      expect(result.formStateByBeneficiaryId.value[firstBeneficiaryIdMock].files).toEqual([undefined, verso])
    })

    it('should ignore an empty selection', async () => {
      const [result] = withSetup(() => useBeneficiaries(emitMock))
      await flushPromises()

      result.onFilesSelected(0, [])

      expect(result.formStateByBeneficiaryId.value[firstBeneficiaryIdMock].files).toEqual([])
    })

    it('should clear a zone slot without shifting the others', async () => {
      const [result] = withSetup(() => useBeneficiaries(emitMock))
      await flushPromises()

      const recto = getFileMock('cni-recto.pdf')
      const verso = getFileMock('cni-verso.pdf')
      result.formStateByBeneficiaryId.value[firstBeneficiaryIdMock].files = [recto, verso]

      result.onFileDeleted(0)

      expect(result.formStateByBeneficiaryId.value[firstBeneficiaryIdMock].files).toEqual([undefined, verso])
    })
  })

  describe('onSave', () => {
    it('should upload the documents of the active beneficiary and reload the list', async () => {
      const [result] = withSetup(() => useBeneficiaries(emitMock))
      await flushPromises()

      const files = [getFileMock('cni-recto.pdf'), getFileMock('cni-verso.pdf')]
      result.formStateByBeneficiaryId.value[firstBeneficiaryIdMock].documentType = BeneficiaryDocumentType.CNI
      result.formStateByBeneficiaryId.value[firstBeneficiaryIdMock].files = files

      await result.onSave()

      expect(uploadBeneficiaryDocumentsMock).toHaveBeenCalledWith(
        accountIdMock,
        firstBeneficiaryIdMock,
        BeneficiaryDocumentType.CNI,
        files,
      )
      expect(displayNotificationMock).toHaveBeenCalledWith('success', BENEFICIARIES_I18N_KEYS.SAVE_SUCCESS)
      expect(fetchBeneficiariesMock).toHaveBeenCalledTimes(2)
      expect(fetchOnboardingStepMock).toHaveBeenCalledTimes(2)
      expect(result.activeBeneficiaryId.value).toBe(firstBeneficiaryIdMock)
      expect(result.isSaving.value).toBe(false)
      expect(emitMock).toHaveBeenCalledWith('refresh-steps')
    })

    it('should not upload anything when the active tab is pristine', async () => {
      fetchBeneficiariesMock.mockResolvedValue(getBeneficiariesResponseMock({
        beneficiaries: [
          getBeneficiaryMock({
            beneficiaryId: firstBeneficiaryIdMock,
            documentType: BeneficiaryDocumentType.CNI,
          }),
        ],
      }))

      const [result] = withSetup(() => useBeneficiaries(emitMock))
      await flushPromises()

      await result.onSave()

      expect(uploadBeneficiaryDocumentsMock).not.toHaveBeenCalled()
    })

    it('should not upload anything when no file is selected', async () => {
      const [result] = withSetup(() => useBeneficiaries(emitMock))
      await flushPromises()

      result.formStateByBeneficiaryId.value[firstBeneficiaryIdMock].documentType = BeneficiaryDocumentType.CNI

      await result.onSave()

      expect(uploadBeneficiaryDocumentsMock).not.toHaveBeenCalled()
    })

    it('should not upload anything when the files count does not match the document type requirement', async () => {
      const [result] = withSetup(() => useBeneficiaries(emitMock))
      await flushPromises()

      // A CNI requires two files, only one is selected
      result.formStateByBeneficiaryId.value[firstBeneficiaryIdMock].documentType = BeneficiaryDocumentType.CNI
      result.formStateByBeneficiaryId.value[firstBeneficiaryIdMock].files = [getFileMock('cni-recto.pdf')]

      await result.onSave()

      expect(uploadBeneficiaryDocumentsMock).not.toHaveBeenCalled()
    })

    it('should not upload anything when a CNI zone slot is empty because its file was rejected', async () => {
      const [result] = withSetup(() => useBeneficiaries(emitMock))
      await flushPromises()

      // The recto was rejected by its upload zone: only the verso slot holds a file
      result.formStateByBeneficiaryId.value[firstBeneficiaryIdMock].documentType = BeneficiaryDocumentType.CNI
      result.formStateByBeneficiaryId.value[firstBeneficiaryIdMock].files = [undefined, getFileMock('cni-verso.pdf')]

      await result.onSave()

      expect(uploadBeneficiaryDocumentsMock).not.toHaveBeenCalled()
    })

    it('should upload the missing file of a partially uploaded CNI', async () => {
      fetchBeneficiariesMock.mockResolvedValue(getBeneficiariesResponseMock({
        beneficiaries: [
          getBeneficiaryMock({
            beneficiaryId: firstBeneficiaryIdMock,
            documentType: BeneficiaryDocumentType.CNI,
            documents: [getBeneficiaryDocumentMock()],
          }),
        ],
      }))

      const [result] = withSetup(() => useBeneficiaries(emitMock))
      await flushPromises()

      // The recto already exists server-side: the verso zone (index 1) holds the only local file
      const missingFile = getFileMock('cni-verso.pdf')
      result.formStateByBeneficiaryId.value[firstBeneficiaryIdMock].files = [undefined, missingFile]

      await result.onSave()

      expect(uploadBeneficiaryDocumentsMock).toHaveBeenCalledWith(
        accountIdMock,
        firstBeneficiaryIdMock,
        BeneficiaryDocumentType.CNI,
        [missingFile],
      )
    })

    it('should not upload anything when no document type is selected', async () => {
      const [result] = withSetup(() => useBeneficiaries(emitMock))
      await flushPromises()

      result.formStateByBeneficiaryId.value[firstBeneficiaryIdMock].files = [getFileMock()]

      await result.onSave()

      expect(uploadBeneficiaryDocumentsMock).not.toHaveBeenCalled()
    })

    it('should display an error notification when the upload fails', async () => {
      uploadBeneficiaryDocumentsMock.mockRejectedValue(new Error('Upload Error'))

      const [result] = withSetup(() => useBeneficiaries(emitMock))
      await flushPromises()

      result.formStateByBeneficiaryId.value[firstBeneficiaryIdMock].documentType = BeneficiaryDocumentType.CNI
      result.formStateByBeneficiaryId.value[firstBeneficiaryIdMock].files = [getFileMock('cni-recto.pdf'), getFileMock('cni-verso.pdf')]

      await result.onSave()

      expect(displayNotificationMock).toHaveBeenCalledWith('error', BENEFICIARIES_I18N_KEYS.SAVE_ERROR)
      expect(fetchBeneficiariesMock).toHaveBeenCalledTimes(1)
      expect(result.isSaving.value).toBe(false)
      expect(emitMock).not.toHaveBeenCalled()
    })
  })
})
