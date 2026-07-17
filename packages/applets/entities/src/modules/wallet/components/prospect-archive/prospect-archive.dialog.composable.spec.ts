import { ref } from 'vue'
import type { ProspectWalletData } from '@entities/modules/wallet/types'
import { displayNotification } from '@pulse/styleguide'
import { ProspectsService } from '@entities/services/prospects/prospects.service'
import { useProspectArchiveDialog } from './prospect-archive.dialog.composable'

beforeEach(() => {
  vi.spyOn(ProspectsService, 'archiveProspect').mockResolvedValue(undefined)
  vi.mocked(displayNotification).mockImplementation(() => undefined)
})

const buildProspect = (overrides: Partial<ProspectWalletData> = {}): ProspectWalletData => ({
  owner: {
    contactId: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@test.com',
    initials: 'JD',
  },
  prospectId: 42,
  accountId: 100,
  accountNumber: 'ACC-1',
  name: 'Acme',
  isFavorite: false,
  onboardingStep: null,
  cacFolder: false,
  ...overrides,
})

describe('useProspectArchiveDialog', () => {
  describe('onCancel', () => {
    it('should close the dialog', () => {
      const dialogModel = ref(true)
      const emit = vi.fn()
      const { onCancel } = useProspectArchiveDialog({ prospect: buildProspect() }, dialogModel, emit)

      onCancel()

      expect(dialogModel.value).toBe(false)
    })

    it('should not emit archived', () => {
      const dialogModel = ref(true)
      const emit = vi.fn()
      const { onCancel } = useProspectArchiveDialog({ prospect: buildProspect() }, dialogModel, emit)

      onCancel()

      expect(emit).not.toHaveBeenCalled()
    })
  })

  describe('onConfirm', () => {
    it('should call ProspectsService.archiveProspect with the prospectId', async () => {
      vi.mocked(ProspectsService.archiveProspect).mockResolvedValueOnce()
      const dialogModel = ref(true)
      const emit = vi.fn()
      const { onConfirm } = useProspectArchiveDialog(
        { prospect: buildProspect({ prospectId: 42 }) },
        dialogModel,
        emit,
      )

      await onConfirm()

      expect(ProspectsService.archiveProspect).toHaveBeenCalledWith(42)
    })

    it('should emit archived and close the dialog when the archival succeeds', async () => {
      vi.mocked(ProspectsService.archiveProspect).mockResolvedValueOnce()
      const dialogModel = ref(true)
      const emit = vi.fn()
      const { onConfirm } = useProspectArchiveDialog({ prospect: buildProspect() }, dialogModel, emit)

      await onConfirm()

      expect(emit).toHaveBeenCalledWith('archived')
      expect(dialogModel.value).toBe(false)
    })

    it('should display a success notification when the archival succeeds', async () => {
      vi.mocked(ProspectsService.archiveProspect).mockResolvedValueOnce()
      const dialogModel = ref(true)
      const emit = vi.fn()
      const { onConfirm } = useProspectArchiveDialog({ prospect: buildProspect() }, dialogModel, emit)

      await onConfirm()

      expect(vi.mocked(displayNotification)).toHaveBeenCalledWith('success', 'entities.wallet.prospectDelete.success')
    })

    it('should display an error notification when the archival fails', async () => {
      vi.mocked(ProspectsService.archiveProspect).mockRejectedValueOnce(new Error('fail'))
      const dialogModel = ref(true)
      const emit = vi.fn()
      const { onConfirm } = useProspectArchiveDialog({ prospect: buildProspect() }, dialogModel, emit)

      await onConfirm()

      expect(vi.mocked(displayNotification)).toHaveBeenCalledWith('error', 'entities.wallet.prospectDelete.error')
    })

    it('should keep the dialog open and not emit archived when the archival fails', async () => {
      vi.mocked(ProspectsService.archiveProspect).mockRejectedValueOnce(new Error('fail'))
      const dialogModel = ref(true)
      const emit = vi.fn()
      const { onConfirm } = useProspectArchiveDialog({ prospect: buildProspect() }, dialogModel, emit)

      await onConfirm()

      expect(emit).not.toHaveBeenCalled()
      expect(dialogModel.value).toBe(true)
    })

    it('should toggle isArchiving during the call', async () => {
      let resolveArchive: () => void = () => {}
      const pending = new Promise<void>(resolve => {
        resolveArchive = resolve
      })
      vi.mocked(ProspectsService.archiveProspect).mockReturnValueOnce(pending)
      const dialogModel = ref(true)
      const emit = vi.fn()
      const { isArchiving, onConfirm } = useProspectArchiveDialog(
        { prospect: buildProspect() },
        dialogModel,
        emit,
      )

      const confirmPromise = onConfirm()
      expect(isArchiving.value).toBe(true)
      resolveArchive()
      await confirmPromise
      expect(isArchiving.value).toBe(false)
    })
  })
})
