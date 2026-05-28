import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AzureDevOpsRepository, AzureDevOpsUserProfile } from '@backoffice/types/azure-devops.type'
import { AZURE_DEVOPS_CONFIG } from '@backoffice/constants/azure-devops.const'

export const useAzureDevOpsStore = defineStore('azure-devops', () => {
  const pat = ref<string>('')
  const repositories = ref<AzureDevOpsRepository[]>([])
  const selectedRepository = ref<string>(AZURE_DEVOPS_CONFIG.repository)
  const isLoadingRepositories = ref<boolean>(false)
  const currentUserProfile = ref<AzureDevOpsUserProfile | null>(null)

  const hasPat = computed(() => pat.value.length > 0)
  const hasRepositories = computed(() => repositories.value.length > 0)

  const setPat = (value: string) => {
    pat.value = value
  }

  const setRepositories = (repos: AzureDevOpsRepository[]) => {
    repositories.value = repos
  }

  const setSelectedRepository = (repo: string) => {
    selectedRepository.value = repo
  }

  const setIsLoadingRepositories = (loading: boolean) => {
    isLoadingRepositories.value = loading
  }

  const resetRepositories = () => {
    repositories.value = []
    selectedRepository.value = AZURE_DEVOPS_CONFIG.repository
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
    isLoadingRepositories,
    setIsLoadingRepositories,
    resetRepositories,
    currentUserProfile,
    setCurrentUserProfile,
  }
})
