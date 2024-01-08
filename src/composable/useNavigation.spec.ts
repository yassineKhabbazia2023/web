import { describe, it, expect, vi, afterEach } from 'vitest'
import useNavigation from '@/composable/useNavigation'

const mockRouterPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockRouterPush
  })
}))

describe('useNavigation', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should navigate to entities', async () => {
    // Setup
    const { navigateToEntities } = useNavigation()

    // Act
    navigateToEntities()

    // Assert
    expect(mockRouterPush).toHaveBeenCalledWith({ name: 'entities' })
  })
})
