import { getServiceDataMockWithFirstIsReadOnly } from '@ged/__mocks__/services.mocks'
import { GED_CONTEXT_META } from '@pulse/common/constants'
import { useRoute } from 'vue-router'
import { GedContext } from '@pulse/common/enums'

import { GedManager } from './ged.manager'

vi.mock('vue-router')

const legacyRouteMock = {
  meta: {
    [GED_CONTEXT_META]: GedContext.LEGACY,
  },
} as any

const accoutingRouteMock = {
  meta: {
    [GED_CONTEXT_META]: GedContext.ACCOUNTING,
  },
} as any

describe('GedManager', () => {
  describe('find is service read only', () => {
    const serviceWithFirstIsReadOnly = getServiceDataMockWithFirstIsReadOnly()
    it.each([
      {
        services: serviceWithFirstIsReadOnly,
        currentServiceId: serviceWithFirstIsReadOnly[0].ServiceId,
        expectedResult: serviceWithFirstIsReadOnly[0].IsReadOnly,
      },
      {
        services: serviceWithFirstIsReadOnly,
        currentServiceId: serviceWithFirstIsReadOnly[1].ServiceId,
        expectedResult: serviceWithFirstIsReadOnly[1].IsReadOnly,
      },
    ])('finds a service among a list of services and returns if it is readOnly', ({ services, currentServiceId, expectedResult }) => {
      const result = GedManager.findIsServiceReadOnly(services, currentServiceId)
      expect(result).toBe(expectedResult)
    })
  })

  describe('getGedContext', () => {
    const tests = [{
      routeMock: legacyRouteMock,
      expectedResult: GedContext.LEGACY,
    }, {
      routeMock: accoutingRouteMock,
      expectedResult: GedContext.ACCOUNTING,
    }]

    it.each(tests)('description', ({
      routeMock,
      expectedResult,
    }) => {
      vi.mocked(useRoute).mockReturnValue(routeMock)

      const result = GedManager.getGedContext()
      expect(result).toBe(expectedResult)
    })
  })

})
