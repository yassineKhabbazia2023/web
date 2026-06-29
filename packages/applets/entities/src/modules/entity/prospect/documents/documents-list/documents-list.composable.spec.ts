import { flushPromises } from '@vue/test-utils'
import { withSetup } from '@pulse/toolbox/utils/test'
import { downloadFile } from '@pulse/common/helpers'
import { getStoreMock } from '@pulse/common/mocks/vitest'
import { useCurrentEntityStore } from '@pulse/common/stores'
import type { EntitySummary } from '@pulse/common/types'
import { ConformityDocumentsService } from '@entities/services/conformity-documents'
import {
  getBeneficiaryDocumentMock,
  getComplementaryDocumentMock,
  getConformityDocumentMock,
  getConformityDocumentsResponseMock,
  getSupportingDocumentMock,
} from '@entities/__mocks__'
import { formatDateToLocale } from '@entities/helpers'
import { useDocumentsList } from './documents-list.composable'

vi.mock('@entities/services/conformity-documents')
vi.mock('@pulse/common/helpers')

const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)

const setCurrentEntity = (accountId: number | undefined): void => {
  currentEntityStoreMock.currentEntity = accountId === undefined
    ? undefined
    : { accountId } as EntitySummary
}

describe('useDocumentsList', () => {
  beforeEach(() => {
    vi.mocked(ConformityDocumentsService.getConformityDocuments).mockResolvedValue(
      getConformityDocumentsResponseMock(),
    )
  })

  it('should fetch documents on mount for the current entity', async () => {
    setCurrentEntity(1971)

    withSetup(() => useDocumentsList())
    await flushPromises()

    expect(vi.mocked(ConformityDocumentsService.getConformityDocuments)).toHaveBeenCalledWith(1971)
  })

  it('should not call the service when no entity is selected', async () => {
    setCurrentEntity(undefined)

    withSetup(() => useDocumentsList())
    await flushPromises()

    expect(vi.mocked(ConformityDocumentsService.getConformityDocuments)).not.toHaveBeenCalled()
  })

  it('should flatten every document category and map them to the DocumentsListItem shape', async () => {
    setCurrentEntity(1971)
    const supporting = getSupportingDocumentMock()
    const complementary = getComplementaryDocumentMock()
    const beneficiary = getBeneficiaryDocumentMock()
    const commercialProposal = getConformityDocumentMock({ id: 'proposal-id', fileName: 'proposal.pdf' })
    const engagementLetter = getConformityDocumentMock({ id: 'letter-id', fileName: 'letter.pdf' })
    vi.mocked(ConformityDocumentsService.getConformityDocuments).mockResolvedValueOnce(
      getConformityDocumentsResponseMock({
        supportingDocuments: [supporting, complementary],
        beneficiaryDocuments: [beneficiary],
        commercialProposal,
        engagementLetter,
      }),
    )

    const [result] = withSetup(() => useDocumentsList())
    await flushPromises()

    const toItem = (document: { id: string, fileName: string, uploadedAt: string, uploadedBy: string }) => ({
      documentId: document.id,
      documentName: document.fileName,
      documentDepositDate: formatDateToLocale(document.uploadedAt),
      documentDepositedBy: document.uploadedBy,
    })
    expect(result.documentsListItems.value).toEqual([
      toItem(supporting),
      toItem(complementary),
      toItem(beneficiary),
      toItem(commercialProposal),
      toItem(engagementLetter),
    ])
  })

  it('should skip the commercial proposal and engagement letter when they are null', async () => {
    setCurrentEntity(1971)
    const supporting = getSupportingDocumentMock()
    vi.mocked(ConformityDocumentsService.getConformityDocuments).mockResolvedValueOnce(
      getConformityDocumentsResponseMock({
        supportingDocuments: [supporting],
        beneficiaryDocuments: [],
        commercialProposal: null,
        engagementLetter: null,
      }),
    )

    const [result] = withSetup(() => useDocumentsList())
    await flushPromises()

    expect(result.documentsListItems.value).toEqual([
      {
        documentId: supporting.id,
        documentName: supporting.fileName,
        documentDepositDate: formatDateToLocale(supporting.uploadedAt),
        documentDepositedBy: supporting.uploadedBy,
      },
    ])
  })

  it('should expose a loading flag that resolves to false once loaded', async () => {
    setCurrentEntity(1971)

    const [result] = withSetup(() => useDocumentsList())
    await flushPromises()

    expect(result.isLoading.value).toBe(false)
  })

  it('should reset the loading flag when the service rejects', async () => {
    setCurrentEntity(1971)
    vi.mocked(ConformityDocumentsService.getConformityDocuments).mockRejectedValueOnce(new Error('network error'))

    const [result] = withSetup(() => useDocumentsList())
    await flushPromises()

    expect(result.isLoading.value).toBe(false)
    expect(result.documentsListItems.value).toEqual([])
  })

  describe('downloadDocument', () => {
    it('should fetch the matching document content and trigger the download', async () => {
      setCurrentEntity(1971)
      const supporting = getSupportingDocumentMock()
      const blob = new Blob(['binary'])
      vi.mocked(ConformityDocumentsService.getConformityDocumentContent).mockResolvedValueOnce(blob)

      const [result] = withSetup(() => useDocumentsList())
      await flushPromises()

      await result.downloadDocument(supporting.id)

      expect(vi.mocked(ConformityDocumentsService.getConformityDocumentContent)).toHaveBeenCalledWith(
        1971,
        supporting.id,
      )
      expect(vi.mocked(downloadFile)).toHaveBeenCalledWith(blob, supporting.fileName)
    })

    it('should do nothing when the document id is unknown', async () => {
      setCurrentEntity(1971)

      const [result] = withSetup(() => useDocumentsList())
      await flushPromises()

      await result.downloadDocument('unknown-id')

      expect(vi.mocked(ConformityDocumentsService.getConformityDocumentContent)).not.toHaveBeenCalled()
      expect(vi.mocked(downloadFile)).not.toHaveBeenCalled()
    })
  })
})
