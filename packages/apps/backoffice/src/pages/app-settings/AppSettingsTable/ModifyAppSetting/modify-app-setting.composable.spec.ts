import { nextTick } from 'vue'
import { useModifyAppSetting } from './modify-app-setting.composable'
import { AppSettingsListService } from '@backoffice/services/app-settings-list/app-settings-list.service'
import { displayNotification } from '@pulse/styleguide'

describe('useModifyAppSetting', () => {
  const mockOnSuccess = vi.fn()
  const mockOnClose = vi.fn()

  const mockItem = {
    key: 'Domain_acc_account_TestKey',
    type: 'string',
    domain: 'account',
    hasIncoherence: false,
    hasMissing: false,
    values: [
      // env-only (backend returns envLabel=ITG)
      {
        environment: 'ITG',
        envLabel: 'ITG',
        value: 'old-itg',
        eTag: 'etag-itg-env',
        lastModified: '2026-01-01T00:00:00Z',
      },
      // label (backend returns label=itg01 + envLabel=ITG01)
      {
        environment: 'ITG',
        label: 'itg01',
        envLabel: 'ITG01',
        value: 'old-itg01',
        eTag: 'etag-itg01',
        lastModified: '2026-01-01T00:00:00Z',
      },
    ],
  } as any

  beforeEach(() => {
    vi.spyOn(AppSettingsListService, 'getAvailableEnvironments').mockResolvedValue([])
    vi.spyOn(AppSettingsListService, 'updateAppSetting').mockResolvedValue()
  })

  it('should initialize with default state', () => {
    const { form, errors, isSaving, hasEnvironmentLoadError } = useModifyAppSetting({
      onSuccess: mockOnSuccess,
      onClose: mockOnClose,
    })

    expect(form.value).toEqual({ name: '', valuesByTarget: {} })
    expect(errors.value).toEqual({})
    expect(isSaving.value).toBe(false)
    expect(hasEnvironmentLoadError.value).toBe(false)
  })

  it('initializeFromItem should fill form.valuesByTarget and store eTags', () => {
    const { form, initializeFromItem } = useModifyAppSetting({
      onSuccess: mockOnSuccess,
      onClose: mockOnClose,
    })

    initializeFromItem(mockItem)

    // env-only => key = "ITG"
    expect(form.value.valuesByTarget['ITG']).toBe('old-itg')

    // label => key = "ITG:itg01"
    expect(form.value.valuesByTarget['ITG:itg01']).toBe('old-itg01')

    expect(form.value.name).toBe(mockItem.key)
  })

  it('isFormValid should be true only when name + at least one value', () => {
    const { form, isFormValid } = useModifyAppSetting({
      onSuccess: mockOnSuccess,
      onClose: mockOnClose,
    })

    expect(isFormValid.value).toBe(false)

    form.value.name = 'Domain_acc_account_TestKey'
    expect(isFormValid.value).toBe(false)

    form.value.valuesByTarget = { ITG: 'x' }
    expect(isFormValid.value).toBe(true)
  })

  it('handleSave should not call API if validation fails (empty)', async () => {
    const { handleSave } = useModifyAppSetting({
      onSuccess: mockOnSuccess,
      onClose: mockOnClose,
    })

    await handleSave()

    expect(AppSettingsListService.updateAppSetting).not.toHaveBeenCalled()
    expect(mockOnSuccess).not.toHaveBeenCalled()
    expect(mockOnClose).not.toHaveBeenCalled()
  })

  it('should build payload with envLabel for env-only and label for env:label', async () => {
    vi.mocked(AppSettingsListService.updateAppSetting).mockResolvedValue()

    const { initializeFromItem, form, handleSave } = useModifyAppSetting({
      onSuccess: mockOnSuccess,
      onClose: mockOnClose,
    })

    initializeFromItem(mockItem)

    // Modify both values
    form.value.valuesByTarget['ITG'] = 'new-itg'
    form.value.valuesByTarget['ITG:itg01'] = 'new-itg01'

    await handleSave()

    expect(AppSettingsListService.updateAppSetting).toHaveBeenCalledTimes(1)
    expect(AppSettingsListService.updateAppSetting).toHaveBeenCalledWith({
      name: mockItem.key,
      targets: expect.arrayContaining([
        // env-only => label empty + envLabel present
        {
          environment: 'ITG',
          label: '',
          envLabel: 'ITG',
          value: 'new-itg',
          eTag: 'etag-itg-env',
        },
        // env:label => label present (envLabel not sent)
        {
          environment: 'ITG',
          label: 'itg01',
          value: 'new-itg01',
          eTag: 'etag-itg01',
        },
      ]),
    })
  })

  it('should only send changed targets (diff against snapshot)', async () => {
    vi.mocked(AppSettingsListService.updateAppSetting).mockResolvedValue()

    const { initializeFromItem, form, handleSave } = useModifyAppSetting({
      onSuccess: mockOnSuccess,
      onClose: mockOnClose,
    })

    initializeFromItem(mockItem)

    // Only change ITG env-only
    form.value.valuesByTarget['ITG'] = 'changed'
    // Keep ITG:itg01 same
    form.value.valuesByTarget['ITG:itg01'] = 'old-itg01'

    await handleSave()

    const calledPayload = vi.mocked(AppSettingsListService.updateAppSetting).mock.calls[0][0]
    expect(calledPayload.targets).toHaveLength(1)
    expect(calledPayload.targets[0]).toEqual({
      environment: 'ITG',
      label: '',
      envLabel: 'ITG',
      value: 'changed',
      eTag: 'etag-itg-env',
    })
  })

  it('handleSave should not call API when no target changed', async () => {
    vi.mocked(AppSettingsListService.updateAppSetting).mockResolvedValue()

    const { initializeFromItem, handleSave } = useModifyAppSetting({
      onSuccess: mockOnSuccess,
      onClose: mockOnClose,
    })

    initializeFromItem(mockItem)

    await handleSave()

    expect(AppSettingsListService.updateAppSetting).not.toHaveBeenCalled()
    expect(mockOnSuccess).not.toHaveBeenCalled()
    expect(mockOnClose).not.toHaveBeenCalled()
  })

  it('handleSave should not call API when a value was cleared', async () => {
    vi.mocked(AppSettingsListService.updateAppSetting).mockResolvedValue()

    const { initializeFromItem, form, handleSave } = useModifyAppSetting({
      onSuccess: mockOnSuccess,
      onClose: mockOnClose,
    })

    initializeFromItem(mockItem)

    // Clear an existing value and change another to keep form valid
    form.value.valuesByTarget['ITG'] = ''
    form.value.valuesByTarget['ITG:itg01'] = 'new-itg01'

    await handleSave()

    expect(AppSettingsListService.updateAppSetting).not.toHaveBeenCalled()
    expect(mockOnSuccess).not.toHaveBeenCalled()
    expect(mockOnClose).not.toHaveBeenCalled()
  })

  it('handleSave should call onSuccess + onClose and show success notification', async () => {
    vi.mocked(AppSettingsListService.updateAppSetting).mockResolvedValue()

    const { initializeFromItem, form, handleSave } = useModifyAppSetting({
      onSuccess: mockOnSuccess,
      onClose: mockOnClose,
    })

    initializeFromItem(mockItem)
    form.value.valuesByTarget['ITG'] = 'changed'

    await handleSave()

    expect(vi.mocked(displayNotification)).toHaveBeenCalledWith(
      'success',
      "Variable d'environnement mise à jour avec succès",
    )
    expect(mockOnSuccess).toHaveBeenCalledTimes(1)
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('handleSave should show error notification on API failure', async () => {
    vi.mocked(AppSettingsListService.updateAppSetting).mockRejectedValue(new Error('fail'))

    const { initializeFromItem, form, handleSave } = useModifyAppSetting({
      onSuccess: mockOnSuccess,
      onClose: mockOnClose,
    })

    initializeFromItem(mockItem)
    form.value.valuesByTarget['ITG'] = 'changed'

    await handleSave()

    expect(vi.mocked(displayNotification)).toHaveBeenCalledWith(
      'error',
      "Impossible de modifier la variable d'environnement",
    )
    expect(mockOnSuccess).not.toHaveBeenCalled()
    expect(mockOnClose).not.toHaveBeenCalled()
  })

  it('handleClose should call onClose and reset form when not saving', () => {
    const { form, initializeFromItem, handleClose } = useModifyAppSetting({
      onSuccess: mockOnSuccess,
      onClose: mockOnClose,
    })

    initializeFromItem(mockItem)
    expect(form.value.name).toBe(mockItem.key)

    handleClose()

    expect(mockOnClose).toHaveBeenCalledTimes(1)
    expect(form.value).toEqual({ name: '', valuesByTarget: {} })
  })

  it('loadAvailableEnvironments should set environments and loading flags', async () => {
    const mockEnvs = [
      { environment: 'ITG', labels: ['itg01'] },
      { environment: 'PRD', labels: [] },
    ] as any

    vi.mocked(AppSettingsListService.getAvailableEnvironments).mockResolvedValue(mockEnvs)

    const {
      loadAvailableEnvironments,
      availableEnvironments,
      isLoadingEnvironments,
      hasEnvironmentLoadError,
    } = useModifyAppSetting({
      onSuccess: mockOnSuccess,
      onClose: mockOnClose,
    })

    expect(isLoadingEnvironments.value).toBe(false)

    const p = loadAvailableEnvironments()
    expect(isLoadingEnvironments.value).toBe(true)

    await p

    expect(isLoadingEnvironments.value).toBe(false)
    expect(hasEnvironmentLoadError.value).toBe(false)
    expect(availableEnvironments.value).toEqual(mockEnvs)
  })

  it('loadAvailableEnvironments should handle error', async () => {
    vi.mocked(AppSettingsListService.getAvailableEnvironments).mockRejectedValue(new Error('fail'))

    const { loadAvailableEnvironments, hasEnvironmentLoadError, availableEnvironments } =
      useModifyAppSetting({
        onSuccess: mockOnSuccess,
        onClose: mockOnClose,
      })

    await loadAvailableEnvironments()

    expect(hasEnvironmentLoadError.value).toBe(true)
    expect(availableEnvironments.value).toEqual([])
  })

  it('isSaving should be true during save', async () => {
    let resolveFn!: () => void
    const promise = new Promise<void>((resolve) => {
      resolveFn = resolve
    })
    vi.mocked(AppSettingsListService.updateAppSetting).mockReturnValue(promise)

    const { initializeFromItem, form, handleSave, isSaving } = useModifyAppSetting({
      onSuccess: mockOnSuccess,
      onClose: mockOnClose,
    })

    initializeFromItem(mockItem)
    form.value.valuesByTarget['ITG'] = 'changed'

    expect(isSaving.value).toBe(false)

    const savePromise = handleSave()
    await nextTick()
    expect(isSaving.value).toBe(true)

    resolveFn()
    await savePromise
    expect(isSaving.value).toBe(false)
  })

  it('should send eTag="" when missing in eTagsByTarget', async () => {
    vi.mocked(AppSettingsListService.updateAppSetting).mockResolvedValue()

    const { initializeFromItem, form, handleSave } = useModifyAppSetting({
      onSuccess: mockOnSuccess,
      onClose: mockOnClose,
    })

    // Force un item sans eTag sur ITG env-only
    const itemWithoutEtag = {
      ...mockItem,
      values: [
        {
          environment: 'ITG',
          envLabel: 'ITG',
          value: 'old-itg',
          eTag: undefined, // ✅ pas d'etag
          lastModified: '2026-01-01T00:00:00Z',
        },
      ],
    } as any

    initializeFromItem(itemWithoutEtag)

    // change value to trigger payload
    form.value.valuesByTarget.ITG = 'new-itg'

    await handleSave()

    expect(AppSettingsListService.updateAppSetting).toHaveBeenCalledWith({
      name: itemWithoutEtag.key,
      targets: [
        { environment: 'ITG', label: '', envLabel: 'ITG', value: 'new-itg', eTag: '' }, // ✅ eTag vide + envLabel
      ],
    })
  })
})
