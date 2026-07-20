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
