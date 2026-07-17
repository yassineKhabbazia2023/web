import { FeatureFlagManager } from '@pulse/common/managers'
import { useWalletFeatureFlags } from './wallet-feature-flags.composable'

const isLastActivityFeatureActivatedSpy = vi.fn(() => false)
const isWalletTableLoadMorePaginationActivatedSpy = vi.fn(() => false)
const isManageWalletMenuActivatedSpy = vi.fn(() => false)

type WalletFeatureFlagKey = keyof ReturnType<typeof useWalletFeatureFlags>

describe('useWalletFeatureFlags', () => {
  beforeEach(() => {
    vi.spyOn(FeatureFlagManager, 'isLastActivityFeatureActivated').mockImplementation(isLastActivityFeatureActivatedSpy)
    vi.spyOn(FeatureFlagManager, 'isWalletTableLoadMorePaginationActivated').mockImplementation(isWalletTableLoadMorePaginationActivatedSpy)
    vi.spyOn(FeatureFlagManager, 'isManageWalletMenuActivated').mockImplementation(isManageWalletMenuActivatedSpy)
    isLastActivityFeatureActivatedSpy.mockReturnValue(false)
    isWalletTableLoadMorePaginationActivatedSpy.mockReturnValue(false)
    isManageWalletMenuActivatedSpy.mockReturnValue(false)
  })

  it.each([
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
  ])('returns $flagName as $expectedValue when feature flag is $description', ({ flagName, mockFn, expectedValue }) => {
    mockFn.mockReturnValue(expectedValue)

    const result = useWalletFeatureFlags()

    expect(result[flagName].value).toBe(expectedValue)
  })

  it('returns all three feature flags with correct values', () => {
    isLastActivityFeatureActivatedSpy.mockReturnValue(true)
    isWalletTableLoadMorePaginationActivatedSpy.mockReturnValue(false)
    isManageWalletMenuActivatedSpy.mockReturnValue(true)

    const {
      isLastActivityFeatureActivated,
      isLoadMorePaginationActivated,
      isManageWalletMenuActivated,
    } = useWalletFeatureFlags()

    expect(isLastActivityFeatureActivated.value).toBe(true)
    expect(isLoadMorePaginationActivated.value).toBe(false)
    expect(isManageWalletMenuActivated.value).toBe(true)
  })
})
