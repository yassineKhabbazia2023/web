import { NavigationManager } from '@pulse/shared/managers'
import { AccountType, RouteName } from '@pulse/common/enums'
import { createNavigationContext } from '@pulse/shared/mocks'
import { registerCustomerNavigationItems } from './customer.navigation.registry'

describe('registerCustomerNavigationItems', () => {
  beforeEach(() => {
    NavigationManager.resetNavigationItems()
    registerCustomerNavigationItems()
  })

  it('should register all expected routeNames across contexts', () => {
    const gedContext = createNavigationContext({
      shouldShowBIReports: true,
      hasGed: true,
      hasPennylaneAccounting: false,
      hasSocialManagementV2: false,
      hasApps: true,
    })

    const pennylaneContext = createNavigationContext({
      shouldShowBIReports: true,
      hasGed: true,
      hasPennylaneAccounting: true,
      hasPennylaneAccountingGedV2: true,
      hasSocialManagementV2: true,
      hasApps: true,
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
    expect(allRouteNames).toContain(RouteName.LAUNCHER)
  })

  describe('always visible items', () => {
    const context = createNavigationContext({
      shouldShowBIReports: false,
      hasGed: false,
      hasPennylaneAccounting: false,
      hasSocialManagementV2: false,
    })

    it('should always display home and overview items', () => {
      const items = NavigationManager.getNavigationItems(context)
      const routeNames = items.map(item => item.routeName)

      expect(routeNames).toContain(RouteName.HOMEPAGE)
      expect(routeNames).toContain(RouteName.ENTITY_OVERVIEW)
    })
  })

  describe('shouldDisplay behavior - User with legacy GED only', () => {
    const context = createNavigationContext({
      shouldShowBIReports: true,
      hasGed: true,
      hasPennylaneAccounting: false,
      hasSocialManagementV2: false,
    })

    it('should display basic items and legacy GED', () => {
      const items = NavigationManager.getNavigationItems(context)
      const routeNames = items.map(item => item.routeName)

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
      shouldShowBIReports: true,
      hasGed: true,
      hasPennylaneAccounting: true,
      hasPennylaneAccountingGedV2: true,
      hasSocialManagementV2: false,
    })

    it('should display basic items and Pennylane V2', () => {
      const items = NavigationManager.getNavigationItems(context)
      const routeNames = items.map(item => item.routeName)

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
      shouldShowBIReports: true,
      hasGed: true,
      hasPennylaneAccounting: true,
      hasPennylaneAccountingGedV2: false,
      hasPennylaneAccountingGedLegacy: true,
      hasSocialManagementV2: false,
    })

    it('should display basic items and Pennylane legacy', () => {
      const items = NavigationManager.getNavigationItems(context)
      const routeNames = items.map(item => item.routeName)

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
      shouldShowBIReports: true,
      hasGed: true,
      hasPennylaneAccounting: false,
      hasSocialManagementV2: true,
    })

    it('should display basic items and Social Management', () => {
      const items = NavigationManager.getNavigationItems(context)
      const routeNames = items.map(item => item.routeName)

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

  describe('shouldDisplay behavior - Apps item', () => {
    it('should display apps for user with permission', () => {
      const context = createNavigationContext({ hasApps: true })

      const items = NavigationManager.getNavigationItems(context)
      const routeNames = items.map(item => item.routeName)

      expect(routeNames).toContain(RouteName.LAUNCHER)
    })

    it('should hide apps for user without permission', () => {
      const context = createNavigationContext({ hasApps: false })

      const items = NavigationManager.getNavigationItems(context)
      const routeNames = items.map(item => item.routeName)

      expect(routeNames).not.toContain(RouteName.LAUNCHER)
    })
  })

  describe('prospect entity navigation items', () => {
    const context = createNavigationContext({})

    it('should register prospect homepage and stepper items', () => {
      const items = NavigationManager.getNavigationItems(context, AccountType.PROSPECT)
      const routeNames = items.map(item => item.routeName)

      expect(routeNames).toContain(RouteName.PROSPECT_HOMEPAGE)
      expect(routeNames).toContain(RouteName.PROSPECT_STEPPER)
    })

    it('should return prospect items sorted by order', () => {
      const items = NavigationManager.getNavigationItems(context, AccountType.PROSPECT)

      expect(items[0].routeName).toBe(RouteName.PROSPECT_HOMEPAGE)
      expect(items[1].routeName).toBe(RouteName.PROSPECT_STEPPER)
    })

    it('should not include regular entity items in prospect context', () => {
      const items = NavigationManager.getNavigationItems(context, AccountType.PROSPECT)
      const routeNames = items.map(item => item.routeName)

      expect(routeNames).not.toContain(RouteName.HOMEPAGE)
      expect(routeNames).not.toContain(RouteName.ENTITY_OVERVIEW)
      expect(routeNames).not.toContain(RouteName.LAUNCHER)
    })
  })
})
