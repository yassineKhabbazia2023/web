import { ref, computed } from 'vue'
import { displayNotification } from '@pulse/styleguide'
import { logger } from '@pulse/toolbox'
import { AppSettingsListService } from '@backoffice/services/app-settings-list/app-settings-list.service'

/**
 * Composable to manage environment selection logic and app settings deletion
 * @param appSettingKey - The key of the app setting to delete
 * @param onDeleted - Callback function to execute after successful deletion
 */
export function useDeleteAppSettingDialog(
  appSettingKey: string,
  onDeleted: () => void,
) {
  const selectedEnvironments = ref<string[]>([])

  const hasSelectedEnvironments = computed(() => selectedEnvironments.value.length > 0)

  const resetSelection = () => {
    selectedEnvironments.value = []
  }

  const deleteAppSetting = async (): Promise<boolean> => {
    if (selectedEnvironments.value.length === 0) {
      logger.warn('No environments selected for deletion')
      return false
    }

    try {
      const response = await AppSettingsListService.deleteAppSetting(
        appSettingKey,
        selectedEnvironments.value,
      )

      const deletedCount = response.deleted
      const hasErrors = response.errors && response.errors.length > 0

      if (deletedCount === 0) {
        displayNotification(
          'warning',
          response.message || `La variable "${appSettingKey}" n'a pas pu être supprimée. Elle a peut-être déjà été supprimée.`,
        )
        logger.warn('No deletion occurred:', response)
      } else if (hasErrors === true && deletedCount >= 1) {
        displayNotification(
          'warning',
          response.message || `Variable "${appSettingKey}" partiellement supprimée. ${deletedCount} suppression(s) réussie(s), ${response.errors.length} erreur(s).`,
        )
        logger.warn('Partial deletion success:', response.errors)
      } else {
        displayNotification(
          'success',
          response.message || `Variable "${appSettingKey}" supprimée avec succès`,
        )
      }

      onDeleted()
      return true
    } catch (error: any) {
      logger.error('Failed to delete app setting:', error)
      displayNotification(
        'error',
        error?.response?.data?.message || `Erreur lors de la suppression de la variable "${appSettingKey}"`,
      )
      return false
    }
  }

  return {
    selectedEnvironments,
    hasSelectedEnvironments,
    resetSelection,
    deleteAppSetting,
  }
}
