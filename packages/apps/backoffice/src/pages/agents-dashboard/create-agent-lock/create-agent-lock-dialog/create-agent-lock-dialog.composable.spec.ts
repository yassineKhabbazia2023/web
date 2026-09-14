import { displayNotification } from '@pulse/styleguide'
import { AgentsDashboardService } from '@backoffice/services/agents-dashboard/agents-dashboard.service'
import { useCreateAgentLockDialog } from './create-agent-lock-dialog.composable'

describe('useCreateAgentLockDialog', () => {
  const onSuccess = vi.fn()
  const onClose = vi.fn()

  beforeEach(() => {
    onSuccess.mockClear()
    onClose.mockClear()
    vi.spyOn(AgentsDashboardService, 'createLock').mockResolvedValue({
      status: 'Success',
      message: '<b>VERROUILLAGE APPLIQUÉ</b>',
    })
  })

  describe('isFormValid', () => {
    it('should be false when no environment is selected', () => {
      const { form, isFormValid } = useCreateAgentLockDialog({ onSuccess, onClose })

      form.value.reason = 'Deployment'

      expect(isFormValid.value).toBe(false)
    })

    it('should be false when reason is empty', () => {
      const { form, isFormValid } = useCreateAgentLockDialog({ onSuccess, onClose })

      form.value.environmentId = 1
      form.value.reason = '   '

      expect(isFormValid.value).toBe(false)
    })

    it('should be true when environment and reason are filled', () => {
      const { form, isFormValid } = useCreateAgentLockDialog({ onSuccess, onClose })

      form.value.environmentId = 1
      form.value.reason = 'Deployment'

      expect(isFormValid.value).toBe(true)
    })
  })

  describe('handleCreate', () => {
    it('should set validation errors when form is empty', async () => {
      const { handleCreate, errors } = useCreateAgentLockDialog({ onSuccess, onClose })

      await handleCreate()

      expect(errors.value.environmentId).toBe('L\'environnement est requis')
      expect(errors.value.reason).toBe('La raison est requise')
      expect(AgentsDashboardService.createLock).not.toHaveBeenCalled()
    })

    it('should create lock and close dialog when form is valid', async () => {
      const { form, handleCreate } = useCreateAgentLockDialog({ onSuccess, onClose })

      form.value.environmentId = 1
      form.value.reason = ' Deployment '

      await handleCreate()

      expect(AgentsDashboardService.createLock).toHaveBeenCalledWith({
        environmentId: 1,
        reason: 'Deployment',
      })
      expect(displayNotification).toHaveBeenCalledWith('success', 'Lock créé avec succès')
      expect(onSuccess).toHaveBeenCalledWith('<b>VERROUILLAGE APPLIQUÉ</b>')
      expect(onClose).toHaveBeenCalledOnce()
    })

    it('should display error notification when create lock fails', async () => {
      vi.mocked(AgentsDashboardService.createLock).mockRejectedValue(new Error('API Error'))

      const { form, handleCreate, isCreating } = useCreateAgentLockDialog({ onSuccess, onClose })

      form.value.environmentId = 1
      form.value.reason = 'Deployment'

      await handleCreate()

      expect(displayNotification).toHaveBeenCalledWith('error', 'Impossible de créer le lock')
      expect(isCreating.value).toBe(false)
    })
  })

  describe('handleClose', () => {
    it('should close dialog and reset form when not creating', () => {
      const { form, handleClose } = useCreateAgentLockDialog({ onSuccess, onClose })

      form.value.environmentId = 1
      form.value.reason = 'Deployment'

      handleClose()

      expect(onClose).toHaveBeenCalledOnce()
      expect(form.value.environmentId).toBe(null)
      expect(form.value.reason).toBe('')
    })

    it('should do nothing when creating', () => {
      const { handleClose, isCreating } = useCreateAgentLockDialog({ onSuccess, onClose })

      isCreating.value = true

      handleClose()

      expect(onClose).not.toHaveBeenCalled()
    })
  })
})
