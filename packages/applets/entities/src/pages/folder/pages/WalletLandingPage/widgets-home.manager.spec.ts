import { describe, it, expect, vi, beforeEach } from 'vitest'
import { WidgetsHomeManager } from './widgets-home.manager'
import { WidgetsService } from '@entities/services/widgets/widgets.service'
import { WidgetsGridManager } from '@pulse/widgets/managers'
import { WidgetName } from '@pulse/widgets/enums'
import { logger } from '@pulse/toolbox'
import {
  validWidgetNames,
  invalidWidgetNames,
  mockWidgetGridDefinitions,
  mockWidgetGridDefinitionsWithPermissions,
} from '@entities/__mocks__/widgets-home.mocks'
import { CurrentUserManager } from '@pulse/common/managers'
import { getStoreMock } from '@pulse/common/mocks'
import { useBookingStore } from '@pulse/common/stores'

getStoreMock(useBookingStore)

vi.mock('@entities/services/widgets/widgets.service')
vi.mock('@pulse/widgets/managers')
vi.mock('@pulse/toolbox')

describe('WidgetsHomeManager', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getTemplateToUse', () => {
    it('should return widget definitions for available widgets', () => {
      const isCustomer = false
      const mockWidgets = [validWidgetNames.digilab, validWidgetNames.pennylaneIntro]
      const expectedDefinitions = [
        mockWidgetGridDefinitions[validWidgetNames.digilab],
        mockWidgetGridDefinitions[validWidgetNames.pennylaneIntro],
      ]

      vi.mocked(WidgetsService.getHomeWidgetNames).mockReturnValue(mockWidgets)
      vi.mocked(WidgetsGridManager.getWidgetGridDefinition)
        .mockReturnValueOnce(expectedDefinitions[0])
        .mockReturnValueOnce(expectedDefinitions[1])

      const result = WidgetsHomeManager.getWidgetsLayout(isCustomer)

      expect(WidgetsService.getHomeWidgetNames).toHaveBeenCalledOnce()
      expect(result).toEqual(expectedDefinitions)
    })
  })

  describe('getWidgetGridDefinitions', () => {
    const isCustomer = false
    it('should filter out undefined widget definitions and log warnings', () => {
      const mockWidgets = [validWidgetNames.digilab, invalidWidgetNames.invalidWidget]

      vi.mocked(WidgetsGridManager.getWidgetGridDefinition)
        .mockReturnValueOnce(mockWidgetGridDefinitions[validWidgetNames.digilab])
        .mockReturnValueOnce(undefined)

      const result = WidgetsHomeManager.getWidgetGridDefinitions(mockWidgets, isCustomer)

      expect(result).toEqual([mockWidgetGridDefinitions[validWidgetNames.digilab]])
      expect(logger.warn).toHaveBeenCalled()
    })

    it('should return empty array when no valid widgets are found', () => {
      const mockWidgets = ['INVALID_1' as WidgetName, 'INVALID_2' as WidgetName]

      vi.mocked(WidgetsGridManager.getWidgetGridDefinition).mockReturnValue(undefined)

      const result = WidgetsHomeManager.getWidgetGridDefinitions(mockWidgets, isCustomer)

      expect(result).toEqual([])
      expect(logger.warn).toHaveBeenCalledTimes(2)
    })

    it('should return all widget definitions when all widgets are valid', () => {
      const mockWidgets = [WidgetName.POWERBI_INTRO, WidgetName.RSS_NEWS]
      const mockDefinitions = [
        { name: WidgetName.POWERBI_INTRO },
        { name: WidgetName.RSS_NEWS },
      ]

      vi.mocked(WidgetsGridManager.getWidgetGridDefinition)
        .mockImplementation((name) => mockDefinitions.find(d => d.name === name))

      const result = WidgetsHomeManager.getWidgetGridDefinitions(mockWidgets, isCustomer)

      expect(result).toEqual(mockDefinitions)
      expect(logger.warn).not.toHaveBeenCalled()
    })

    it('should return widget definitions for authorized widgets', () => {
      const isCustomer = true
      const mockWidgets = [validWidgetNames.pennylaneIntro, validWidgetNames.pennylaneDocuments]

      const mockedGridDefinitions = [
        mockWidgetGridDefinitionsWithPermissions[validWidgetNames.pennylaneDocuments],
        mockWidgetGridDefinitionsWithPermissions[validWidgetNames.pennylaneIntro],
      ]

      const expectedMockedGridDefinitions = [
        mockWidgetGridDefinitionsWithPermissions[validWidgetNames.pennylaneIntro],
      ]
      const hasPermissionForCurrentEntitySpy = vi.spyOn(CurrentUserManager, 'hasSelectedEntityPermission')
      hasPermissionForCurrentEntitySpy.mockReturnValue(false)

      vi.mocked(WidgetsService.getHomeWidgetNames).mockReturnValue(mockWidgets)
      vi.mocked(WidgetsGridManager.getWidgetGridDefinition)
        .mockReturnValueOnce(mockedGridDefinitions[0])
        .mockReturnValueOnce(mockedGridDefinitions[1])

      const result = WidgetsHomeManager.getWidgetGridDefinitions(mockWidgets, isCustomer)

      expect(result).toEqual(expectedMockedGridDefinitions)
    })
  })
})
