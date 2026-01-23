import { useAddAppSettingDialog } from './add-app-setting-dialog.composable'
import { AppSettingsListService } from '@backoffice/services/app-settings-list/app-settings-list.service'
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
  logger: { info: vi.fn(), error: vi.fn() },
}))

describe('useAddAppSettingDialog - extra branches', () => {
  const onSuccess = vi.fn()
  const onClose = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('validateForm should set error when name format is invalid', async () => {
    const { form, handleCreate, errors } = useAddAppSettingDialog({ onSuccess, onClose })

    form.value.name = 'InvalidName'
    form.value.valuesByTarget = { ITG: 'v' }

    await handleCreate()

    expect(errors.value.name).toBe('Le nom de la clé doit respecter le format : Domain_xxx_nomdomain_nomcle')
    expect(AppSettingsListService.createAppSetting).not.toHaveBeenCalled()
  })

  it('validateForm should set error when no target value is provided', async () => {
    const { form, handleCreate, errors } = useAddAppSettingDialog({ onSuccess, onClose })

    form.value.name = 'Domain_abc_account_key'
    form.value.valuesByTarget = { ITG: '   ' } // only spaces => should count as empty

    await handleCreate()

    expect(errors.value.valuesByTarget).toBe('Renseignez au moins une valeur pour un environnement ou un label')
    expect(AppSettingsListService.createAppSetting).not.toHaveBeenCalled()
  })

  it('handleClose should do nothing when isCreating is true', () => {
    const { handleClose, isCreating } = useAddAppSettingDialog({ onSuccess, onClose })

    isCreating.value = true
    handleClose()

    expect(onClose).not.toHaveBeenCalled()
  })

  it('loadAvailableEnvironments should set error flags on failure', async () => {
    vi.mocked(AppSettingsListService.getAvailableEnvironments).mockRejectedValue(new Error('fail'))

    const { loadAvailableEnvironments, hasEnvironmentLoadError, availableEnvironments } =
      useAddAppSettingDialog({ onSuccess, onClose })

    await loadAvailableEnvironments()

    expect(hasEnvironmentLoadError.value).toBe(true)
    expect(availableEnvironments.value).toEqual([])
  })

  it('isFormValid should be false when valuesByTarget is undefined', () => {
    const { form, isFormValid } = useAddAppSettingDialog({ onSuccess, onClose })

    form.value.name = 'Domain_abc_account_key'
    // force undefined for coverage of "?? {}"
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(form.value as any).valuesByTarget = undefined

    expect(isFormValid.value).toBe(false)
  })
})
