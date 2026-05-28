import { ref, onMounted } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { useRouter } from 'vue-router'
import { useCurrentEntityStore, useUserStore, usePermissionsStore } from '@pulse/common/stores'
import { getMockedUser, getMockedEntitySummary } from '@pulse/common/mocks'
import { CollaboratorPermission, RouteName } from '@pulse/common/enums'
import GedV2 from './ged-v2.page.vue'

const meta: Meta<typeof GedV2> = {
  title: 'Applets/Pennylane/Pages/GedV2',
  component: GedV2,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

const MOCK_ENTITY_ID = '602'

const gedV2Route = {
  path: '/pennylane/ged-v2/:entityId',
  name: RouteName.PENNYLANE_GED_V2,
  component: GedV2,
}

function useStorySetup() {
  const router = useRouter()
  const isReady = ref(false)

  const userStore = useUserStore()
  userStore.setUser(getMockedUser({ isCollab: true }))

  const currentEntityStore = useCurrentEntityStore()
  currentEntityStore.setCurrentEntity(getMockedEntitySummary())

  const permissionsStore = usePermissionsStore()
  permissionsStore.setCurrentEntityPermissions([
    CollaboratorPermission.ACCEDER_GED_COMPTABLE,
  ])
  permissionsStore.setUserPermissions([
    CollaboratorPermission.GED,
  ])

  if (router.hasRoute(gedV2Route.name) === false) {
    router.addRoute(gedV2Route)
  }

  onMounted(async () => {
    await router.push({ name: RouteName.PENNYLANE_GED_V2, params: { entityId: MOCK_ENTITY_ID } })
    isReady.value = true
  })

  return { isReady }
}

export const Default: Story = {
  render: () => ({
    components: { GedV2 },
    setup() {
      const { isReady } = useStorySetup()
      return { isReady }
    },
    template: `
      <div style="padding: 24px; height: 100vh;">
        <GedV2 v-if="isReady" />
      </div>
    `,
  }),
}
