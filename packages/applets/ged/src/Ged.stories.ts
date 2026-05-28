import { ref, onMounted } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { useRouter } from 'vue-router'
import { useCurrentEntityStore, useUserStore, usePermissionsStore } from '@pulse/common/stores'
import { getMockedUser, getMockedEntitySummary } from '@pulse/common/mocks'
import { CollaboratorPermission, RouteParam } from '@pulse/common/enums'
import Ged from './Ged.vue'

const meta: Meta<typeof Ged> = {
  title: 'Applets/GED/Pages/Ged',
  component: Ged,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

const mockedEntity = getMockedEntitySummary()

const gedRoute = {
  path: `/dossier/:${RouteParam.ENTITY_ID}/ged`,
  name: 'ged',
  component: Ged,
}

function useStorySetup() {
  const router = useRouter()
  const isReady = ref(false)

  const userStore = useUserStore()
  userStore.setUser(getMockedUser({ isCollab: true }))

  const currentEntityStore = useCurrentEntityStore()
  currentEntityStore.setCurrentEntity(mockedEntity)

  const permissionsStore = usePermissionsStore()
  permissionsStore.setCurrentEntityPermissions([
    CollaboratorPermission.ACCEDER_GED_COMPTABLE,
  ])
  permissionsStore.setUserPermissions([
    CollaboratorPermission.GED,
  ])

  if (router.hasRoute(gedRoute.name) === false) {
    router.addRoute(gedRoute)
  }

  onMounted(async () => {
    await router.push({
      name: 'ged',
      params: { [RouteParam.ENTITY_ID]: String(mockedEntity.accountId) },
    })
    isReady.value = true
  })

  return { isReady }
}

export const Default: Story = {
  render: () => ({
    components: { Ged },
    setup() {
      const { isReady } = useStorySetup()
      return { isReady }
    },
    template: `
      <div style="padding: 24px; height: 100vh;">
        <Ged v-if="isReady" />
      </div>
    `,
  }),
}
