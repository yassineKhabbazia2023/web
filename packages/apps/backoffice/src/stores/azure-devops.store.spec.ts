import { setActivePinia, createPinia } from 'pinia'
import { useAzureDevOpsStore } from './azure-devops.store'
import { AZURE_DEVOPS_CONFIG } from '@backoffice/constants/azure-devops.const'

describe('useAzureDevOpsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with empty PAT', () => {
    const store = useAzureDevOpsStore()

    expect(store.pat).toBe('')
    expect(store.hasPat).toBe(false)
  })

  it('should set PAT', () => {
    const store = useAzureDevOpsStore()

    store.setPat('test-pat-token')

    expect(store.pat).toBe('test-pat-token')
    expect(store.hasPat).toBe(true)
  })

  it('should return hasPat=false for empty string', () => {
    const store = useAzureDevOpsStore()
    store.setPat('')

    expect(store.hasPat).toBe(false)
  })

  describe('repositories', () => {
    it('should initialize with empty repositories and default repository', () => {
      const store = useAzureDevOpsStore()

      expect(store.repositories).toEqual([])
      expect(store.hasRepositories).toBe(false)
      expect(store.selectedRepository).toBe(AZURE_DEVOPS_CONFIG.repository)
      expect(store.isLoadingRepositories).toBe(false)
    })

    it('should set repositories', () => {
      const store = useAzureDevOpsStore()
      const mockRepos = [
        { id: '1', name: 'Repo1', defaultBranch: 'main', isDisabled: false },
        { id: '2', name: 'Repo2', defaultBranch: 'main', isDisabled: false },
      ]

      store.setRepositories(mockRepos)

      expect(store.repositories).toEqual(mockRepos)
      expect(store.hasRepositories).toBe(true)
    })

    it('should set selected repository', () => {
      const store = useAzureDevOpsStore()

      store.setSelectedRepository('NewRepo')

      expect(store.selectedRepository).toBe('NewRepo')
    })

    it('should set isLoadingRepositories', () => {
      const store = useAzureDevOpsStore()

      store.setIsLoadingRepositories(true)
      expect(store.isLoadingRepositories).toBe(true)

      store.setIsLoadingRepositories(false)
      expect(store.isLoadingRepositories).toBe(false)
    })

    it('should reset repositories to default state', () => {
      const store = useAzureDevOpsStore()
      store.setRepositories([{ id: '1', name: 'Repo1', defaultBranch: 'main', isDisabled: false }])
      store.setSelectedRepository('Repo1')

      store.resetRepositories()

      expect(store.repositories).toEqual([])
      expect(store.selectedRepository).toBe(AZURE_DEVOPS_CONFIG.repository)
    })
  })
})
