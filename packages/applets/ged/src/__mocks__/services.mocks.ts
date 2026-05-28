import type { Service } from '@ged/models/Service'
import { GedServiceId } from '@ged/enums/ged.enum'

export const servicesDataMock: Service[] = [
  {
    ServiceName: 'Comptabilité',
    ServiceId: GedServiceId.ACCOUNTING,
    IsReadOnly: false,
  },
  {
    ServiceName: 'Gestion Sociale',
    ServiceId: GedServiceId.SOCIAL_MANAGEMENT,
    IsReadOnly: false,
  },
]

export function getServiceDataMockWithFirstIsReadOnly() {
  return [
    {
      ServiceName: 'Comptabilité',
      ServiceId: GedServiceId.ACCOUNTING,
      IsReadOnly: true,
    },
    {
      ServiceName: 'Gestion Sociale',
      ServiceId: GedServiceId.SOCIAL_MANAGEMENT,
      IsReadOnly: false,
    },
  ]
}
