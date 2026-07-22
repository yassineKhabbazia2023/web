import { computed, onMounted, ref } from 'vue'
import { CurrentUserManager } from '@pulse/common/managers'
import { ACTION_PERMISSIONS } from '@pulse/common/constants'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import { fetchAccountOperations } from '@entities/services/registry'
import { MANAGE_ACCESS_COUNT_PAGE, MANAGE_ACCESS_COUNT_PAGE_SIZE } from './folders.consts'

export function useFoldersManageAccess() {
  const isManageAccessDrawerOpened = ref(false)
  const manageAccessCount = ref<number>()

  const hasManageAccess = computed(() =>
    CurrentUserManager.hasPermission(ACTION_PERMISSIONS.MANAGE_ACCESS),
  )

  const isManageAccessButtonDisabled = computed(() => (manageAccessCount.value ?? 0) < 1)

  async function loadManageAccessCount() {
    if (hasManageAccess.value === false) {
      return
    }

    // Only the totalItems is needed, hence the smallest possible page
    const { totalItems } = await fetchAccountOperations(
      MANAGE_ACCESS_COUNT_PAGE,
      MANAGE_ACCESS_COUNT_PAGE_SIZE,
    )

    manageAccessCount.value = totalItems
  }

  function onManageAccessButtonClick() {
    if (hasManageAccess.value && (manageAccessCount.value ?? 0) > 0) {
      AmplitudeService.track('Registry Validation Initiated', {
        registry_validation_initialisation_localisation: 'portefeuille',
      })
      isManageAccessDrawerOpened.value = true
    }
  }

  async function onUpdateManageAccessDrawerOpened(isOpened: boolean) {
    if (isOpened === false) {
      await loadManageAccessCount()
    }
  }

  onMounted(() => {
    loadManageAccessCount()
  })

  return {
    isManageAccessDrawerOpened,
    manageAccessCount,
    hasManageAccess,
    isManageAccessButtonDisabled,
    onManageAccessButtonClick,
    onUpdateManageAccessDrawerOpened,
  }
}
