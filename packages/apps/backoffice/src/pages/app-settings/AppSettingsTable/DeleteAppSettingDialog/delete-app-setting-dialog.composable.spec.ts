import { useDeleteAppSettingDialog } from './delete-app-setting-dialog.composable'
import { AppSettingsListService } from '@backoffice/services/app-settings-list/app-settings-list.service'
import type { DeleteAppSettingResponse } from '@backoffice/services/app-settings-list/app-settings-list.service.type'

vi.mock('@backoffice/services/app-settings-list/app-settings-list.service')
vi.mock('@pulse/styleguide', () => ({
  displayNotification: vi.fn(),
}))
vi.mock('@pulse/toolbox', () => ({
  logger: {
    error: vi.fn(),
    warn: vi.fn(),
  },
}))

describe('useDeleteAppSettingDialog', () => {
  let appSettingKey: string
  let onDeletedCallback: ReturnType<typeof vi.fn>

  beforeEach(() => {
    appSettingKey = 'TEST_KEY'
    onDeletedCallback = vi.fn()
  })

  describe('Initial state', () => {
    it('should initialize with empty selection', () => {
      const { selectedEnvironments } = useDeleteAppSettingDialog(
        appSettingKey,
        onDeletedCallback,
      )

      expect(selectedEnvironments.value).toEqual([])
    })

    it('should initialize hasSelectedEnvironments as false', () => {
      const { hasSelectedEnvironments } = useDeleteAppSettingDialog(
        appSettingKey,
        onDeletedCallback,
      )

      expect(hasSelectedEnvironments.value).toBe(false)
    })
  })

  describe('Environment selection', () => {
    it('should allow selecting individual environment labels', () => {
      const { selectedEnvironments } = useDeleteAppSettingDialog(
        appSettingKey,
        onDeletedCallback,
      )

      selectedEnvironments.value = ['ITG:ITG01', 'REC:REC01']

      expect(selectedEnvironments.value).toEqual(['ITG:ITG01', 'REC:REC01'])
    })

    it('should allow selecting whole environments without labels', () => {
      const { selectedEnvironments } = useDeleteAppSettingDialog(
        appSettingKey,
        onDeletedCallback,
      )

      selectedEnvironments.value = ['ITG', 'REC']

      expect(selectedEnvironments.value).toEqual(['ITG', 'REC'])
    })

    it('should allow mixed selection (ENV and ENV:LABEL)', () => {
      const { selectedEnvironments } = useDeleteAppSettingDialog(
        appSettingKey,
        onDeletedCallback,
      )

      selectedEnvironments.value = ['ITG', 'REC:REC01']

      expect(selectedEnvironments.value).toEqual(['ITG', 'REC:REC01'])
    })

    it('should update hasSelectedEnvironments when environments are selected', () => {
      const { selectedEnvironments, hasSelectedEnvironments } = useDeleteAppSettingDialog(
        appSettingKey,
        onDeletedCallback,
      )

      selectedEnvironments.value = ['ITG:ITG01']

      expect(hasSelectedEnvironments.value).toBe(true)
    })
  })

  describe('resetSelection', () => {
    it('should reset selection to initial state', () => {
      const { selectedEnvironments, resetSelection } = useDeleteAppSettingDialog(
        appSettingKey,
        onDeletedCallback,
      )

      selectedEnvironments.value = ['ITG:ITG01', 'REC:REC01']

      resetSelection()

      expect(selectedEnvironments.value).toEqual([])
    })
  })

  describe('deleteAppSetting', () => {
    it('should return false if no environments are selected', async () => {
      const { deleteAppSetting } = useDeleteAppSettingDialog(
        appSettingKey,
        onDeletedCallback,
      )

      const result = await deleteAppSetting()

      expect(result).toBe(false)
      expect(AppSettingsListService.deleteAppSetting).not.toHaveBeenCalled()
    })

    it('should call API with selected environments and show success notification', async () => {
      const mockResponse: DeleteAppSettingResponse = {
        deleted: 2,
        errors: [],
        results: [],
        message: 'Success',
      }
      vi.mocked(AppSettingsListService.deleteAppSetting).mockResolvedValue(mockResponse)

      const { selectedEnvironments, deleteAppSetting } = useDeleteAppSettingDialog(
        appSettingKey,
        onDeletedCallback,
      )

      selectedEnvironments.value = ['ITG:ITG01', 'REC:REC01']
      const result = await deleteAppSetting()

      expect(result).toBe(true)
      expect(AppSettingsListService.deleteAppSetting).toHaveBeenCalledExactlyOnceWith('TEST_KEY', ['ITG:ITG01', 'REC:REC01'])
      expect(onDeletedCallback).toHaveBeenCalled()
    })

    it('should handle deleted = 0 with warning notification', async () => {
      const mockResponse: DeleteAppSettingResponse = {
        deleted: 0,
        errors: [],
        results: [],
        message: 'Variable already deleted',
      }
      vi.mocked(AppSettingsListService.deleteAppSetting).mockResolvedValue(mockResponse)

      const { selectedEnvironments, deleteAppSetting } = useDeleteAppSettingDialog(
        appSettingKey,
        onDeletedCallback,
      )

      selectedEnvironments.value = ['ITG:ITG01']
      const result = await deleteAppSetting()

      expect(result).toBe(true)
      expect(onDeletedCallback).toHaveBeenCalled()
    })

    it('should handle partial success with warning notification when deleted >= 1 and has errors', async () => {
      const mockResponse: DeleteAppSettingResponse = {
        deleted: 1,
        errors: ['Error in REC'],
        results: [],
        message: 'Partial success',
      }
      vi.mocked(AppSettingsListService.deleteAppSetting).mockResolvedValue(mockResponse)

      const { selectedEnvironments, deleteAppSetting } = useDeleteAppSettingDialog(
        appSettingKey,
        onDeletedCallback,
      )

      selectedEnvironments.value = ['ITG:ITG01', 'REC:REC01']
      const result = await deleteAppSetting()

      expect(result).toBe(true)
      expect(onDeletedCallback).toHaveBeenCalled()
    })

    it('should handle API error and show error notification', async () => {
      vi.mocked(AppSettingsListService.deleteAppSetting).mockRejectedValue(new Error('API Error'))

      const { selectedEnvironments, deleteAppSetting } = useDeleteAppSettingDialog(
        appSettingKey,
        onDeletedCallback,
      )

      selectedEnvironments.value = ['ITG:ITG01']
      const result = await deleteAppSetting()

      expect(result).toBe(false)
      expect(onDeletedCallback).not.toHaveBeenCalled()
    })
  })
})
