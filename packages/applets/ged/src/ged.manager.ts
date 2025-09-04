import type { Service } from '@ged/models/Service'
import { useRoute } from 'vue-router'
import { GED_CONTEXT_META } from '@pulse/common/constants'
import { GedContext } from '@pulse/common/enums'

export class GedManager {
  static findIsServiceReadOnly(services: Service[], serviceId: Service['ServiceId']) {
    const foundService = services.find((service) => service.ServiceId === serviceId)
    return foundService?.IsReadOnly ?? false
  }

  static getGedContext() {
    const route = useRoute()

    return route?.meta?.[GED_CONTEXT_META] ?? GedContext.LEGACY
  }
}
