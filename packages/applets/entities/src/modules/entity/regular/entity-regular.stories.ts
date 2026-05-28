import { ref, onMounted } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { useRouter } from 'vue-router'
import { useCurrentEntityStore, useUserStore, usePermissionsStore } from '@pulse/common/stores'
import { getMockedUser, getMockedEntitySummary } from '@pulse/common/mocks'
import { CollaboratorPermission, CustomerPermission, RouteName } from '@pulse/common/enums'
import EntityOverview from './overview/entity-overview.page.vue'
import Offers from './offers/Offers.vue'
import Invoices from './invoices/invoices.vue'
import Information from './information/Information.vue'
import Users from '../shared/users/users.vue'
import Collaborators from '../shared/collaborators/Collaborators.vue'

const meta: Meta<typeof EntityOverview> = {
  title: 'Applets/Entities/Pages/EntityOverview',
  component: EntityOverview,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

const MOCK_ENTITY_ID = '602'

const parentRoute = {
  path: '/entity/:entityId',
  name: RouteName.ENTITY_OVERVIEW,
  component: { template: '<router-view />' },
  children: [
    { path: 'offers', name: RouteName.OFFERS, component: Offers },
    { path: 'factures-rydge-conseil', name: RouteName.RYDGE_INVOICES, component: Invoices },
    { path: 'info', name: RouteName.INFO, component: Information },
    { path: 'users', name: RouteName.USERS, component: Users },
    { path: 'collab', name: RouteName.COLLAB, component: Collaborators },
  ],
}

function useStorySetup(isCollab: boolean) {
  const router = useRouter()
  const isReady = ref(false)

  const userStore = useUserStore()
  userStore.setUser(getMockedUser({ isCollab }))

  const currentEntityStore = useCurrentEntityStore()
  currentEntityStore.setCurrentEntity(getMockedEntitySummary())

  const permissionsStore = usePermissionsStore()

  if (isCollab) {
    permissionsStore.setCurrentEntityPermissions([
      CollaboratorPermission.ACCEDER_ONGLET_OFFRE,
      CollaboratorPermission.ACCEDER_ONGLET_INFORMATIONS,
      CollaboratorPermission.ACCEDER_ONGLET_UTILISATEURS,
      CollaboratorPermission.ACCEDER_ONGLET_COLLABORATEURS,
    ])
    permissionsStore.setUserPermissions([
      CollaboratorPermission.HISTORIQUE_DELEGATIONS,
      CollaboratorPermission.MAJ_FICHE_ENTREPRISE_ONGLET_INFORMATION,
    ])
  } else {
    permissionsStore.setCurrentEntityPermissions([
      CustomerPermission.ACCEDER_OFFRES_SOUSCRITES,
      CustomerPermission.ACCEDER_INFORMATIONS_ENTREPRISE,
      CustomerPermission.CONSULTER_UTILISATEURS,
    ])
  }

  if (!router.hasRoute(parentRoute.name)) {
    router.addRoute(parentRoute)
  }

  onMounted(async () => {
    await router.push({ name: RouteName.USERS, params: { entityId: MOCK_ENTITY_ID } })
    isReady.value = true
  })

  return { isReady }
}

export const Collaborator: Story = {
  render: () => ({
    components: { EntityOverview },
    setup() {
      const { isReady } = useStorySetup(true)
      return { isReady }
    },
    template: `
      <div style="padding: 24px;">
        <EntityOverview v-if="isReady" />
      </div>
    `,
  }),
}

export const Customer: Story = {
  render: () => ({
    components: { EntityOverview },
    setup() {
      const { isReady } = useStorySetup(false)
      return { isReady }
    },
    template: `
      <div style="padding: 24px;">
        <EntityOverview v-if="isReady" />
      </div>
    `,
  }),
}
