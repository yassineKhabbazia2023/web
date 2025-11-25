import { ref, computed, onMounted } from 'vue'
import { AppSettingsListService } from '@backoffice/services/app-settings-list/app-settings-list.service'
import type { DomainItem } from '@backoffice/services/app-settings-list/app-settings-list.service.type'

export interface DomainOption {
  pValue: string
  pLabel: string
}

export const useAppSettingsToolbar = () => {
  const domains = ref<DomainItem[]>([])
  const isLoadingDomains = ref(false)

  const fetchDomains = async () => {
    isLoadingDomains.value = true
    try {
      domains.value = await AppSettingsListService.getDomains()
    } catch {
      domains.value = []
    } finally {
      isLoadingDomains.value = false
    }
  }

  const domainOptions = computed<DomainOption[]>(() => {
    return domains.value.map(domain => ({
      pValue: domain.domainName,
      pLabel: `${domain.domainName} (${domain.keysCount})`,
    }))
  })

  onMounted(() => {
    fetchDomains()
  })

  return {
    domains,
    isLoadingDomains,
    domainOptions,
    fetchDomains,
  }
}
