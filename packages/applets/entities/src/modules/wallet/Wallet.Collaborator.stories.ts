import { ref, onMounted } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { useRouter } from 'vue-router'
import { useUserStore, usePermissionsStore } from '@pulse/common/stores'
import { getMockedUser } from '@pulse/common/mocks'
import { CollaboratorPermission, Feature, RouteName } from '@pulse/common/enums'
import { FeatureFlagManager } from '@pulse/common/managers'
import { WalletManager, WalletCountManager } from './managers'
import { WalletTab } from './enums'
import Wallet from './Wallet.page.vue'
import Folders from './pages/folders/Folders.vue'
import Prospects from './pages/prospects/Prospects.vue'
import WalletCollaborators from './pages/collaborators/Collaborators.vue'
import AccountManagement from './pages/accountManagement/AccountManagement.vue'
import Subscriptions from './pages/subscriptions/Subscriptions.vue'

// Placeholder for navigation targets not available in Storybook
const PlaceholderPage = {
  template: '<div class="padding--6"><p>Navigation vers cette page non disponible dans Storybook</p></div>',
}

const parentRoute = {
  path: '/wallet',
  name: 'walletRoot',
  component: { template: '<router-view />' },
  children: [
    { path: 'folders', name: 'folders', component: Folders },
    { path: 'prospects', name: 'prospects', component: Prospects },
    { path: 'collaborators', name: 'collaborators', component: WalletCollaborators },
    { path: 'account-management', name: 'accountManagement', component: AccountManagement },
    { path: 'subscriptions', name: 'subscriptions', component: Subscriptions },
  ],
}

const navigationRoutes = [
  { path: '/entity/:entityId', name: 'entity-overview', component: PlaceholderPage },
]

interface WalletScenario {
  regularEntitiesCount: number
  prospectEntitiesCount: number
}

function registerCollaboratorTabs() {
  WalletManager.register({
    id: WalletTab.FOLDERS,
    title: 'entities.wallet.folders',
    route: 'folders' as RouteName,
    isDisplayed: (context) => context.isCollab,
    getCount: () => WalletCountManager.getCount(WalletTab.FOLDERS),
    showInMobile: () => true,
    order: 1,
  })

  WalletManager.register({
    id: WalletTab.PROSPECTS,
    title: 'entities.wallet.prospects',
    route: 'prospects' as RouteName,
    isDisplayed: (context) =>
      context.isCollab && context.hasFeatureFlag(Feature.PROSPECT_EXPERIENCE),
    getCount: () => WalletCountManager.getCount(WalletTab.PROSPECTS),
    showInMobile: () => true,
    order: 2,
  })

  WalletManager.register({
    id: WalletTab.SUBSCRIPTIONS,
    title: 'entities.wallet.subscriptions',
    route: 'subscriptions' as RouteName,
    isDisplayed: (context) => context.isCollab,
    order: 3,
  })

  WalletManager.register({
    id: WalletTab.COLLABORATORS,
    title: 'entities.wallet.collaborators',
    route: 'collaborators' as RouteName,
    isDisplayed: (context) => context.isCollab,
    order: 4,
  })

  WalletManager.register({
    id: WalletTab.ACCOUNT_MANAGEMENT,
    title: 'entities.wallet.accountManagement',
    route: 'accountManagement' as RouteName,
    isDisplayed: (context) => context.isCollab,
    order: 5,
  })
}

function useStorySetup(scenario: WalletScenario) {
  const router = useRouter()
  const isReady = ref(false)

  // Enable PROSPECT_EXPERIENCE feature flag in Storybook
  const originalIsFeatureActivated = FeatureFlagManager.isFeatureActivated.bind(FeatureFlagManager)
  FeatureFlagManager.isFeatureActivated = (feature: Feature) => {
    if (feature === Feature.PROSPECT_EXPERIENCE) {
      return true
    }
    return originalIsFeatureActivated(feature)
  }

  const userStore = useUserStore()
  userStore.setUser(getMockedUser({ isCollab: true }))
  userStore.setFavoriteEntities([])
  userStore.setWalletInformation({
    regularEntitiesCount: scenario.regularEntitiesCount,
    prospectEntitiesCount: scenario.prospectEntitiesCount,
  })

  const permissionsStore = usePermissionsStore()
  permissionsStore.setUserPermissions([
    CollaboratorPermission.ACCEDER_ONGLET_COLLABORATEURS_ADMIN,
    CollaboratorPermission.GERER_DOSSIERS,
    CollaboratorPermission.ONGLET_DEMANDES_MOD,
  ])

  WalletManager.clear()
  registerCollaboratorTabs()

  if (router.hasRoute(parentRoute.name) === false) {
    router.addRoute(parentRoute)
  }

  navigationRoutes.forEach((route) => {
    if (router.hasRoute(route.name) === false) {
      router.addRoute(route)
    }
  })

  onMounted(async () => {
    await router.push({ name: 'folders' })
    isReady.value = true
  })

  return { isReady }
}

function createStory(scenario: WalletScenario): Story {
  return {
    render: () => ({
      components: { Wallet },
      setup() {
        const { isReady } = useStorySetup(scenario)
        return { isReady }
      },
      template: `
        <div style="padding: 24px;">
          <Wallet v-if="isReady" />
        </div>
      `,
    }),
  }
}

const meta: Meta<typeof Wallet> = {
  title: 'Applets/Entities/Pages/Wallet/Collaborator',
  component: Wallet,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const OneRegularNoProspect: Story = createStory({
  regularEntitiesCount: 1,
  prospectEntitiesCount: 0,
})

export const NoRegularOneProspect: Story = createStory({
  regularEntitiesCount: 0,
  prospectEntitiesCount: 1,
})

export const MultipleRegularMultipleProspect: Story = createStory({
  regularEntitiesCount: 5,
  prospectEntitiesCount: 3,
})

export const MultipleRegularNoProspect: Story = createStory({
  regularEntitiesCount: 5000,
  prospectEntitiesCount: 0,
})

export const NoRegularMultipleProspect: Story = createStory({
  regularEntitiesCount: 0,
  prospectEntitiesCount: 3,
})
