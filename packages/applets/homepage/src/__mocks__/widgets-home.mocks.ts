import { WidgetName, WidgetScope } from '@pulse/widgets/enums'
import type { WidgetGridDefinition } from '@pulse/widgets/types'
import { CustomerPermission } from '@pulse/common/enums'

export const validWidgetNames = {
  sso: WidgetName.SSO,
  digilab: WidgetName.DIGILAB,
  pennylaneIntro: WidgetName.PENNYLANE_INTRO,
  powerbiIntro: WidgetName.POWERBI_INTRO,
  rssNews: WidgetName.RSS_NEWS,
  pennylaneDocuments: WidgetName.PENNYLANE_DOCUMENTS,
  bookingAppointment: WidgetName.BOOKING_APPOINTMENT,
}

export const invalidWidgetNames = {
  invalid1: 'INVALID_1' as WidgetName,
  invalid2: 'INVALID_2' as WidgetName,
  invalidWidget: 'INVALID_WIDGET' as WidgetName,
}

export const mockWidgetGridDefinitions: Partial<Record<WidgetName, WidgetGridDefinition>> = {
  [WidgetName.SSO]: { name: WidgetName.SSO },
  [WidgetName.DIGILAB]: { name: WidgetName.DIGILAB },
  [WidgetName.PENNYLANE_INTRO]: { name: WidgetName.PENNYLANE_INTRO },
  [WidgetName.POWERBI_INTRO]: { name: WidgetName.POWERBI_INTRO },
  [WidgetName.RSS_NEWS]: { name: WidgetName.RSS_NEWS },
}

export const mockWidgetGridDefinitionsWithPermissions: Partial<Record<WidgetName, WidgetGridDefinition>> = {
  [WidgetName.SSO]: { name: WidgetName.SSO, customerPermission: [] },
  [WidgetName.DIGILAB]: { name: WidgetName.DIGILAB, customerPermission: [] },
  [WidgetName.PENNYLANE_INTRO]: { name: WidgetName.PENNYLANE_INTRO, customerPermission: [] },
  [WidgetName.POWERBI_INTRO]: { name: WidgetName.POWERBI_INTRO, customerPermission: [] },
  [WidgetName.RSS_NEWS]: { name: WidgetName.RSS_NEWS, customerPermission: [] },
  [WidgetName.PENNYLANE_DOCUMENTS]: { name: WidgetName.PENNYLANE_DOCUMENTS,
    customerPermission: [CustomerPermission.ACCEDER_DOCUMENTS_PENNYLANE] },
}

export const mockWidgetGridDefinitionsWithScope: Partial<Record<WidgetName, WidgetGridDefinition>> = {
  [WidgetName.SSO]: { name: WidgetName.SSO },
  [WidgetName.DIGILAB]: { name: WidgetName.DIGILAB, scope: [WidgetScope.COLLAB] },
  [WidgetName.BOOKING_APPOINTMENT]: { name: WidgetName.BOOKING_APPOINTMENT, scope: [WidgetScope.CUSTOMER] },
  [WidgetName.RSS_NEWS]: { name: WidgetName.RSS_NEWS, scope: [WidgetScope.CUSTOMER, WidgetScope.COLLAB] },
}
