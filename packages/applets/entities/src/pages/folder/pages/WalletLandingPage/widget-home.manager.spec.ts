import { describe, it, expect, vi, beforeEach } from 'vitest'
import { WidgetsHomeManager } from './widgets-home.manager'
import { WidgetsService } from '@entities/services/widgets/widgets.service'
import { WidgetsManager } from '@pulse/widgets/managers'
import { WidgetName } from '@pulse/widgets/enums'
import { logger } from '@pulse/core'
import {
  validWidgetNames,
  invalidWidgetNames,
  mockWidgetDefinitions,
} from '@entities/__mocks__/widgets-home.mocks'

vi.mock('@entities/services/widgets/widgets.service')
vi.mock('@pulse/widgets/managers')
vi.mock('@pulse/core')

describe('WidgetsHomeManager', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getTemplateToUse', () => {
    it('should return widget definitions for available widgets', () => {
      const mockWidgets = [validWidgetNames.digilab, validWidgetNames.pennylaneIntro]
      const expectedDefinitions = [
        mockWidgetDefinitions[validWidgetNames.digilab],
        mockWidgetDefinitions[validWidgetNames.pennylaneIntro],
      ]

      vi.mocked(WidgetsService.getHomeWidgetNames).mockReturnValue(mockWidgets)
      vi.mocked(WidgetsManager.getWidgetDefinition)
        .mockReturnValueOnce(expectedDefinitions[0])
        .mockReturnValueOnce(expectedDefinitions[1])

      const result = WidgetsHomeManager.getWidgetsLayout()

      expect(WidgetsService.getHomeWidgetNames).toHaveBeenCalledOnce()
      expect(result).toEqual(expectedDefinitions)
    })
  })

  describe('getWidgetDefinitions', () => {
    it('should filter out undefined widget definitions and log warnings', () => {
      const mockWidgets = [validWidgetNames.digilab, invalidWidgetNames.invalidWidget]

      vi.mocked(WidgetsManager.getWidgetDefinition)
        .mockReturnValueOnce(mockWidgetDefinitions[validWidgetNames.digilab])
        .mockReturnValueOnce(undefined)

      const result = WidgetsHomeManager.getWidgetDefinitions(mockWidgets)

      expect(result).toEqual([mockWidgetDefinitions[validWidgetNames.digilab]])
      expect(logger.warn).toHaveBeenCalled()
    })

    it('should return empty array when no valid widgets are found', () => {
      const mockWidgets = ['INVALID_1' as WidgetName, 'INVALID_2' as WidgetName]

      vi.mocked(WidgetsManager.getWidgetDefinition).mockReturnValue(undefined)

      const result = WidgetsHomeManager.getWidgetDefinitions(mockWidgets)

      expect(result).toEqual([])
      expect(logger.warn).toHaveBeenCalledTimes(2)
    })

    it('should return all widget definitions when all widgets are valid', () => {
      const mockWidgets = [WidgetName.POWERBI_INTRO, WidgetName.RSS_NEWS]
      const mockDefinitions = [
        { name: WidgetName.POWERBI_INTRO },
        { name: WidgetName.RSS_NEWS },
      ]

      vi.mocked(WidgetsManager.getWidgetDefinition)
        .mockImplementation((name) => mockDefinitions.find(d => d.name === name))

      const result = WidgetsHomeManager.getWidgetDefinitions(mockWidgets)

      expect(result).toEqual(mockDefinitions)
      expect(logger.warn).not.toHaveBeenCalled()
    })
  })
})
