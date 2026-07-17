import type { EntitySummary, UserInfo } from '@pulse/common/types'
import { envVarsMock } from '@pulse/common/mocks'
import { getStoreMock } from '@pulse/common/mocks/vitest'
import { useCurrentEntityStore, useUserStore } from '../../stores/main'
import { CurrentUserManager } from '../current-user/current-user.manager'
import { ReportingService } from '../../services/reporting/reporting.service'
import { FeatureFlagManager } from '../feature-flag/feature-flag.manager'
import { ReportingManager } from './reporting.manager'

const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)
const userStoreMock = getStoreMock(useUserStore)

describe('ReportingManager.canShowBIReports', () => {
  it.each([
    {
      description: 'returns false if currentEntityId is undefined',
      currentEntityId: undefined,
      hasPowerBIAccess: true,
      getTotalBIReports: 1,
      currentEntity: { isClarityVisible: true, isSignatory: true },
      isCollab: true,
      expected: false,
    },
    {
      description: 'returns false if user lacks POWERBI_REPORT permission',
      currentEntityId: 1,
      hasPowerBIAccess: false,
      getTotalBIReports: 1,
      currentEntity: { isClarityVisible: true, isSignatory: true },
      isCollab: true,
      expected: false,
    },
    {
      description: 'returns true if there are BI reports available',
      currentEntityId: 1,
      hasPowerBIAccess: true,
      getTotalBIReports: 3,
      currentEntity: { isClarityVisible: false, isSignatory: false },
      isCollab: false,
      expected: true,
    },
    {
      description: 'returns true if no reports but clarity visible and signatory',
      currentEntityId: 1,
      hasPowerBIAccess: true,
      getTotalBIReports: 0,
      currentEntity: { isClarityVisible: true, isSignatory: true },
      isCollab: false,
      expected: true,
    },
    {
      description: 'returns true if no reports but clarity visible and collaborator',
      currentEntityId: 1,
      hasPowerBIAccess: true,
      getTotalBIReports: 0,
      currentEntity: { isClarityVisible: true, isSignatory: false },
      isCollab: true,
      expected: true,
    },
    {
      description: 'returns false if no reports and no matching conditions',
      currentEntityId: 1,
      hasPowerBIAccess: true,
      getTotalBIReports: 0,
      currentEntity: { isClarityVisible: false, isSignatory: false },
      isCollab: false,
      expected: false,
    },
  ])(
    '$description',
    async ({ currentEntityId, hasPowerBIAccess, getTotalBIReports, currentEntity, isCollab, expected }) => {
      currentEntityStoreMock.currentEntityId = currentEntityId
      currentEntityStoreMock.currentEntity = currentEntity as unknown as EntitySummary
      userStoreMock.isCollab = isCollab
      vi.spyOn(CurrentUserManager, 'hasPermission').mockReturnValue(hasPowerBIAccess)
      const getTotalBIReportsSpy = vi.spyOn(ReportingService, 'getTotalBIReports')
        .mockResolvedValue(getTotalBIReports)

      const result = await ReportingManager.canShowBIReports()

      expect(result).toBe(expected)

      if (currentEntityId !== undefined && hasPowerBIAccess) {
        expect(getTotalBIReportsSpy).toHaveBeenCalledWith(currentEntityId)
      } else {
        expect(getTotalBIReportsSpy).not.toHaveBeenCalled()
      }
    },
  )
})

describe('ReportingManager.canShowSmartOfferWidget', () => {
  it.each([
    {
      description: 'returns true when clarity is visible and user is collab',
      isClarityOfferActivated: true,
      currentEntity: { isClarityVisible: true, isSignatory: false },
      user: { isCollab: true },
      expected: true,
    },
    {
      description: 'returns true when clarity is visible and user is signatory',
      isClarityOfferActivated: true,
      currentEntity: { isClarityVisible: true, isSignatory: true },
      user: { isCollab: false },
      expected: true,
    },
    {
      description: 'returns false when clarity is not visible',
      isClarityOfferActivated: true,
      currentEntity: { isClarityVisible: false, isSignatory: true },
      user: { isCollab: true },
      expected: false,
    },
    {
      description: 'returns false when feature flag is disabled',
      isClarityOfferActivated: false,
      currentEntity: { isClarityVisible: true, isSignatory: true },
      user: { isCollab: true },
      expected: false,
    },
    {
      description: 'returns false when user has no access',
      isClarityOfferActivated: true,
      currentEntity: { isClarityVisible: true, isSignatory: false },
      user: { isCollab: false },
      expected: false,
    },
    {
      description: 'returns false when currentEntity is null',
      isClarityOfferActivated: true,
      currentEntity: null,
      user: { isCollab: true },
      expected: false,
    },
    {
      description: 'returns false when user is null',
      isClarityOfferActivated: true,
      currentEntity: { isClarityVisible: true, isSignatory: true },
      user: null,
      expected: false,
    },
  ])('$description', ({ isClarityOfferActivated, currentEntity, user, expected }) => {
    vi.spyOn(FeatureFlagManager, 'isClarityOfferActivated').mockReturnValue(isClarityOfferActivated)
    currentEntityStoreMock.currentEntity = currentEntity as unknown as EntitySummary
    userStoreMock.user = user as unknown as UserInfo

    const result = ReportingManager.canShowSmartOfferWidget()

    expect(result).toBe(expected)
  })

  describe('ReportingManager.calculateSmartOfferPrice', () => {
    it.each([
      {
        description: 'returns default price when accountNumber is undefined',
        currentEntity: { accountNumber: undefined },
        expected: ReportingManager.SMART_OFFER_DEFAULT_PRICE,
      },
      {
        description: 'returns default price when accountNumber is null',
        currentEntity: { accountNumber: null },
        expected: ReportingManager.SMART_OFFER_DEFAULT_PRICE,
      },
      {
        description: 'returns smart offer price when accountNumber is exactly matched',
        currentEntity: { accountNumber: 'ACC123' },
        expected: envVarsMock.VITE_SMART_OFFER_DIFFERENT_RATE_PRICE,
      },
      {
        description: 'returns smart offer price when accountNumber matches trimmed value',
        currentEntity: { accountNumber: 'ACC456' },
        expected: envVarsMock.VITE_SMART_OFFER_DIFFERENT_RATE_PRICE,
      },
      {
        description: 'returns default price when accountNumber is not in the list',
        currentEntity: { accountNumber: 'NOT_IN_LIST' },
        expected: ReportingManager.SMART_OFFER_DEFAULT_PRICE,
      },
    ])('$description', ({ currentEntity, expected }) => {
      currentEntityStoreMock.currentEntity = currentEntity as unknown as EntitySummary

      const result = ReportingManager.calculateSmartOfferPrice()
      expect(result).toBe(expected)
    })
  })
})
