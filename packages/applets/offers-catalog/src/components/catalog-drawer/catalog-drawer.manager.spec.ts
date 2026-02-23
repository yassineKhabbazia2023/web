import { CatalogDrawerManager } from './catalog-drawer.manager'
import { CatalogDrawerTabs } from './catalog-drawer.enums'
import type { CatalogDrawerTabsLabels } from './catalog-drawer.types'

const labels: CatalogDrawerTabsLabels = {
  pdf: 'Offer Sheet',
  contacts: 'Reference Contacts',
  documents: "Offer's documents",
  recommendation: 'Recommendation',
}

describe('CatalogDrawerManager', () => {
  describe('getTabs', () => {
    it('should return tabs without recommendation when smart search is disabled', () => {
      const tabs = CatalogDrawerManager.getTabs(labels, false)

      expect(tabs).toHaveLength(3)
      expect(tabs[0]).toEqual({
        name: CatalogDrawerTabs.PDF,
        label: 'Offer Sheet',
        iconName: undefined,
      })
      expect(tabs[1]).toEqual({
        name: CatalogDrawerTabs.CONTACTS,
        label: 'Reference Contacts',
        iconName: undefined,
      })
      expect(tabs[2]).toEqual({
        name: CatalogDrawerTabs.DOCUMENTS,
        label: "Offer's documents",
        iconName: undefined,
      })
    })

    it('should return tabs with recommendation when smart search is enabled', () => {
      const tabs = CatalogDrawerManager.getTabs(labels, true)

      expect(tabs).toHaveLength(4)
      expect(tabs[0]).toEqual({
        name: CatalogDrawerTabs.PDF,
        label: 'Offer Sheet',
        iconName: undefined,
      })
      expect(tabs[1]).toEqual({
        name: CatalogDrawerTabs.RECOMMENDATION,
        label: 'Recommendation',
        iconName: 'stars',
      })
      expect(tabs[2]).toEqual({
        name: CatalogDrawerTabs.CONTACTS,
        label: 'Reference Contacts',
        iconName: undefined,
      })
      expect(tabs[3]).toEqual({
        name: CatalogDrawerTabs.DOCUMENTS,
        label: "Offer's documents",
        iconName: undefined,
      })
    })
  })
})
