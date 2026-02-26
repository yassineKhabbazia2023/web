import { ref, onMounted } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { useRouter } from 'vue-router'
import { useUserStore, usePermissionsStore } from '@pulse/common/stores'
import { getMockedUser } from '@pulse/common/mocks'
import { CollaboratorPermission, RouteName } from '@pulse/common/enums'
import { WalletManager } from './managers'
import { WalletTab } from './enums'
import Wallet from './Wallet.page.vue'
import Folders from './pages/folders/Folders.vue'
import WalletCollaborators from './pages/collaborators/Collaborators.vue'
import AccountManagement from './pages/accountManagement/AccountManagement.vue'
import Subscriptions from './pages/subscriptions/Subscriptions.vue'

const meta: Meta<typeof Wallet> = {
  title: 'Applets/Entities/Pages/Wallet',
  component: Wallet,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

const parentRoute = {
  path: '/wallet',
  name: 'walletRoot',
  component: { template: '<router-view />' },
  children: [
    // Collaborator routes
    { path: 'folders', name: 'folders', component: Folders },
    { path: 'collaborators', name: 'collaborators', component: WalletCollaborators },
    { path: 'account-management', name: 'accountManagement', component: AccountManagement },
    { path: 'subscriptions', name: 'subscriptions', component: Subscriptions },
    // Customer routes
    { path: 'customer-entities', name: 'customer-entities', component: Folders },
  ],
}

// Placeholder for navigation targets not available in Storybook
const PlaceholderPage = {
  template: '<div class="padding--6"><p>Navigation vers cette page non disponible dans Storybook</p></div>',
}

// Routes for external navigation targets (entity pages clicked from wallet)
const navigationRoutes = [
  { path: '/entity/:entityId', name: 'entity-overview', component: PlaceholderPage },
]

function registerCollaboratorTabs() {
  WalletManager.register({
    id: WalletTab.FOLDERS,
    title: 'entities.wallet.folders',
    route: 'folders' as RouteName,
    isDisplayed: (context) => context.isCollab,
    order: 1,
  })

  WalletManager.register({
    id: WalletTab.SUBSCRIPTIONS,
    title: 'entities.wallet.subscriptions',
    route: 'subscriptions' as RouteName,
    isDisplayed: (context) => context.isCollab,
    order: 2,
  })

  WalletManager.register({
    id: WalletTab.COLLABORATORS,
    title: 'entities.wallet.collaborators',
    route: 'collaborators' as RouteName,
    isDisplayed: (context) => context.isCollab,
    order: 3,
  })

  WalletManager.register({
    id: WalletTab.ACCOUNT_MANAGEMENT,
    title: 'entities.wallet.accountManagement',
    route: 'accountManagement' as RouteName,
    isDisplayed: (context) => context.isCollab,
    order: 4,
  })
}

function registerCustomerTabs() {
  WalletManager.register({
    id: WalletTab.CUSTOMER_ENTITIES,
    title: 'entities.wallet.allEntities',
    route: 'customer-entities' as RouteName,
    isDisplayed: (context) => context.isCollab === false,
    order: 10,
  })
}

function useStorySetup(isCollab: boolean) {
  const router = useRouter()
  const isReady = ref(false)

  const userStore = useUserStore()
  userStore.setUser(getMockedUser({ isCollab }))
  userStore.setFavoriteEntities([])

  const permissionsStore = usePermissionsStore()

  if (isCollab) {
    permissionsStore.setUserPermissions([
      CollaboratorPermission.ACCEDER_ONGLET_COLLABORATEURS_ADMIN,
      CollaboratorPermission.GERER_DOSSIERS,
      CollaboratorPermission.ONGLET_DEMANDES_MOD,
    ])
  } else {
    permissionsStore.setUserPermissions([])
  }

  registerCollaboratorTabs()
  registerCustomerTabs()

  if (!router.hasRoute(parentRoute.name)) {
    router.addRoute(parentRoute)
  }

  // Add navigation target routes (for clicks on entities, etc.)
  navigationRoutes.forEach((route) => {
    if (!router.hasRoute(route.name)) {
      router.addRoute(route)
    }
  })

  const initialRoute = isCollab ? 'folders' : 'customer-entities'

  onMounted(async () => {
    await router.push({ name: initialRoute })
    isReady.value = true
  })

  return { isReady }
}

export const Collaborator: Story = {
  render: () => ({
    components: { Wallet },
    setup() {
      const { isReady } = useStorySetup(true)
      return { isReady }
    },
    template: `
      <div style="padding: 24px;">
        <Wallet v-if="isReady" />
      </div>
    `,
  }),
}

export const Customer: Story = {
  render: () => ({
    components: { Wallet },
    setup() {
      const { isReady } = useStorySetup(false)
      return { isReady }
    },
    template: `
      <div style="padding: 24px;">
        <Wallet v-if="isReady" />
      </div>
    `,
  }),
}
