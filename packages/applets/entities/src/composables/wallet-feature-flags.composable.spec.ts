import { FeatureFlagManager } from '@pulse/common/managers'
import { useWalletFeatureFlags } from './wallet-feature-flags.composable'

const isFavoriteSortActivatedSpy = vi.fn(() => false)
const isLastActivityFeatureActivatedSpy = vi.fn(() => false)
const isWalletTableLoadMorePaginationActivatedSpy = vi.fn(() => false)
const isManageWalletMenuActivatedSpy = vi.fn(() => false)
const isWalletV2ActivatedSpy = vi.fn(() => false)

type WalletFeatureFlagKey = keyof ReturnType<typeof useWalletFeatureFlags>

describe('useWalletFeatureFlags', () => {
  beforeEach(() => {
    vi.spyOn(FeatureFlagManager, 'isFavoriteSortActivated').mockImplementation(isFavoriteSortActivatedSpy)
    vi.spyOn(FeatureFlagManager, 'isLastActivityFeatureActivated').mockImplementation(isLastActivityFeatureActivatedSpy)
    vi.spyOn(FeatureFlagManager, 'isWalletTableLoadMorePaginationActivated').mockImplementation(isWalletTableLoadMorePaginationActivatedSpy)
    vi.spyOn(FeatureFlagManager, 'isManageWalletMenuActivated').mockImplementation(isManageWalletMenuActivatedSpy)
    vi.spyOn(FeatureFlagManager, 'isWalletV2Activated').mockImplementation(isWalletV2ActivatedSpy)
    isFavoriteSortActivatedSpy.mockReturnValue(false)
    isLastActivityFeatureActivatedSpy.mockReturnValue(false)
    isWalletTableLoadMorePaginationActivatedSpy.mockReturnValue(false)
    isManageWalletMenuActivatedSpy.mockReturnValue(false)
    isWalletV2ActivatedSpy.mockReturnValue(false)
  })

  it.each([
    {
      flagName: 'isFavoriteSortActivated' as WalletFeatureFlagKey,
      mockFn: isFavoriteSortActivatedSpy,
      expectedValue: false,
      description: 'disabled',
    },
    {
      flagName: 'isFavoriteSortActivated' as WalletFeatureFlagKey,
      mockFn: isFavoriteSortActivatedSpy,
      expectedValue: true,
      description: 'enabled',
    },
    {
      flagName: 'isLastActivityFeatureActivated' as WalletFeatureFlagKey,
      mockFn: isLastActivityFeatureActivatedSpy,
      expectedValue: false,
      description: 'disabled',
    },
    {
      flagName: 'isLastActivityFeatureActivated' as WalletFeatureFlagKey,
      mockFn: isLastActivityFeatureActivatedSpy,
      expectedValue: true,
      description: 'enabled',
    },
    {
      flagName: 'isLoadMorePaginationActivated' as WalletFeatureFlagKey,
      mockFn: isWalletTableLoadMorePaginationActivatedSpy,
      expectedValue: false,
      description: 'disabled',
    },
    {
      flagName: 'isLoadMorePaginationActivated' as WalletFeatureFlagKey,
      mockFn: isWalletTableLoadMorePaginationActivatedSpy,
      expectedValue: true,
      description: 'enabled',
    },
    {
      flagName: 'isManageWalletMenuActivated' as WalletFeatureFlagKey,
      mockFn: isManageWalletMenuActivatedSpy,
      expectedValue: false,
      description: 'disabled',
    },
    {
      flagName: 'isManageWalletMenuActivated' as WalletFeatureFlagKey,
      mockFn: isManageWalletMenuActivatedSpy,
      expectedValue: true,
      description: 'enabled',
    },
    {
      flagName: 'isWalletV2Activated' as WalletFeatureFlagKey,
      mockFn: isWalletV2ActivatedSpy,
      expectedValue: false,
      description: 'disabled',
    },
    {
      flagName: 'isWalletV2Activated' as WalletFeatureFlagKey,
      mockFn: isWalletV2ActivatedSpy,
      expectedValue: true,
      description: 'enabled',
    },
  ])('returns $flagName as $expectedValue when feature flag is $description', ({ flagName, mockFn, expectedValue }) => {
    mockFn.mockReturnValue(expectedValue)

    const result = useWalletFeatureFlags()

    expect(result[flagName].value).toBe(expectedValue)
  })

  it('returns all feature flags with correct values', () => {
    isFavoriteSortActivatedSpy.mockReturnValue(true)
    isLastActivityFeatureActivatedSpy.mockReturnValue(true)
    isWalletTableLoadMorePaginationActivatedSpy.mockReturnValue(false)
    isManageWalletMenuActivatedSpy.mockReturnValue(true)
    isWalletV2ActivatedSpy.mockReturnValue(true)

    const {
      isFavoriteSortActivated,
      isLastActivityFeatureActivated,
      isLoadMorePaginationActivated,
      isManageWalletMenuActivated,
      isWalletV2Activated,
    } = useWalletFeatureFlags()

    expect(isFavoriteSortActivated.value).toBe(true)
    expect(isLastActivityFeatureActivated.value).toBe(true)
    expect(isLoadMorePaginationActivated.value).toBe(false)
    expect(isManageWalletMenuActivated.value).toBe(true)
    expect(isWalletV2Activated.value).toBe(true)
  })
})
