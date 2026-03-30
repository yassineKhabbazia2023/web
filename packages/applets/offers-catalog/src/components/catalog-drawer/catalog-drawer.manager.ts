import { CatalogDrawerTabs } from './catalog-drawer.enums'
import type { CatalogDrawerTab, CatalogDrawerTabsLabels } from './catalog-drawer.types'

export class CatalogDrawerManager {
  static getTabs(labels: CatalogDrawerTabsLabels, shouldShowRecommendationTab: boolean): CatalogDrawerTab[] {
    const pdfTab: CatalogDrawerTab = {
      name: CatalogDrawerTabs.PDF,
      label: labels.pdf,
      iconName: undefined,
    }
    const contactsTab: CatalogDrawerTab = {
      name: CatalogDrawerTabs.CONTACTS,
      label: labels.contacts,
      iconName: undefined,
    }
    const documentsTab: CatalogDrawerTab = {
      name: CatalogDrawerTabs.DOCUMENTS,
      label: labels.documents,
      iconName: undefined,
    }

    if (shouldShowRecommendationTab) {
      const recommendationTab: CatalogDrawerTab = {
        name: CatalogDrawerTabs.RECOMMENDATION,
        label: labels.recommendation,
        iconName: 'stars',
      }
      return [pdfTab, recommendationTab, contactsTab, documentsTab]
    }

    return [pdfTab, contactsTab, documentsTab]
  }
}
