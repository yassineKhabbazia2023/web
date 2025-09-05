import { GedServiceId } from '@ged/enums/ged.enum'
import { GedContext } from '@pulse/common/enums'

export const GedServiceIdByContextName: Record<GedContext, GedServiceId | undefined> = {
  [GedContext.ACCOUNTING]: GedServiceId.ACCOUNTING,
  [GedContext.SOCIAL_MANAGEMENT]: GedServiceId.SOCIAL_MANAGEMENT,
  [GedContext.LEGACY]: undefined,
}
