import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AzureDevOpsRepository, AzureDevOpsUserProfile } from '@backoffice/types/azure-devops.type'
import { AZURE_DEVOPS_CONFIG } from '@backoffice/constants/azure-devops.const'

export const useAzureDevOpsStore = defineStore('azure-devops', () => {
  const pat = ref<string>('')
  const repositories = ref<AzureDevOpsRepository[]>([])
  const selectedRepository = ref<string>(AZURE_DEVOPS_CONFIG.repository)
  const selectedRepositories = ref<string[]>([])
  const isLoadingRepositories = ref<boolean>(false)
  const currentUserProfile = ref<AzureDevOpsUserProfile | null>(null)

  const hasPat = computed(() => pat.value.length > 0)
  const hasRepositories = computed(() => repositories.value.length > 0)

  const getEffectiveRepositories = computed(() => {
    const validNames = new Set(repositories.value.map((repo) => repo.name))
    return selectedRepositories.value.filter((name) => validNames.has(name))
  })

  const hasMultipleRepositoriesSelected = computed(() => getEffectiveRepositories.value.length > 1)

  const setPat = (value: string) => {
    pat.value = value
  }

  const setRepositories = (repos: AzureDevOpsRepository[]) => {
    repositories.value = repos
  }

  const setSelectedRepository = (repo: string) => {
    selectedRepository.value = repo
  }

  const setSelectedRepositories = (repos: string[]) => {
    selectedRepositories.value = repos
  }

  const setIsLoadingRepositories = (loading: boolean) => {
    isLoadingRepositories.value = loading
  }

  const resetRepositories = () => {
    repositories.value = []
    selectedRepository.value = AZURE_DEVOPS_CONFIG.repository
    selectedRepositories.value = []
  }

  const setCurrentUserProfile = (profile: AzureDevOpsUserProfile) => {
    currentUserProfile.value = profile
  }

  return {
    pat,
    hasPat,
    setPat,
    repositories,
    hasRepositories,
    setRepositories,
    selectedRepository,
    setSelectedRepository,
    selectedRepositories,
    setSelectedRepositories,
    hasMultipleRepositoriesSelected,
    getEffectiveRepositories,
    isLoadingRepositories,
    setIsLoadingRepositories,
    resetRepositories,
    currentUserProfile,
    setCurrentUserProfile,
  }
})
