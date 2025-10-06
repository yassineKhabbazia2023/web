import { envVarsMock } from '@pulse/common/mocks'
import { useSelectedEntityStore, useUserStore } from '../../stores/main'
import { CurrentUserManager } from '../current-user/current-user.manager'
import { ReportingService } from '../../services/reporting/reporting.service'
import { FeatureFlagManager } from '../feature-flag/feature-flag.manager'
import { ReportingManager } from './reporting.manager'

vi.mock('../feature-flag/feature-flag.manager')
vi.mock('../../stores/main')
vi.mock('../current-user/current-user.manager')
vi.mock('../../services/reporting/reporting.service')
vi.mock('env-vars', () => envVarsMock)

const mockedUseSelectedEntityStore = vi.mocked(useSelectedEntityStore)
const mockedUseUserStore = vi.mocked(useUserStore)
const mockedHasPermission = vi.mocked(CurrentUserManager.hasPermission)
const mockedGetTotalBIReports = vi.mocked(ReportingService.getTotalBIReports)
const mockedIsClarityOfferActivated = vi.mocked(FeatureFlagManager.isClarityOfferActivated)

describe('ReportingManager.canShowBIReports', () => {
  let selectedEntityStoreMock: any
  let userStoreMock: any

  beforeEach(() => {
    selectedEntityStoreMock = {
      selectedEntityId: 1,
      selectedEntity: {
        isClarityVisible: true,
        isSignatory: true,
      },
    }
    userStoreMock = {
      isCollab: true,
    }
    mockedUseSelectedEntityStore.mockReturnValue(selectedEntityStoreMock)
    mockedUseUserStore.mockReturnValue(userStoreMock)
    vi.clearAllMocks()
  })

  it.each([
    {
      description: 'returns false if selectedEntityId is undefined',
      selectedEntityId: undefined,
      hasPowerBIAccess: true,
      getTotalBIReports: 1,
      selectedEntity: { isClarityVisible: true, isSignatory: true },
      isCollab: true,
      expected: false,
    },
    {
      description: 'returns false if user lacks POWERBI_REPORT permission',
      selectedEntityId: 1,
      hasPowerBIAccess: false,
      getTotalBIReports: 1,
      selectedEntity: { isClarityVisible: true, isSignatory: true },
      isCollab: true,
      expected: false,
    },
    {
      description: 'returns true if there are BI reports available',
      selectedEntityId: 1,
      hasPowerBIAccess: true,
      getTotalBIReports: 3,
      selectedEntity: { isClarityVisible: false, isSignatory: false },
      isCollab: false,
      expected: true,
    },
    {
      description: 'returns true if no reports but clarity visible and signatory',
      selectedEntityId: 1,
      hasPowerBIAccess: true,
      getTotalBIReports: 0,
      selectedEntity: { isClarityVisible: true, isSignatory: true },
      isCollab: false,
      expected: true,
    },
    {
      description: 'returns true if no reports but clarity visible and collaborator',
      selectedEntityId: 1,
      hasPowerBIAccess: true,
      getTotalBIReports: 0,
      selectedEntity: { isClarityVisible: true, isSignatory: false },
      isCollab: true,
      expected: true,
    },
    {
      description: 'returns false if no reports and no matching conditions',
      selectedEntityId: 1,
      hasPowerBIAccess: true,
      getTotalBIReports: 0,
      selectedEntity: { isClarityVisible: false, isSignatory: false },
      isCollab: false,
      expected: false,
    },
  ])(
    '$description',
    async ({ selectedEntityId, hasPowerBIAccess, getTotalBIReports, selectedEntity, isCollab, expected }) => {
      selectedEntityStoreMock.selectedEntityId = selectedEntityId
      selectedEntityStoreMock.selectedEntity = selectedEntity
      userStoreMock.isCollab = isCollab
      mockedHasPermission.mockReturnValue(hasPowerBIAccess)
      mockedGetTotalBIReports.mockResolvedValue(getTotalBIReports)

      const result = await ReportingManager.canShowBIReports()

      expect(result).toBe(expected)

      if (selectedEntityId !== undefined && hasPowerBIAccess) {
        expect(mockedGetTotalBIReports).toHaveBeenCalledWith(selectedEntityId)
      } else {
        expect(mockedGetTotalBIReports).not.toHaveBeenCalled()
      }
    },
  )
})

describe('ReportingManager.canShowSmartOfferWidget', () => {
  let selectedEntityStoreMock: any
  let userStoreMock: any

  beforeEach(() => {
    selectedEntityStoreMock = {
      selectedEntity: {
        isClarityVisible: true,
        isSignatory: false,
      },
    }
    userStoreMock = {
      isCollab: true,
    }
    mockedUseSelectedEntityStore.mockReturnValue(selectedEntityStoreMock)
    mockedUseUserStore.mockReturnValue(userStoreMock)
    vi.clearAllMocks()
  })

  it.each([
    {
      description: 'returns true when clarity is visible and user is collab',
      isClarityOfferActivated: true,
      selectedEntity: { isClarityVisible: true, isSignatory: false },
      user: { isCollab: true },
      expected: true,
    },
    {
      description: 'returns true when clarity is visible and user is signatory',
      isClarityOfferActivated: true,
      selectedEntity: { isClarityVisible: true, isSignatory: true },
      user: { isCollab: false },
      expected: true,
    },
    {
      description: 'returns false when clarity is not visible',
      isClarityOfferActivated: true,
      selectedEntity: { isClarityVisible: false, isSignatory: true },
      user: { isCollab: true },
      expected: false,
    },
    {
      description: 'returns false when feature flag is disabled',
      isClarityOfferActivated: false,
      selectedEntity: { isClarityVisible: true, isSignatory: true },
      user: { isCollab: true },
      expected: false,
    },
    {
      description: 'returns false when user has no access',
      isClarityOfferActivated: true,
      selectedEntity: { isClarityVisible: true, isSignatory: false },
      user: { isCollab: false },
      expected: false,
    },
    {
      description: 'returns false when selectedEntity is null',
      isClarityOfferActivated: true,
      selectedEntity: null,
      user: { isCollab: true },
      expected: false,
    },
    {
      description: 'returns false when user is null',
      isClarityOfferActivated: true,
      selectedEntity: { isClarityVisible: true, isSignatory: true },
      user: null,
      expected: false,
    },
  ])('$description', ({ isClarityOfferActivated, selectedEntity, user, expected }) => {
    mockedIsClarityOfferActivated.mockReturnValue(isClarityOfferActivated)
    selectedEntityStoreMock.selectedEntity = selectedEntity
    userStoreMock.user = user

    const result = ReportingManager.canShowSmartOfferWidget()

    expect(result).toBe(expected)
  })

  describe('ReportingManager.calculateSmartOfferPrice', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    it.each([
      {
        description: 'returns default price when accountNumber is undefined',
        selectedEntity: { accountNumber: undefined },
        expected: ReportingManager.SMART_OFFER_DEFAULT_PRICE,
      },
      {
        description: 'returns default price when accountNumber is null',
        selectedEntity: { accountNumber: null },
        expected: ReportingManager.SMART_OFFER_DEFAULT_PRICE,
      },
      {
        description: 'returns smart offer price when accountNumber is exactly matched',
        selectedEntity: { accountNumber: 'ACC123' },
        expected: envVarsMock.VITE_SMART_OFFER_DIFFERENT_RATE_PRICE,
      },
      {
        description: 'returns smart offer price when accountNumber matches trimmed value',
        selectedEntity: { accountNumber: 'ACC456' },
        expected: envVarsMock.VITE_SMART_OFFER_DIFFERENT_RATE_PRICE,
      },
      {
        description: 'returns default price when accountNumber is not in the list',
        selectedEntity: { accountNumber: 'NOT_IN_LIST' },
        expected: ReportingManager.SMART_OFFER_DEFAULT_PRICE,
      },
    ])('$description', ({ selectedEntity, expected }) => {
      selectedEntityStoreMock = { selectedEntity }
      mockedUseSelectedEntityStore.mockReturnValue(selectedEntityStoreMock)

      const result = ReportingManager.calculateSmartOfferPrice()
      expect(result).toBe(expected)
    })
  })
})
