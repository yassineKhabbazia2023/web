import { RouteName } from '@pulse/common/enums'
import { REGULAR_ENTITY_NAVIGATION_ITEMS } from './regular-entity.navigation'
import { PROSPECT_ENTITY_NAVIGATION_ITEMS } from './prospect-entity.navigation'
import { createNavigationContext } from '../__mocks__/navigation.mocks'

describe('regular-entity navigation items', () => {
  const homeItem = REGULAR_ENTITY_NAVIGATION_ITEMS.find((item) => item.id === 'regular-entity-home')

  it('should have a home item', () => {
    expect(homeItem).toBeDefined()
  })

  it('should not have doNotTrack on home item', () => {
    expect(homeItem?.doNotTrack).toBeUndefined()
  })

  it('should have featureName "homepage" on home item', () => {
    expect(homeItem?.featureName).toBe('homepage')
  })

  describe('seres invoices item shouldDisplay', () => {
    const seresInvoicesItem = REGULAR_ENTITY_NAVIGATION_ITEMS.find(
      (item) => item.id === 'regular-entity-seres-invoices',
    )

    it('should display seres invoices when the context allows it', () => {
      const context = createNavigationContext({ shouldShowSeresInvoices: true })

      expect(seresInvoicesItem?.shouldDisplay(context)).toBe(true)
    })

    it('should hide seres invoices when the context does not allow it', () => {
      const context = createNavigationContext({ shouldShowSeresInvoices: false })

      expect(seresInvoicesItem?.shouldDisplay(context)).toBe(false)
    })
  })

  describe('key moments item shouldDisplay', () => {
    const keyMomentsItem = REGULAR_ENTITY_NAVIGATION_ITEMS.find(
      (item) => item.id === 'regular-entity-key-moments',
    )

    it('should display key moments for a collaborator when the feature is enabled', () => {
      const context = createNavigationContext({ isCollab: true, shouldShowKeyMoments: true })

      expect(keyMomentsItem?.shouldDisplay(context)).toBe(true)
    })

    it('should hide key moments when the feature is disabled', () => {
      const context = createNavigationContext({ isCollab: true, shouldShowKeyMoments: false })

      expect(keyMomentsItem?.shouldDisplay(context)).toBe(false)
    })

    // Both surfaces share the one entry — the firm arbitrates a key moment, the
    // customer reads the one it published. The asymmetry between them is
    // arbitrated upstream by `KeyMomentsManager.canShowKeyMoments`, which asks a
    // customer account for a published key moment where the flag alone lets the
    // firm in; the entry only ever reads the answer, pre-computed in the context.
    it('should display key moments for a customer when the feature is enabled', () => {
      const context = createNavigationContext({ isCollab: false, shouldShowKeyMoments: true })

      expect(keyMomentsItem?.shouldDisplay(context)).toBe(true)
    })

    it('should hide key moments from a customer when the feature is disabled', () => {
      const context = createNavigationContext({ isCollab: false, shouldShowKeyMoments: false })

      expect(keyMomentsItem?.shouldDisplay(context)).toBe(false)
    })

    /** The mirror view is the same entry: the highlight must not drop on it. */
    it('should stay the active entry on the customer view of the key moment', () => {
      expect(keyMomentsItem?.activeRoutes)
        .toEqual([RouteName.KEY_MOMENTS, RouteName.KEY_MOMENTS_PREVIEW])
    })
  })
})

describe('prospect-entity navigation items', () => {
  const homeItem = PROSPECT_ENTITY_NAVIGATION_ITEMS.find((item) => item.id === 'prospect-entity-home')

  it('should have a home item', () => {
    expect(homeItem).toBeDefined()
  })

  it('should not have doNotTrack on home item', () => {
    expect(homeItem?.doNotTrack).toBeUndefined()
  })

  it('should have featureName "homepage" on home item', () => {
    expect(homeItem?.featureName).toBe('homepage')
  })

  describe('overview item shouldDisplay', () => {
    const overviewItem = PROSPECT_ENTITY_NAVIGATION_ITEMS.find((item) => item.id === 'prospect-entity-overview')

    it('should display overview for a collaborator without any permission', () => {
      const context = createNavigationContext({ isCollab: true })

      expect(overviewItem?.shouldDisplay(context)).toBe(true)
    })

    it.each([
      { permission: 'hasUsers', context: createNavigationContext({ hasUsers: true }) },
      { permission: 'hasAddUsers', context: createNavigationContext({ hasAddUsers: true }) },
      { permission: 'hasDeleteUser', context: createNavigationContext({ hasDeleteUser: true }) },
      { permission: 'hasModifyRightsUser', context: createNavigationContext({ hasModifyRightsUser: true }) },
      { permission: 'hasInformation', context: createNavigationContext({ hasInformation: true }) },
    ])('should display overview for a customer with only the $permission permission', ({ context }) => {
      expect(overviewItem?.shouldDisplay(context)).toBe(true)
    })

    it('should hide overview for a customer without any permission', () => {
      const context = createNavigationContext({ isCollab: false })

      expect(overviewItem?.shouldDisplay(context)).toBe(false)
    })
  })

  describe('documents item shouldDisplay', () => {
    const documentsItem = PROSPECT_ENTITY_NAVIGATION_ITEMS.find((item) => item.id === 'prospect-entity-documents')

    it('should display documents for a collaborator without the permission', () => {
      const context = createNavigationContext({ isCollab: true, hasProspectDocuments: false })

      expect(documentsItem?.shouldDisplay(context)).toBe(true)
    })

    it('should display documents for a customer with the permission', () => {
      const context = createNavigationContext({ isCollab: false, hasProspectDocuments: true })

      expect(documentsItem?.shouldDisplay(context)).toBe(true)
    })

    it('should hide documents for a customer without the permission', () => {
      const context = createNavigationContext({ isCollab: false, hasProspectDocuments: false })

      expect(documentsItem?.shouldDisplay(context)).toBe(false)
    })
  })
})
