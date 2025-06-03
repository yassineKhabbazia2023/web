import type { Service } from '@ged/models/Service'

export const servicesDataMock: Service[] = [
  {
    ServiceName: 'service-id-compta',
    ServiceId: 'service-id-compta',
    IsReadOnly: false,
  },
  {
    ServiceName: 'service-id-gs',
    ServiceId: 'service-id-gs',
    IsReadOnly: false,
  },
]

export function getServiceDataMockWithFirstIsReadOnly() {
  return [
    {
      ServiceName: 'service-id-compta',
      ServiceId: 'service-id-compta',
      IsReadOnly: true,
    },
    {
      ServiceName: 'service-id-gs',
      ServiceId: 'service-id-gs',
      IsReadOnly: false,
    },
  ]
}
