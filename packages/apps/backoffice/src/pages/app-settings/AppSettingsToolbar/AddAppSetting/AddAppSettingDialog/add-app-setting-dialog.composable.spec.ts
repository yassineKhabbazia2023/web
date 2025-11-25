import { nextTick } from 'vue'
import { useAddAppSettingDialog } from './add-app-setting-dialog.composable'
import { AppSettingsListService } from '@backoffice/services/app-settings-list/app-settings-list.service'
import type { EnvironmentOption } from '@backoffice/services/app-settings-list/app-settings-list.service.type'
import * as styleguide from '@pulse/styleguide'

vi.mock('@backoffice/services/app-settings-list/app-settings-list.service', () => ({
  AppSettingsListService: {
    getAvailableEnvironments: vi.fn(),
    createAppSetting: vi.fn(),
  },
}))

vi.mock('@pulse/styleguide', () => ({
  displayNotification: vi.fn(),
}))

vi.mock('@pulse/toolbox', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
  },
}))

describe('useAddAppSettingDialog', () => {
  const mockEnvironments: EnvironmentOption[] = [
    { environment: 'ITG', labels: ['itg01', 'itg02'] },
    { environment: 'REC', labels: ['rec01'] },
    { environment: 'PRD', labels: [] },
  ]

  const mockOnSuccess = vi.fn()
  const mockOnClose = vi.fn()

  describe('initialization', () => {
    it('should initialize with default form state', () => {
      const { form } = useAddAppSettingDialog({
        onSuccess: mockOnSuccess,
        onClose: mockOnClose,
      })

      expect(form.value.name).toBe('')
      expect(form.value.value).toBe('')
      expect(form.value.isSecret).toBe(false)
      expect(form.value.allEnvs).toBe(false)
      expect(form.value.withLabels).toBe(false)
      expect(form.value.selectedEnvironments).toEqual([])
    })

    it('should initialize with empty errors', () => {
      const { errors } = useAddAppSettingDialog({
        onSuccess: mockOnSuccess,
        onClose: mockOnClose,
      })

      expect(errors.value).toEqual({})
    })

    it('should initialize loading states as false', () => {
      const { isLoadingEnvironments, isCreating, hasEnvironmentLoadError } = useAddAppSettingDialog({
        onSuccess: mockOnSuccess,
        onClose: mockOnClose,
      })

      expect(isLoadingEnvironments.value).toBe(false)
      expect(isCreating.value).toBe(false)
      expect(hasEnvironmentLoadError.value).toBe(false)
    })
  })

  describe('isFormValid', () => {
    it('should return false when form is empty', () => {
      const { isFormValid } = useAddAppSettingDialog({
        onSuccess: mockOnSuccess,
        onClose: mockOnClose,
      })

      expect(isFormValid.value).toBe(false)
    })

    it('should return false when name is missing', () => {
      const { form, isFormValid } = useAddAppSettingDialog({
        onSuccess: mockOnSuccess,
        onClose: mockOnClose,
      })

      form.value.value = 'test-value'
      form.value.selectedEnvironments = ['ITG']

      expect(isFormValid.value).toBe(false)
    })

    it('should return false when value is missing', () => {
      const { form, isFormValid } = useAddAppSettingDialog({
        onSuccess: mockOnSuccess,
        onClose: mockOnClose,
      })

      form.value.name = 'Domain_acc_account_TestKey'
      form.value.selectedEnvironments = ['ITG']

      expect(isFormValid.value).toBe(false)
    })

    it('should return false when no environment is selected and allEnvs is false', () => {
      const { form, isFormValid } = useAddAppSettingDialog({
        onSuccess: mockOnSuccess,
        onClose: mockOnClose,
      })

      form.value.name = 'Domain_acc_account_TestKey'
      form.value.value = 'test-value'

      expect(isFormValid.value).toBe(false)
    })

    it('should return true when all required fields are filled with specific environments', () => {
      const { form, isFormValid } = useAddAppSettingDialog({
        onSuccess: mockOnSuccess,
        onClose: mockOnClose,
      })

      form.value.name = 'Domain_acc_account_TestKey'
      form.value.value = 'test-value'
      form.value.selectedEnvironments = ['ITG']

      expect(isFormValid.value).toBe(true)
    })

    it('should return true when all required fields are filled with allEnvs true', () => {
      const { form, isFormValid } = useAddAppSettingDialog({
        onSuccess: mockOnSuccess,
        onClose: mockOnClose,
      })

      form.value.name = 'Domain_acc_account_TestKey'
      form.value.value = 'test-value'
      form.value.allEnvs = true

      expect(isFormValid.value).toBe(true)
    })
  })

  describe('allEnvs watcher', () => {
    it('should clear selectedEnvironments when allEnvs becomes true', async () => {
      const { form } = useAddAppSettingDialog({
        onSuccess: mockOnSuccess,
        onClose: mockOnClose,
      })

      form.value.selectedEnvironments = ['ITG', 'REC']
      form.value.allEnvs = true

      await nextTick()

      expect(form.value.selectedEnvironments).toEqual([])
    })

    it('should not affect selectedEnvironments when allEnvs becomes false', async () => {
      const { form } = useAddAppSettingDialog({
        onSuccess: mockOnSuccess,
        onClose: mockOnClose,
      })

      form.value.allEnvs = true
      form.value.allEnvs = false
      form.value.selectedEnvironments = ['ITG']

      await nextTick()

      expect(form.value.selectedEnvironments).toEqual(['ITG'])
    })

    it('should reset withLabels to false when allEnvs becomes false', async () => {
      const { form } = useAddAppSettingDialog({
        onSuccess: mockOnSuccess,
        onClose: mockOnClose,
      })

      form.value.allEnvs = true
      form.value.withLabels = true

      await nextTick()

      form.value.allEnvs = false

      await nextTick()

      expect(form.value.withLabels).toBe(false)
    })

    it('should not reset withLabels when allEnvs becomes true', async () => {
      const { form } = useAddAppSettingDialog({
        onSuccess: mockOnSuccess,
        onClose: mockOnClose,
      })

      form.value.withLabels = true
      form.value.allEnvs = true

      await nextTick()

      expect(form.value.withLabels).toBe(true)
    })
  })

  describe('loadAvailableEnvironments', () => {
    it('should load environments successfully', async () => {
      vi.mocked(AppSettingsListService.getAvailableEnvironments).mockResolvedValue(mockEnvironments)

      const { loadAvailableEnvironments, availableEnvironments, isLoadingEnvironments } = useAddAppSettingDialog({
        onSuccess: mockOnSuccess,
        onClose: mockOnClose,
      })

      expect(isLoadingEnvironments.value).toBe(false)

      const loadPromise = loadAvailableEnvironments()
      expect(isLoadingEnvironments.value).toBe(true)

      await loadPromise

      expect(availableEnvironments.value).toEqual(mockEnvironments)
      expect(isLoadingEnvironments.value).toBe(false)
    })

    it('should handle environment loading error', async () => {
      vi.mocked(AppSettingsListService.getAvailableEnvironments).mockRejectedValue(new Error('Load failed'))

      const { loadAvailableEnvironments, hasEnvironmentLoadError, availableEnvironments } = useAddAppSettingDialog({
        onSuccess: mockOnSuccess,
        onClose: mockOnClose,
      })

      await loadAvailableEnvironments()

      expect(hasEnvironmentLoadError.value).toBe(true)
      expect(availableEnvironments.value).toEqual([])
    })
  })

  describe('handleClose', () => {
    it('should call onClose callback and reset form', () => {
      const { form, handleClose } = useAddAppSettingDialog({
        onSuccess: mockOnSuccess,
        onClose: mockOnClose,
      })

      form.value.name = 'Domain_acc_account_TestKey'
      form.value.value = 'test-value'

      handleClose()

      expect(mockOnClose).toHaveBeenCalledTimes(1)
      expect(form.value.name).toBe('')
      expect(form.value.value).toBe('')
    })

    it('should not close when isCreating is true', () => {
      const { handleClose, isCreating } = useAddAppSettingDialog({
        onSuccess: mockOnSuccess,
        onClose: mockOnClose,
      })

      isCreating.value = true
      handleClose()

      expect(mockOnClose).not.toHaveBeenCalled()
    })

    it('should reset errors when closing', () => {
      const { errors, handleClose } = useAddAppSettingDialog({
        onSuccess: mockOnSuccess,
        onClose: mockOnClose,
      })

      errors.value = { name: 'Error message' }

      handleClose()

      expect(errors.value).toEqual({})
    })
  })

  describe('form validation', () => {
    it('should validate empty name', async () => {
      const { form, handleCreate, errors } = useAddAppSettingDialog({
        onSuccess: mockOnSuccess,
        onClose: mockOnClose,
      })

      form.value.value = 'test-value'
      form.value.selectedEnvironments = ['ITG']

      await handleCreate()

      expect(errors.value.name).toBe('Le nom est requis')
      expect(mockOnSuccess).not.toHaveBeenCalled()
    })

    it('should validate name format (must follow Domain_xxx_nomdomain_nomcle)', async () => {
      const { form, handleCreate, errors } = useAddAppSettingDialog({
        onSuccess: mockOnSuccess,
        onClose: mockOnClose,
      })

      form.value.name = 'InvalidName'
      form.value.value = 'test-value'
      form.value.selectedEnvironments = ['ITG']

      await handleCreate()

      expect(errors.value.name).toBe('Le nom de la clé doit respecter le format : Domain_xxx_nomdomain_nomcle')
      expect(mockOnSuccess).not.toHaveBeenCalled()
    })

    it('should validate name format with incomplete Domain_ prefix', async () => {
      const { form, handleCreate, errors } = useAddAppSettingDialog({
        onSuccess: mockOnSuccess,
        onClose: mockOnClose,
      })

      form.value.name = 'Domain_TEST'
      form.value.value = 'test-value'
      form.value.selectedEnvironments = ['ITG']

      await handleCreate()

      expect(errors.value.name).toBe('Le nom de la clé doit respecter le format : Domain_xxx_nomdomain_nomcle')
      expect(mockOnSuccess).not.toHaveBeenCalled()
    })

    it('should validate name format with only two parts after Domain_', async () => {
      const { form, handleCreate, errors } = useAddAppSettingDialog({
        onSuccess: mockOnSuccess,
        onClose: mockOnClose,
      })

      form.value.name = 'Domain_acc_account'
      form.value.value = 'test-value'
      form.value.selectedEnvironments = ['ITG']

      await handleCreate()

      expect(errors.value.name).toBe('Le nom de la clé doit respecter le format : Domain_xxx_nomdomain_nomcle')
      expect(mockOnSuccess).not.toHaveBeenCalled()
    })

    it('should validate empty value', async () => {
      const { form, handleCreate, errors } = useAddAppSettingDialog({
        onSuccess: mockOnSuccess,
        onClose: mockOnClose,
      })

      form.value.name = 'Domain_acc_account_TestKey'
      form.value.selectedEnvironments = ['ITG']

      await handleCreate()

      expect(errors.value.value).toBe('La valeur est requise')
      expect(mockOnSuccess).not.toHaveBeenCalled()
    })

    it('should validate missing environments when allEnvs is false', async () => {
      const { form, handleCreate, errors } = useAddAppSettingDialog({
        onSuccess: mockOnSuccess,
        onClose: mockOnClose,
      })

      form.value.name = 'Domain_acc_account_TestKey'
      form.value.value = 'test-value'
      form.value.allEnvs = false

      await handleCreate()

      expect(errors.value.selectedEnvironments).toBe('Au moins un environnement doit être sélectionné')
      expect(mockOnSuccess).not.toHaveBeenCalled()
    })

    it('should pass validation with valid data', async () => {
      vi.mocked(AppSettingsListService.createAppSetting).mockResolvedValue()

      const { form, handleCreate, errors } = useAddAppSettingDialog({
        onSuccess: mockOnSuccess,
        onClose: mockOnClose,
      })

      form.value.name = 'Domain_acc_account_TestKey'
      form.value.value = 'test-value'
      form.value.selectedEnvironments = ['ITG']

      await handleCreate()

      expect(errors.value).toEqual({})
    })
  })

  describe('handleCreate', () => {
    it('should create app setting with string type', async () => {
      vi.mocked(AppSettingsListService.createAppSetting).mockResolvedValue()

      const { form, handleCreate } = useAddAppSettingDialog({
        onSuccess: mockOnSuccess,
        onClose: mockOnClose,
      })

      form.value.name = 'Domain_acc_account_TestKey'
      form.value.value = 'test-value'
      form.value.isSecret = false
      form.value.selectedEnvironments = ['ITG']
      form.value.allEnvs = false

      await handleCreate()

      expect(AppSettingsListService.createAppSetting).toHaveBeenCalledWith({
        name: 'Domain_acc_account_TestKey',
        type: 'string',
        value: 'test-value',
        targets: [{ environment: 'ITG', labels: [] }],
        allEnvs: false,
        withLabels: false,
      })
    })

    it('should create app setting with secret type', async () => {
      vi.mocked(AppSettingsListService.createAppSetting).mockResolvedValue()

      const { form, handleCreate } = useAddAppSettingDialog({
        onSuccess: mockOnSuccess,
        onClose: mockOnClose,
      })

      form.value.name = 'Domain_acc_account_TestKey'
      form.value.value = 'secret-value'
      form.value.isSecret = true
      form.value.selectedEnvironments = ['ITG']

      await handleCreate()

      expect(AppSettingsListService.createAppSetting).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'secret',
        }),
      )
    })

    it('should create app setting with allEnvs true', async () => {
      vi.mocked(AppSettingsListService.createAppSetting).mockResolvedValue()

      const { form, handleCreate } = useAddAppSettingDialog({
        onSuccess: mockOnSuccess,
        onClose: mockOnClose,
      })

      form.value.name = 'Domain_acc_account_TestKey'
      form.value.value = 'test-value'
      form.value.allEnvs = true

      await handleCreate()

      expect(AppSettingsListService.createAppSetting).toHaveBeenCalledWith(
        expect.objectContaining({
          allEnvs: true,
          withLabels: false,
        }),
      )
    })

    it('should create app setting with withLabels true when allEnvs is true', async () => {
      vi.mocked(AppSettingsListService.createAppSetting).mockResolvedValue()

      const { form, handleCreate } = useAddAppSettingDialog({
        onSuccess: mockOnSuccess,
        onClose: mockOnClose,
      })

      form.value.name = 'Domain_acc_account_TestKey'
      form.value.value = 'test-value'
      form.value.allEnvs = true
      form.value.withLabels = true

      await handleCreate()

      expect(AppSettingsListService.createAppSetting).toHaveBeenCalledWith(
        expect.objectContaining({
          allEnvs: true,
          withLabels: true,
        }),
      )
    })

    it('should create app setting with withLabels false when allEnvs is false', async () => {
      vi.mocked(AppSettingsListService.createAppSetting).mockResolvedValue()

      const { form, handleCreate } = useAddAppSettingDialog({
        onSuccess: mockOnSuccess,
        onClose: mockOnClose,
      })

      form.value.name = 'Domain_acc_account_TestKey'
      form.value.value = 'test-value'
      form.value.selectedEnvironments = ['ITG']
      form.value.allEnvs = false
      form.value.withLabels = false

      await handleCreate()

      expect(AppSettingsListService.createAppSetting).toHaveBeenCalledWith(
        expect.objectContaining({
          allEnvs: false,
          withLabels: false,
        }),
      )
    })

    it('should display success notification on successful creation', async () => {
      vi.mocked(AppSettingsListService.createAppSetting).mockResolvedValue()

      const { form, handleCreate } = useAddAppSettingDialog({
        onSuccess: mockOnSuccess,
        onClose: mockOnClose,
      })

      form.value.name = 'Domain_acc_account_TestKey'
      form.value.value = 'test-value'
      form.value.selectedEnvironments = ['ITG']

      await handleCreate()

      expect(styleguide.displayNotification).toHaveBeenCalledWith(
        'success',
        'Variable d\'environnement créée avec succès',
      )
    })

    it('should call onSuccess and onClose callbacks on successful creation', async () => {
      vi.mocked(AppSettingsListService.createAppSetting).mockResolvedValue()

      const { form, handleCreate } = useAddAppSettingDialog({
        onSuccess: mockOnSuccess,
        onClose: mockOnClose,
      })

      form.value.name = 'Domain_acc_account_TestKey'
      form.value.value = 'test-value'
      form.value.selectedEnvironments = ['ITG']

      await handleCreate()

      expect(mockOnSuccess).toHaveBeenCalledTimes(1)
      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    it('should reset form after successful creation', async () => {
      vi.mocked(AppSettingsListService.createAppSetting).mockResolvedValue()

      const { form, handleCreate } = useAddAppSettingDialog({
        onSuccess: mockOnSuccess,
        onClose: mockOnClose,
      })

      form.value.name = 'Domain_acc_account_TestKey'
      form.value.value = 'test-value'
      form.value.selectedEnvironments = ['ITG']

      await handleCreate()

      expect(form.value.name).toBe('')
      expect(form.value.value).toBe('')
      expect(form.value.selectedEnvironments).toEqual([])
    })

    it('should handle creation error', async () => {
      vi.mocked(AppSettingsListService.createAppSetting).mockRejectedValue(new Error('Creation failed'))

      const { form, handleCreate } = useAddAppSettingDialog({
        onSuccess: mockOnSuccess,
        onClose: mockOnClose,
      })

      form.value.name = 'Domain_acc_account_TestKey'
      form.value.value = 'test-value'
      form.value.selectedEnvironments = ['ITG']

      await handleCreate()

      expect(styleguide.displayNotification).toHaveBeenCalledWith(
        'error',
        'Impossible de créer la variable d\'environnement',
      )
      expect(mockOnSuccess).not.toHaveBeenCalled()
      expect(mockOnClose).not.toHaveBeenCalled()
    })

    it('should set isCreating to true during creation', async () => {
      let resolveCreate: () => void
      const createPromise = new Promise<void>((resolve) => {
        resolveCreate = resolve
      })
      vi.mocked(AppSettingsListService.createAppSetting).mockReturnValue(createPromise)

      const { form, handleCreate, isCreating } = useAddAppSettingDialog({
        onSuccess: mockOnSuccess,
        onClose: mockOnClose,
      })

      form.value.name = 'Domain_acc_account_TestKey'
      form.value.value = 'test-value'
      form.value.selectedEnvironments = ['ITG']

      expect(isCreating.value).toBe(false)

      const createCallPromise = handleCreate()
      await nextTick()

      expect(isCreating.value).toBe(true)

      resolveCreate!()
      await createCallPromise

      expect(isCreating.value).toBe(false)
    })

    it('should not call API if validation fails', async () => {
      const { form, handleCreate } = useAddAppSettingDialog({
        onSuccess: mockOnSuccess,
        onClose: mockOnClose,
      })

      form.value.name = 'InvalidName'
      form.value.value = 'test-value'
      form.value.selectedEnvironments = ['ITG']

      await handleCreate()

      expect(AppSettingsListService.createAppSetting).not.toHaveBeenCalled()
      expect(mockOnSuccess).not.toHaveBeenCalled()
    })
  })
})
