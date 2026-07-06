import { ref } from 'vue'
import { displayNotification } from '@pulse/styleguide'
import { ProspectsService } from '@entities/services/prospects/prospects.service'
import { useDeleteDocumentDialog } from './delete-document-dialog.composable'
import type { DeleteDocumentDialogProps } from './delete-document-dialog.types'

vi.mock('@entities/services/prospects/prospects.service')
vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key }),
}))
vi.mock('@pulse/styleguide')
vi.mock('@pulse/toolbox')

const I18N_KEY = 'entities.prospect.deleteDocumentDialog'
const accountIdMock = 1971

const buildProps = (overrides: Partial<DeleteDocumentDialogProps> = {}): DeleteDocumentDialogProps => ({
  accountId: accountIdMock,
  pDocumentId: 42,
  pFileName: 'kbis.pdf',
  ...overrides,
})

describe('useDeleteDocumentDialog', () => {
  describe('onCancel', () => {
    it('should close the dialog without deleting', () => {
      const dialogModel = ref(true)
      const emit = vi.fn()
      const { onCancel } = useDeleteDocumentDialog(buildProps(), dialogModel, emit)

      onCancel()

      expect(dialogModel.value).toBe(false)
      expect(vi.mocked(ProspectsService.deleteProspectDocument)).not.toHaveBeenCalled()
      expect(emit).not.toHaveBeenCalled()
    })
  })

  describe('onConfirm', () => {
    it('should delete the document, notify success, emit deleted and close the dialog', async () => {
      vi.mocked(ProspectsService.deleteProspectDocument).mockResolvedValueOnce()
      const dialogModel = ref(true)
      const emit = vi.fn()
      const { onConfirm } = useDeleteDocumentDialog(buildProps({ accountId: accountIdMock, pDocumentId: 42 }), dialogModel, emit)

      await onConfirm()

      expect(vi.mocked(ProspectsService.deleteProspectDocument)).toHaveBeenCalledWith(accountIdMock, 42)
      expect(vi.mocked(displayNotification)).toHaveBeenCalledWith('success', `${I18N_KEY}.success`)
      expect(emit).toHaveBeenCalledWith('deleted')
      expect(dialogModel.value).toBe(false)
    })

    it('should do nothing when there is no document id', async () => {
      const dialogModel = ref(true)
      const emit = vi.fn()
      const { onConfirm } = useDeleteDocumentDialog(buildProps({ pDocumentId: undefined }), dialogModel, emit)

      await onConfirm()

      expect(vi.mocked(ProspectsService.deleteProspectDocument)).not.toHaveBeenCalled()
      expect(emit).not.toHaveBeenCalled()
    })

    it('should notify the error, keep the dialog open and not emit when the deletion fails', async () => {
      vi.mocked(ProspectsService.deleteProspectDocument).mockRejectedValueOnce(new Error('fail'))
      const dialogModel = ref(true)
      const emit = vi.fn()
      const { onConfirm } = useDeleteDocumentDialog(buildProps(), dialogModel, emit)

      await onConfirm()

      expect(vi.mocked(displayNotification)).toHaveBeenCalledWith('error', `${I18N_KEY}.error`)
      expect(emit).not.toHaveBeenCalled()
      expect(dialogModel.value).toBe(true)
    })

    it('should toggle isDeleting during the call', async () => {
      let resolveDelete: () => void = () => {}
      const pending = new Promise<void>((resolve) => {
        resolveDelete = resolve
      })
      vi.mocked(ProspectsService.deleteProspectDocument).mockReturnValueOnce(pending)
      const dialogModel = ref(true)
      const emit = vi.fn()
      const { isDeleting, onConfirm } = useDeleteDocumentDialog(buildProps(), dialogModel, emit)

      const confirmPromise = onConfirm()
      expect(isDeleting.value).toBe(true)
      resolveDelete()
      await confirmPromise
      expect(isDeleting.value).toBe(false)
    })
  })
})
