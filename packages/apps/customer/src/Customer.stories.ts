import { ref, onMounted, computed } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import type { RouteRecordRaw } from 'vue-router'
import { useRouter } from 'vue-router'
import { RouteParam, CustomerPermission, RouteName, Layout } from '@pulse/common/enums'
import { useUserStore, useCurrentEntityStore, usePermissionsStore } from '@pulse/common/stores'
import { getMockedUser, getMockedEntitySummary, getMockedSubscription } from '@pulse/common/mocks'

import { LAYOUT_META } from '@pulse/common/constants'
import { HomeLayout } from '@pulse/shared/layouts'
import type { UserConfig } from '@pulse/shared/types'
import type { Entity } from '@pulse/common/types'

// Import existing routes from customer app
import { entityCustomerRoutes } from './router/routes/customer.entity.routes'
import { walletCustomerRoutes } from './router/routes/customer.wallet.routes'
import { landingCustomerRoutes } from './router/routes/customer.landing.routes'
import { registerCustomerNavigationItems } from './router/registry/customer.navigation.registry'

// Register navigation items once for all stories
registerCustomerNavigationItems()

const meta: Meta<typeof HomeLayout> = {
  title: 'Apps/Customer',
  component: HomeLayout,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Recursively removes beforeEnter guards from routes for Storybook context
 */
function stripGuards(routes: RouteRecordRaw[]): RouteRecordRaw[] {
  return routes.map((route) => {
    const { beforeEnter: _beforeEnter, children, ...routeWithoutGuard } = route
    const strippedRoute = { ...routeWithoutGuard } as RouteRecordRaw
    if (children !== undefined) {
      (strippedRoute as RouteRecordRaw & { children: RouteRecordRaw[] }).children = stripGuards(children)
    }
    return strippedRoute
  })
}

// Build customer routes for Storybook (without guards)
const storyRoutes: RouteRecordRaw[] = [
  ...stripGuards(landingCustomerRoutes).map(route => ({
    ...route,
    path: `/${route.path}`,
    meta: { ...route.meta, [LAYOUT_META]: Layout.MAIN },
  })),
  ...stripGuards(entityCustomerRoutes).map(route => ({
    ...route,
    meta: { ...route.meta, [LAYOUT_META]: Layout.MAIN },
  })),
  ...stripGuards(walletCustomerRoutes).map(route => ({
    ...route,
    path: `/${route.path}`,
    meta: { ...route.meta, [LAYOUT_META]: Layout.MAIN },
  })),
]

// Single entity with GED, PowerBI and MEG (no Pennylane)
const monoEntity = getMockedEntitySummary({
  accountId: 601,
  accountNumber: '2025546001',
  legalName: 'Boulangerie Bel Epi',
  subscriptions: [],
  isClarityVisible: false,
  isSignatory: true,
})

// Multiple entities for multi-entity customer (IDs match mock handlers)
const multiEntityFirst = getMockedEntitySummary({
  accountId: 1,
  accountNumber: 'V900000547',
  legalName: 'Acme Corp',
  subscriptions: [],
  isClarityVisible: false,
  isSignatory: true,
})

const multiEntitySecond = getMockedEntitySummary({
  accountId: 2,
  accountNumber: 'V900000546',
  legalName: 'Tech Solutions Ltd',
  subscriptions: [],
  isClarityVisible: true,
  isSignatory: false,
})

// Pennylane subscription for Global Services Inc
const pennylaneSubscription = getMockedSubscription({
  subscriptionId: 504,
  offerId: 8,
  status: 'validated',
  accountId: 3,
  offerCode: 'Pennylane',
  offerName: 'RYDGE Conseil x Pennylane',
})

const multiEntityThird = getMockedEntitySummary({
  accountId: 3,
  accountNumber: 'V900000545',
  legalName: 'Global Services Inc',
  subscriptions: [pennylaneSubscription],
  isClarityVisible: false,
  isSignatory: true,
})

function toEntity(entity: ReturnType<typeof getMockedEntitySummary>): Entity {
  return {
    accountId: entity.accountId,
    accountNumber: entity.accountNumber,
    legalName: entity.legalName,
  }
}

// Permissions for GED, PowerBI and MEG (no Pennylane)
const monoEntityPermissions = [
  CustomerPermission.ACCEDER_GED_COMPTABLE,
  CustomerPermission.ACCEDER_GED_GESTION_SOCIALE,
  CustomerPermission.ACCEDER_RAPPORTS_BI_FINANCIER,
  CustomerPermission.ACCEDER_RAPPORTS_BI_RH,
  CustomerPermission.ACCEDER_OUTIL_MEG,
]

function useMonoEntitySetup() {
  const router = useRouter()
  const isReady = ref(false)

  const userStore = useUserStore()
  const currentEntityStore = useCurrentEntityStore()
  const permissionsStore = usePermissionsStore()

  // Setup user store with single entity customer
  userStore.setUser(getMockedUser({
    isCollab: false,
    entities: {
      default: toEntity(monoEntity),
    },
  }))
  userStore.setFavoriteEntities([toEntity(monoEntity)])

  // Setup current entity store
  currentEntityStore.setCurrentEntity(monoEntity)

  // Entity guard for Storybook
  router.beforeEach((to, _from, next) => {
    const entityIdParam = to.params[RouteParam.ENTITY_ID]
    if (entityIdParam !== undefined) {
      const entityId = Number(entityIdParam)
      if (entityId === monoEntity.accountId && currentEntityStore.currentEntityId !== entityId) {
        currentEntityStore.setCurrentEntity(monoEntity)
      }
    }
    return next()
  })

  // Setup permissions for GED, PowerBI and MEG
  permissionsStore.setCurrentEntityPermissions(monoEntityPermissions)
  permissionsStore.setUserPermissions([
    CustomerPermission.CONSULTER_UTILISATEURS,
    CustomerPermission.ACCEDER_GED_COMPTABLE,
    CustomerPermission.ACCEDER_GED_GESTION_SOCIALE,
    CustomerPermission.ACCEDER_RAPPORTS_BI_FINANCIER,
    CustomerPermission.ACCEDER_RAPPORTS_BI_RH,
    CustomerPermission.ACCEDER_OUTIL_MEG,
  ])

  const currentEntity = computed(() => currentEntityStore.currentEntity)
  const favoriteEntities = computed(() => userStore.favoriteEntities)
  const currentEntityPermissions = computed(() => permissionsStore.currentEntityPermissions)
  const userConfig = computed((): UserConfig => ({
    isCollab: false,
    isCustomer: true,
    isSingleEntity: true,
  }))
  const isVisible = computed(() => {
    return userStore.user !== undefined && currentEntityStore.currentEntity !== undefined
  })

  // Register routes
  storyRoutes.forEach((route) => {
    if (!router.hasRoute(route.name as string)) {
      router.addRoute(route)
    }
  })

  onMounted(async () => {
    await router.push({
      name: RouteName.HOMEPAGE,
      params: { entityId: String(monoEntity.accountId) },
    })
    isReady.value = true
  })

  return {
    isReady,
    currentEntity,
    favoriteEntities,
    currentEntityPermissions,
    userConfig,
    isVisible,
  }
}

export const MonoEntity: Story = {
  render: () => ({
    components: { HomeLayout },
    setup() {
      const {
        isReady,
        currentEntity,
        favoriteEntities,
        currentEntityPermissions,
        userConfig,
        isVisible,
      } = useMonoEntitySetup()

      return {
        isReady,
        currentEntity,
        favoriteEntities,
        currentEntityPermissions,
        userConfig,
        isVisible,
      }
    },
    template: `
      <HomeLayout
        v-if="isReady"
        :current-entity="currentEntity"
        :favorite-entities="favoriteEntities"
        :user-config="userConfig"
        :is-visible="isVisible"
        :current-entity-permissions="currentEntityPermissions"
      />
    `,
  }),
}

// Base permissions for multi-entity customer (without Pennylane)
const baseMultiEntityPermissions = [
  CustomerPermission.ACCEDER_GED_COMPTABLE,
  CustomerPermission.ACCEDER_GED_GESTION_SOCIALE,
  CustomerPermission.ACCEDER_RAPPORTS_BI_FINANCIER,
  CustomerPermission.ACCEDER_RAPPORTS_BI_RH,
  CustomerPermission.ACCEDER_OUTIL_MEG,
  CustomerPermission.CONSULTER_UTILISATEURS,
]

// Pennylane permissions for Global Services Inc (entity 3)
const pennylanePermissions = [
  CustomerPermission.ACCEDER_OUTIL_PENNYLANE,
  CustomerPermission.ACCEDER_DOCUMENTS_PENNYLANE,
]

// Permissions per entity
const multiEntityPermissionsMap: Record<number, CustomerPermission[]> = {
  1: baseMultiEntityPermissions,
  2: baseMultiEntityPermissions,
  3: [...baseMultiEntityPermissions, ...pennylanePermissions],
}

const allMultiEntities = [multiEntityFirst, multiEntitySecond, multiEntityThird]

function getPermissionsForEntity(entityId: number): CustomerPermission[] {
  return multiEntityPermissionsMap[entityId] ?? baseMultiEntityPermissions
}

function useMultiEntitySetup() {
  const router = useRouter()
  const isReady = ref(false)

  const userStore = useUserStore()
  const currentEntityStore = useCurrentEntityStore()
  const permissionsStore = usePermissionsStore()

  // Setup user store with multiple entities
  userStore.setUser(getMockedUser({
    isCollab: false,
    entities: {
      default: toEntity(multiEntityFirst),
    },
  }))
  userStore.setIsSingleEntity(false)
  userStore.setFavoriteEntities(allMultiEntities.map(toEntity))

  // Setup current entity store (default to first entity)
  currentEntityStore.setCurrentEntity(multiEntityFirst)

  // Entity guard for Storybook - handle entity switching and permissions
  router.beforeEach((to, _from, next) => {
    const entityIdParam = to.params[RouteParam.ENTITY_ID]
    if (entityIdParam !== undefined) {
      const entityId = Number(entityIdParam)
      const matchingEntity = allMultiEntities.find(e => e.accountId === entityId)
      if (matchingEntity !== undefined && currentEntityStore.currentEntityId !== entityId) {
        currentEntityStore.setCurrentEntity(matchingEntity)
        // Update permissions for the new entity
        const entityPermissions = getPermissionsForEntity(entityId)
        permissionsStore.setCurrentEntityPermissions(entityPermissions)
      }
    }
    return next()
  })

  // Setup initial permissions (first entity without Pennylane)
  permissionsStore.setCurrentEntityPermissions(baseMultiEntityPermissions)
  permissionsStore.setUserPermissions([
    ...baseMultiEntityPermissions,
    ...pennylanePermissions, // User has Pennylane permissions globally
  ])

  const currentEntity = computed(() => currentEntityStore.currentEntity)
  const favoriteEntities = computed(() => userStore.favoriteEntities)
  const currentEntityPermissions = computed(() => permissionsStore.currentEntityPermissions)
  const userConfig = computed((): UserConfig => ({
    isCollab: false,
    isCustomer: true,
    isSingleEntity: false,
  }))
  const isVisible = computed(() => {
    return userStore.user !== undefined
  })

  // Register routes
  storyRoutes.forEach((route) => {
    if (router.hasRoute(route.name as string) === false) {
      router.addRoute(route)
    }
  })

  onMounted(async () => {
    // Navigate to wallet entities page (multi-entity landing)
    await router.push({
      name: RouteName.CUSTOMER_ENTITIES,
    })
    isReady.value = true
  })

  return {
    isReady,
    currentEntity,
    favoriteEntities,
    currentEntityPermissions,
    userConfig,
    isVisible,
  }
}

export const MultiEntities: Story = {
  render: () => ({
    components: { HomeLayout },
    setup() {
      const {
        isReady,
        currentEntity,
        favoriteEntities,
        currentEntityPermissions,
        userConfig,
        isVisible,
      } = useMultiEntitySetup()

      return {
        isReady,
        currentEntity,
        favoriteEntities,
        currentEntityPermissions,
        userConfig,
        isVisible,
      }
    },
    template: `
      <HomeLayout
        v-if="isReady"
        :current-entity="currentEntity"
        :favorite-entities="favoriteEntities"
        :user-config="userConfig"
        :is-visible="isVisible"
        :current-entity-permissions="currentEntityPermissions"
      />
    `,
  }),
}
