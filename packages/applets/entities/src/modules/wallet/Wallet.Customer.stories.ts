import { ref, onMounted } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { useRouter } from 'vue-router'
import { useUserStore, usePermissionsStore } from '@pulse/common/stores'
import { getMockedUser } from '@pulse/common/mocks'
import { Feature, RouteName } from '@pulse/common/enums'
import { FeatureFlagManager } from '@pulse/common/managers'
import { WalletManager, WalletCountManager } from './managers'
import { WalletTab } from './enums'
import Wallet from './Wallet.page.vue'
import Folders from './pages/folders/Folders.vue'
import Prospects from './pages/prospects/Prospects.vue'

// Placeholder for navigation targets not available in Storybook
const PlaceholderPage = {
  template: '<div class="padding--6"><p>Navigation vers cette page non disponible dans Storybook</p></div>',
}

const parentRoute = {
  path: '/wallet',
  name: 'walletRoot',
  component: { template: '<router-view />' },
  children: [
    { path: 'customer-entities', name: 'customer-entities', component: Folders },
    { path: 'customer-prospects', name: 'customer-prospects', component: Prospects },
  ],
}

const navigationRoutes = [
  { path: '/entity/:entityId', name: 'entity-overview', component: PlaceholderPage },
]

interface WalletScenario {
  regularEntitiesCount: number
  prospectEntitiesCount: number
}

function registerCustomerTabs(scenario: WalletScenario) {
  WalletManager.register({
    id: WalletTab.CUSTOMER_ENTITIES,
    title: 'entities.wallet.allEntities',
    route: 'customer-entities' as RouteName,
    isDisplayed: () => scenario.regularEntitiesCount > 0,
    getCount: () => WalletCountManager.getCount(WalletTab.CUSTOMER_ENTITIES),
    order: 10,
  })

  WalletManager.register({
    id: WalletTab.PROSPECTS,
    title: 'entities.wallet.pending-folders',
    route: 'customer-prospects' as RouteName,
    isDisplayed: (context) =>
      context.hasFeatureFlag(Feature.PROSPECT_EXPERIENCE) &&
      scenario.prospectEntitiesCount > 0,
    getCount: () => WalletCountManager.getCount(WalletTab.PROSPECTS),
    order: 20,
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
  userStore.setUser(getMockedUser({ isCollab: false }))
  userStore.setFavoriteEntities([])
  userStore.setWalletInformation({
    regularEntitiesCount: scenario.regularEntitiesCount,
    prospectEntitiesCount: scenario.prospectEntitiesCount,
  })

  const permissionsStore = usePermissionsStore()
  permissionsStore.setUserPermissions([])

  WalletManager.clear()
  registerCustomerTabs(scenario)

  if (router.hasRoute(parentRoute.name) === false) {
    router.addRoute(parentRoute)
  }

  navigationRoutes.forEach((route) => {
    if (router.hasRoute(route.name) === false) {
      router.addRoute(route)
    }
  })

  const initialRoute = scenario.regularEntitiesCount > 0
    ? 'customer-entities'
    : 'customer-prospects'

  onMounted(async () => {
    await router.push({ name: initialRoute })
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
  title: 'Applets/Entities/Pages/Wallet/Customer',
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
  regularEntitiesCount: 5,
  prospectEntitiesCount: 0,
})

export const NoRegularMultipleProspect: Story = createStory({
  regularEntitiesCount: 0,
  prospectEntitiesCount: 3,
})
