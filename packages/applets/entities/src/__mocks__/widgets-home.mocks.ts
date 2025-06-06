import { WidgetName } from '@pulse/widgets/enums'
import type { WidgetDefinition } from '@pulse/widgets/types'

export const validWidgetNames = {
  sso: WidgetName.SSO,
  digilab: WidgetName.DIGILAB,
  pennylaneIntro: WidgetName.PENNYLANE_INTRO,
  powerbiIntro: WidgetName.POWERBI_INTRO,
  rssNews: WidgetName.RSS_NEWS,
}

export const invalidWidgetNames = {
  invalid1: 'INVALID_1' as WidgetName,
  invalid2: 'INVALID_2' as WidgetName,
  invalidWidget: 'INVALID_WIDGET' as WidgetName,
}

export const mockWidgetDefinitions: Record<WidgetName, WidgetDefinition> = {
  [WidgetName.SSO]: { name: WidgetName.SSO },
  [WidgetName.DIGILAB]: { name: WidgetName.DIGILAB },
  [WidgetName.PENNYLANE_INTRO]: { name: WidgetName.PENNYLANE_INTRO },
  [WidgetName.POWERBI_INTRO]: { name: WidgetName.POWERBI_INTRO },
  [WidgetName.RSS_NEWS]: { name: WidgetName.RSS_NEWS },
}
