import { setActivePinia, createPinia } from 'pinia'
import { useAzureDevOpsStore } from './azure-devops.store'

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
})
