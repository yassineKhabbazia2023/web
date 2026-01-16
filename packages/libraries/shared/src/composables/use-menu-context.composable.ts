import { computed, ref, toValue } from 'vue'
import type { MaybeRefOrGetter } from 'vue'

import { useRoute } from 'vue-router'
import { useUserStore } from '@pulse/common/stores'
import { CurrentUserManager, PennylanePermissionsManager, ReportingManager } from '@pulse/common/managers'
import type { MenuContext } from '@shared/types/navigation.types'
import type { Permission } from '@pulse/common/types'

/**
 * Check if user has a specific permission
 */
function hasPermission(permission: Permission[]): boolean {
  return CurrentUserManager.hasPermission(permission) === true
}

/**
 * Composable for building the MenuContext used by NavigationManager
 *
 * @param entityId - The current entity ID (ref or getter)
 * @returns An object containing the menuContext computed and refreshBIReports function
 *
 * @example
 * const { menuContext, refreshBIReports } = useMenuContext(() => props.currentEntityId)
 *
 * // Call refreshBIReports when you need to update BI reports permission
 * onMounted(() => refreshBIReports())
 */
export function useMenuContext(entityId: MaybeRefOrGetter<number | undefined>) {
  const route = useRoute()
  const userStore = useUserStore()

  const shouldShowBIReportsInternal = ref(false)

  const refreshBIReports = async () => {
    shouldShowBIReportsInternal.value = await ReportingManager.canShowBIReports()
  }

  const menuContext = computed<MenuContext>(() => {
    return {
      entityId: toValue(entityId) ?? 0,
      isCollab: userStore.isCollab ?? false,
      currentRoute: route,
      hasPermission,
      hasPennylanePermission: PennylanePermissionsManager.hasPermission,
      shouldShowBIReports: shouldShowBIReportsInternal.value,
    }
  })

  return {
    menuContext,
    refreshBIReports,
  }
}
