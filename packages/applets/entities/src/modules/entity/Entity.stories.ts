import { ref, onMounted } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { useRouter } from 'vue-router'
import { useCurrentEntityStore, useUserStore, usePermissionsStore } from '@pulse/common/stores'
import { getMockedUser, getMockedEntitySummary } from '@pulse/common/mocks'
import { CollaboratorPermission, CustomerPermission } from '@pulse/common/enums'
import Entity from './Entity.page.vue'
import Offers from './pages/offers/Offers.vue'
import Information from './pages/information/Information.vue'
import Users from './pages/users/Users.vue'
import Collaborators from './pages/collaborators/Collaborators.vue'
import DelegationsHistory from './pages/delegationsHistory/DelegationsHistory.vue'

const meta: Meta<typeof Entity> = {
  title: 'Applets/Entities/Pages/Entity',
  component: Entity,
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
  name: 'entityOverview',
  component: { template: '<router-view />' },
  children: [
    { path: 'offers', name: 'offers', component: Offers },
    { path: 'info', name: 'info', component: Information },
    { path: 'users', name: 'users', component: Users },
    { path: 'collab', name: 'collab', component: Collaborators },
    { path: 'delegations', name: 'delegationsHistory', component: DelegationsHistory },
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
    await router.push({ name: 'users', params: { entityId: MOCK_ENTITY_ID } })
    isReady.value = true
  })

  return { isReady }
}

export const Collaborator: Story = {
  render: () => ({
    components: { Entity },
    setup() {
      const { isReady } = useStorySetup(true)
      return { isReady }
    },
    template: `
      <div style="padding: 24px;">
        <Entity v-if="isReady" />
      </div>
    `,
  }),
}

export const Customer: Story = {
  render: () => ({
    components: { Entity },
    setup() {
      const { isReady } = useStorySetup(false)
      return { isReady }
    },
    template: `
      <div style="padding: 24px;">
        <Entity v-if="isReady" />
      </div>
    `,
  }),
}
