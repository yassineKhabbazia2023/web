import { REGULAR_ENTITY_NAVIGATION_ITEMS } from './regular-entity.navigation'
import { PROSPECT_ENTITY_NAVIGATION_ITEMS } from './prospect-entity.navigation'

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
})
