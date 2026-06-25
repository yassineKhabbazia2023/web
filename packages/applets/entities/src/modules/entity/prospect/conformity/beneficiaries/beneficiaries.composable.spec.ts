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

vi.mock('@entities/services/prospects/prospects.service')
vi.mock('@pulse/styleguide')
vi.mock('@pulse/toolbox')
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}))

const fetchBeneficiariesMock = vi.mocked(ProspectsService.fetchBeneficiaries)
const uploadBeneficiaryDocumentsMock = vi.mocked(ProspectsService.uploadBeneficiaryDocuments)
const displayNotificationMock = vi.mocked(displayNotification)

const prospectIdMock = 602

const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)

const setCurrentEntity = (prospectId: number | undefined): void => {
  currentEntityStoreMock.currentEntity = prospectId === undefined
    ? undefined
    : { prospectId } as EntitySummary
}

const emitMock = vi.fn()

const firstBeneficiaryIdMock = 'beneficiary-1'
const secondBeneficiaryIdMock = 'beneficiary-2'

describe('beneficiaries.composable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setCurrentEntity(prospectIdMock)
    fetchBeneficiariesMock.mockResolvedValue(getBeneficiariesResponseMock({
      beneficiaries: [
        getBeneficiaryMock({ beneficiaryId: firstBeneficiaryIdMock, firstName: 'Jeanne', lastName: 'Dupont' }),
        getBeneficiaryMock({ beneficiaryId: secondBeneficiaryIdMock, firstName: 'Marc', lastName: 'Martin' }),
      ],
    }))
  })

  describe('initial loading on mount', () => {
    it('should fetch beneficiaries, build form states and select the first tab', async () => {
      const [result] = withSetup(() => useBeneficiaries(emitMock))

      expect(result.isLoading.value).toBe(true)

      await flushPromises()

      expect(fetchBeneficiariesMock).toHaveBeenCalledWith(prospectIdMock)
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

    it('should not fetch beneficiaries when there is no prospectId', async () => {
      setCurrentEntity(undefined)

      const [result] = withSetup(() => useBeneficiaries(emitMock))

      await flushPromises()

      expect(fetchBeneficiariesMock).not.toHaveBeenCalled()
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
        prospectIdMock,
        firstBeneficiaryIdMock,
        BeneficiaryDocumentType.CNI,
        files,
      )
      expect(displayNotificationMock).toHaveBeenCalledWith('success', BENEFICIARIES_I18N_KEYS.SAVE_SUCCESS)
      expect(fetchBeneficiariesMock).toHaveBeenCalledTimes(2)
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

      const missingFile = getFileMock('cni-verso.pdf')
      result.formStateByBeneficiaryId.value[firstBeneficiaryIdMock].files = [missingFile]

      await result.onSave()

      expect(uploadBeneficiaryDocumentsMock).toHaveBeenCalledWith(
        prospectIdMock,
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
