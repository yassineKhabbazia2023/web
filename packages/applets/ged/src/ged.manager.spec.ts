import { getServiceDataMockWithFirstIsReadOnly } from '@ged/__mocks__/services.mocks'
import { GedManager } from './ged.manager'

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
})
