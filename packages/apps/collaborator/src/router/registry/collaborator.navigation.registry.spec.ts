import { NavigationManager } from '@pulse/shared/managers'
import { AccountType, RouteName } from '@pulse/common/enums'
import { createNavigationContext } from '@pulse/shared/mocks'
import { registerCollaboratorNavigationItems } from './collaborator.navigation.registry'

describe('registerCollaboratorNavigationItems', () => {
  beforeEach(() => {
    NavigationManager.resetNavigationItems()
    registerCollaboratorNavigationItems()
  })

  it('should register all expected routeNames across contexts', () => {
    const gedContext = createNavigationContext({
      isCollab: true,
      shouldShowBIReports: true,
      hasGed: true,
      hasPennylaneAccounting: false,
      hasSocialManagementV2: false,
    })

    const pennylaneContext = createNavigationContext({
      isCollab: true,
      shouldShowBIReports: true,
      hasGed: true,
      hasPennylaneAccounting: true,
      hasPennylaneAccountingGedV2: true,
      hasSocialManagementV2: true,
    })

    const gedItems = NavigationManager.getNavigationItems(gedContext)
    const pennylaneItems = NavigationManager.getNavigationItems(pennylaneContext)
    const allRouteNames = [
      ...gedItems.map(item => item.routeName),
      ...pennylaneItems.map(item => item.routeName),
    ]

    expect(allRouteNames).toContain(RouteName.HOMEPAGE)
    expect(allRouteNames).toContain(RouteName.ENTITY_OVERVIEW)
    expect(allRouteNames).toContain(RouteName.REPORTS)
    expect(allRouteNames).toContain(RouteName.GED)
    expect(allRouteNames).toContain(RouteName.PENNYLANE_GED_V2)
    expect(allRouteNames).toContain(RouteName.PENNYLANE_SOCIAL_MANAGEMENT)
  })

  describe('showInMobile flags', () => {
    const context = createNavigationContext({
      isCollab: true,
      shouldShowBIReports: true,
      hasGed: true,
      hasPennylaneAccounting: true,
      hasPennylaneAccountingGedV2: true,
      hasSocialManagementV2: true,
    })

    it('should flag mobile-enabled items as showInMobile', () => {
      const items = NavigationManager.getNavigationItems(context)
      const mobileRouteNames = items
        .filter(item => item.showInMobile === true)
        .map(item => item.routeName)

      expect(mobileRouteNames).toContain(RouteName.HOMEPAGE)
      expect(mobileRouteNames).toContain(RouteName.ENTITY_OVERVIEW)
      expect(mobileRouteNames).toContain(RouteName.PENNYLANE_GED_V2)
    })

    it('should not flag desktop-only items as showInMobile', () => {
      const items = NavigationManager.getNavigationItems(context)
      const mobileRouteNames = items
        .filter(item => item.showInMobile === true)
        .map(item => item.routeName)

      expect(mobileRouteNames).not.toContain(RouteName.REPORTS)
      expect(mobileRouteNames).not.toContain(RouteName.PENNYLANE_SOCIAL_MANAGEMENT)
    })
  })

  describe('shouldDisplay behavior - User with legacy GED only', () => {
    const context = createNavigationContext({
      isCollab: true,
      shouldShowBIReports: true,
      hasGed: true,
      hasPennylaneAccounting: false,
      hasSocialManagementV2: false,
    })

    it('should display home, overview, BI reports and legacy GED', () => {
      const items = NavigationManager.getNavigationItems(context)
      const routeNames = items.map(item => item.routeName)

      expect(routeNames).toContain(RouteName.HOMEPAGE)
      expect(routeNames).toContain(RouteName.ENTITY_OVERVIEW)
      expect(routeNames).toContain(RouteName.REPORTS)
      expect(routeNames).toContain(RouteName.GED)
    })

    it('should hide Pennylane and Social Management items', () => {
      const items = NavigationManager.getNavigationItems(context)
      const routeNames = items.map(item => item.routeName)

      expect(routeNames).not.toContain(RouteName.PENNYLANE_GED_V2)
      expect(routeNames).not.toContain(RouteName.PENNYLANE_GED_LEGACY)
      expect(routeNames).not.toContain(RouteName.PENNYLANE_SOCIAL_MANAGEMENT)
    })
  })

  describe('shouldDisplay behavior - User with Pennylane V2', () => {
    const context = createNavigationContext({
      isCollab: true,
      shouldShowBIReports: true,
      hasGed: true,
      hasPennylaneAccounting: true,
      hasPennylaneAccountingGedV2: true,
      hasSocialManagementV2: false,
    })

    it('should display home, overview, BI reports and Pennylane V2', () => {
      const items = NavigationManager.getNavigationItems(context)
      const routeNames = items.map(item => item.routeName)

      expect(routeNames).toContain(RouteName.HOMEPAGE)
      expect(routeNames).toContain(RouteName.ENTITY_OVERVIEW)
      expect(routeNames).toContain(RouteName.REPORTS)
      expect(routeNames).toContain(RouteName.PENNYLANE_GED_V2)
    })

    it('should hide legacy GED, legacy Pennylane and Social Management', () => {
      const items = NavigationManager.getNavigationItems(context)
      const routeNames = items.map(item => item.routeName)

      expect(routeNames).not.toContain(RouteName.GED)
      expect(routeNames).not.toContain(RouteName.PENNYLANE_GED_LEGACY)
      expect(routeNames).not.toContain(RouteName.PENNYLANE_SOCIAL_MANAGEMENT)
    })
  })

  describe('shouldDisplay behavior - User with Pennylane legacy', () => {
    const context = createNavigationContext({
      isCollab: true,
      shouldShowBIReports: true,
      hasGed: true,
      hasPennylaneAccounting: true,
      hasPennylaneAccountingGedV2: false,
      hasPennylaneAccountingGedLegacy: true,
      hasSocialManagementV2: false,
    })

    it('should display home, overview, BI reports and Pennylane legacy', () => {
      const items = NavigationManager.getNavigationItems(context)
      const routeNames = items.map(item => item.routeName)

      expect(routeNames).toContain(RouteName.HOMEPAGE)
      expect(routeNames).toContain(RouteName.ENTITY_OVERVIEW)
      expect(routeNames).toContain(RouteName.REPORTS)
      expect(routeNames).toContain(RouteName.PENNYLANE_GED_LEGACY)
    })

    it('should hide legacy GED, Pennylane V2 and Social Management', () => {
      const items = NavigationManager.getNavigationItems(context)
      const routeNames = items.map(item => item.routeName)

      expect(routeNames).not.toContain(RouteName.GED)
      expect(routeNames).not.toContain(RouteName.PENNYLANE_GED_V2)
      expect(routeNames).not.toContain(RouteName.PENNYLANE_SOCIAL_MANAGEMENT)
    })
  })

  describe('shouldDisplay behavior - User with Social Management V2', () => {
    const context = createNavigationContext({
      isCollab: true,
      shouldShowBIReports: true,
      hasGed: true,
      hasPennylaneAccounting: false,
      hasSocialManagementV2: true,
    })

    it('should display home, overview, BI reports and Social Management', () => {
      const items = NavigationManager.getNavigationItems(context)
      const routeNames = items.map(item => item.routeName)

      expect(routeNames).toContain(RouteName.HOMEPAGE)
      expect(routeNames).toContain(RouteName.ENTITY_OVERVIEW)
      expect(routeNames).toContain(RouteName.REPORTS)
      expect(routeNames).toContain(RouteName.PENNYLANE_SOCIAL_MANAGEMENT)
    })

    it('should hide legacy GED and Pennylane items', () => {
      const items = NavigationManager.getNavigationItems(context)
      const routeNames = items.map(item => item.routeName)

      expect(routeNames).not.toContain(RouteName.GED)
      expect(routeNames).not.toContain(RouteName.PENNYLANE_GED_V2)
      expect(routeNames).not.toContain(RouteName.PENNYLANE_GED_LEGACY)
    })
  })

  describe('shouldDisplay behavior - User with no permissions', () => {
    const context = createNavigationContext({
      isCollab: true,
      shouldShowBIReports: false,
      hasGed: false,
      hasPennylaneAccounting: false,
      hasSocialManagementV2: false,
    })

    it('should only display always-visible items', () => {
      const items = NavigationManager.getNavigationItems(context)
      const routeNames = items.map(item => item.routeName)

      expect(routeNames).toContain(RouteName.HOMEPAGE)
      expect(routeNames).toContain(RouteName.ENTITY_OVERVIEW)
    })

    it('should hide all permission-dependent items', () => {
      const items = NavigationManager.getNavigationItems(context)
      const routeNames = items.map(item => item.routeName)

      expect(routeNames).not.toContain(RouteName.REPORTS)
      expect(routeNames).not.toContain(RouteName.GED)
      expect(routeNames).not.toContain(RouteName.PENNYLANE_GED_V2)
      expect(routeNames).not.toContain(RouteName.PENNYLANE_GED_LEGACY)
      expect(routeNames).not.toContain(RouteName.PENNYLANE_SOCIAL_MANAGEMENT)
    })
  })

  describe('prospect entity navigation items', () => {
    const context = createNavigationContext({})

    it('should register prospect homepage, overview and conformity items', () => {
      const items = NavigationManager.getNavigationItems(context, AccountType.PROSPECT)
      const routeNames = items.map(item => item.routeName)

      expect(routeNames).toContain(RouteName.PROSPECT_HOMEPAGE)
      expect(routeNames).toContain(RouteName.PROSPECT_OVERVIEW)
      expect(routeNames).toContain(RouteName.PROSPECT_CONFORMITY)
    })

    it('should return prospect items sorted by order', () => {
      const items = NavigationManager.getNavigationItems(context, AccountType.PROSPECT)

      expect(items[0].routeName).toBe(RouteName.PROSPECT_HOMEPAGE)
      expect(items[1].routeName).toBe(RouteName.PROSPECT_OVERVIEW)
      expect(items[2].routeName).toBe(RouteName.PROSPECT_CONFORMITY)
    })

    it('should not include regular entity items in prospect context', () => {
      const items = NavigationManager.getNavigationItems(context, AccountType.PROSPECT)
      const routeNames = items.map(item => item.routeName)

      expect(routeNames).not.toContain(RouteName.HOMEPAGE)
      expect(routeNames).not.toContain(RouteName.ENTITY_OVERVIEW)
    })

    it('should flag all prospect items as showInMobile', () => {
      const items = NavigationManager.getNavigationItems(context, AccountType.PROSPECT)
      const mobileRouteNames = items
        .filter(item => item.showInMobile === true)
        .map(item => item.routeName)

      expect(mobileRouteNames).toContain(RouteName.PROSPECT_HOMEPAGE)
      expect(mobileRouteNames).toContain(RouteName.PROSPECT_OVERVIEW)
      expect(mobileRouteNames).toContain(RouteName.PROSPECT_CONFORMITY)
    })
  })
})
