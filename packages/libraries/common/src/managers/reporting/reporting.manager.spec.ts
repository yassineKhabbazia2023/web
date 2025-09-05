import { CurrentUserManager } from '../current-user/current-user.manager'
import { ReportingService } from '../../services/reporting/reporting.service'
import { useSelectedEntityStore, useUserStore } from '../../stores/main'

import { ReportingManager } from './reporting.manager'

vi.mock('../../stores/main')
vi.mock('../current-user/current-user.manager')
vi.mock('../../services/reporting/reporting.service')

const mockedUseSelectedEntityStore = vi.mocked(useSelectedEntityStore)
const mockedUseUserStore = vi.mocked(useUserStore)
const mockedHasPermission = vi.mocked(CurrentUserManager.hasPermission)
const mockedGetTotalBIReports = vi.mocked(ReportingService.getTotalBIReports)

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
