import { ref, onMounted } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import type { RouteRecordRaw } from 'vue-router'
import { useRouter } from 'vue-router'
import { RouteParam, CollaboratorPermission, RouteName, Layout, AccountType } from '@pulse/common/enums'
import { useUserStore, useCurrentEntityStore, usePermissionsStore } from '@pulse/common/stores'
import { getMockedUser, getMockedEntitySummary, MockEntityData } from '@pulse/common/mocks'
import { LAYOUT_META } from '@pulse/common/constants'
import type { Entity } from '@pulse/common/types'

import CollaboratorHomeExperience from './experiences/collaborator-home.experience.vue'

// Import existing routes from collaborator app
import { entityCollaboratorRoutes } from './router/routes/entity/collaborator.entity.routes'
import { walletCollaboratorRoutes } from './router/routes/collaborator.wallet.routes'
import { landingCollaboratorRoutes } from './router/routes/collaborator.landing.routes'
import { registerCollaboratorNavigationItems } from './router/registry/collaborator.navigation.registry'
import { registerCollaboratorWalletTabs } from './router/registry/collaborator.wallet.registry'

// Register navigation items and wallet tabs once for all stories
registerCollaboratorNavigationItems()
registerCollaboratorWalletTabs()

const meta: Meta<typeof CollaboratorHomeExperience> = {
  title: 'Apps/Collaborator',
  component: CollaboratorHomeExperience,
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

function ensureLeadingSlash(path: string): string {
  return path.startsWith('/') ? path : `/${path}`
}

// Build collaborator routes for Storybook (without guards)
const storyRoutes: RouteRecordRaw[] = [
  ...stripGuards(landingCollaboratorRoutes).map(route => ({
    ...route,
    path: ensureLeadingSlash(route.path),
    meta: { ...route.meta, [LAYOUT_META]: Layout.MAIN },
  })),
  ...stripGuards(entityCollaboratorRoutes).map(route => ({
    ...route,
    path: ensureLeadingSlash(route.path),
    meta: { ...route.meta, [LAYOUT_META]: Layout.MAIN },
  })),
  ...stripGuards(walletCollaboratorRoutes).map(route => ({
    ...route,
    path: ensureLeadingSlash(route.path),
    meta: { ...route.meta, [LAYOUT_META]: Layout.MAIN },
  })),
]

// Mock entities - IDs must match MockEntityData used by MSW handlers
const entityFirst = getMockedEntitySummary({
  accountId: MockEntityData.BASIC.accountId,
  accountNumber: MockEntityData.BASIC.accountNumber,
  legalName: MockEntityData.BASIC.legalName,
  subscriptions: [],
  isClarityVisible: false,
  isSignatory: true,
})

const entitySecond = getMockedEntitySummary({
  accountId: MockEntityData.LEGACY_GED.accountId,
  accountNumber: MockEntityData.LEGACY_GED.accountNumber,
  legalName: MockEntityData.LEGACY_GED.legalName,
  subscriptions: [],
  isClarityVisible: true,
  isSignatory: false,
})

const entityThird = getMockedEntitySummary({
  accountId: MockEntityData.PENNYLANE.accountId,
  accountNumber: MockEntityData.PENNYLANE.accountNumber,
  legalName: MockEntityData.PENNYLANE.legalName,
  subscriptions: [],
  isClarityVisible: false,
  isSignatory: true,
})

function toEntity(entity: ReturnType<typeof getMockedEntitySummary>): Entity {
  return {
    accountId: entity.accountId,
    accountNumber: entity.accountNumber,
    legalName: entity.legalName,
    accountType: AccountType.REGULAR,
  }
}

const allEntities = [entityFirst, entitySecond, entityThird]

const collaboratorPermissions = [
  CollaboratorPermission.ACCEDER_GED_COMPTABLE,
  CollaboratorPermission.ACCEDER_RAPPORTS_BI,
  CollaboratorPermission.ACCEDER_ONGLET_COLLABORATEURS,
  CollaboratorPermission.ACCEDER_ONGLET_COLLABORATEURS_ADMIN,
  CollaboratorPermission.ACCEDER_ONGLET_INFORMATIONS,
  CollaboratorPermission.ACCEDER_ONGLET_OFFRE,
  CollaboratorPermission.ACCEDER_ONGLET_UTILISATEURS,
  CollaboratorPermission.ACCEDER_LANCEURS_OUTILS_EXTERNES,
  CollaboratorPermission.GERER_DOSSIERS,
  CollaboratorPermission.ONGLET_DEMANDES_MOD,
  CollaboratorPermission.ONGLET_MANDAT,
  CollaboratorPermission.ADMINISTRER_RAPPORT_BI,
  CollaboratorPermission.DEPOSER_RAPPORT_BI,
  CollaboratorPermission.GED,
  CollaboratorPermission.HISTORIQUE_DELEGATIONS,
]

function useCollaboratorSetup() {
  const router = useRouter()
  const isReady = ref(false)

  const userStore = useUserStore()
  const currentEntityStore = useCurrentEntityStore()
  const permissionsStore = usePermissionsStore()

  // Setup user store with collaborator
  userStore.setUser(getMockedUser({
    isCollab: true,
    entities: {
      default: toEntity(entityFirst),
    },
  }))
  userStore.setFavoriteEntities(allEntities.map(toEntity))

  // Setup current entity store (default to first entity)
  currentEntityStore.setCurrentEntity(entityFirst)

  // Storybook guards - replace stripped beforeEnter guards
  router.beforeEach((to) => {
    const entityIdParam = to.params[RouteParam.ENTITY_ID]
    if (entityIdParam !== undefined) {
      const entityId = Number(entityIdParam)
      const matchingEntity = allEntities.find(e => e.accountId === entityId)
      if (matchingEntity !== undefined && currentEntityStore.currentEntityId !== entityId) {
        currentEntityStore.setCurrentEntity(matchingEntity)
      }
    }

    // Replicate ENTITY_REDIRECT beforeEnter guard (stripped by stripGuards)
    if (to.name === RouteName.ENTITY_REDIRECT) {
      return { name: RouteName.HOMEPAGE, params: { [RouteParam.ENTITY_ID]: to.params[RouteParam.ENTITY_ID] } }
    }
  })

  // Setup permissions
  permissionsStore.setCurrentEntityPermissions(collaboratorPermissions)
  permissionsStore.setUserPermissions(collaboratorPermissions)

  // Register routes
  storyRoutes.forEach((route) => {
    if (router.hasRoute(route.name as string) === false) {
      router.addRoute(route)
    }
  })

  onMounted(async () => {
    // Navigate to wallet folders page (collaborator landing)
    await router.push({
      name: RouteName.FOLDERS,
    })
    isReady.value = true
  })

  return {
    isReady,
  }
}

export const Collaborator: Story = {
  render: () => ({
    components: { CollaboratorHomeExperience },
    setup() {
      const { isReady } = useCollaboratorSetup()
      return { isReady }
    },
    template: `
      <CollaboratorHomeExperience v-if="isReady" />
    `,
  }),
}
