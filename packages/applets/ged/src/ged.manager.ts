import type { Service } from '@ged/models/Service'

export class GedManager {
  static findIsServiceReadOnly(services: Service[], serviceId: Service['ServiceId']) {
    const foundService = services.find((service) => service.ServiceId === serviceId)
    return foundService?.IsReadOnly ?? false
  }
}
