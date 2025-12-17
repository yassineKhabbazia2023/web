import type { Service } from '@ged/models/Service'

export const servicesDataMock: Service[] = [
  {
    ServiceName: 'Comptabilité',
    ServiceId: 'service-id-compta',
    IsReadOnly: false,
  },
  {
    ServiceName: 'Gestion Sociale',
    ServiceId: 'service-id-gs',
    IsReadOnly: false,
  },
]

export function getServiceDataMockWithFirstIsReadOnly() {
  return [
    {
      ServiceName: 'Comptabilité',
      ServiceId: 'service-id-compta',
      IsReadOnly: true,
    },
    {
      ServiceName: 'Gestion Sociale',
      ServiceId: 'service-id-gs',
      IsReadOnly: false,
    },
  ]
}
