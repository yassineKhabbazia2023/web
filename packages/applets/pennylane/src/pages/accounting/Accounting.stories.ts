import { ref, onMounted } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { useRouter } from 'vue-router'
import { useCurrentEntityStore, useUserStore, usePermissionsStore } from '@pulse/common/stores'
import { getMockedUser, getMockedEntitySummary } from '@pulse/common/mocks'
import { CollaboratorPermission, RouteName } from '@pulse/common/enums'
import Accounting from './accounting.page.vue'
import GedV2 from '../ged-v2/ged-v2.page.vue'

const meta: Meta<typeof Accounting> = {
  title: 'Applets/Pennylane/Pages/Accounting',
  component: Accounting,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

const MOCK_ENTITY_ID = '602'

const parentRoute = {
  path: '/pennylane/accounting/:entityId',
  name: RouteName.PENNYLANE_ACCOUNTING,
  component: { template: '<router-view />' },
  children: [
    { path: 'rydge', name: RouteName.PENNYLANE_GED_V2, component: GedV2 },
    { path: 'archive', name: RouteName.PENNYLANE_GED_LEGACY, component: { template: '<div class="padding--6">GED Legacy (voir Applets/GED/Pages/Ged)</div>' } },
  ],
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

  if (router.hasRoute(parentRoute.name) === false) {
    router.addRoute(parentRoute)
  }

  onMounted(async () => {
    await router.push({ name: RouteName.PENNYLANE_GED_V2, params: { entityId: MOCK_ENTITY_ID } })
    isReady.value = true
  })

  return { isReady }
}

export const Default: Story = {
  render: () => ({
    components: { Accounting },
    setup() {
      const { isReady } = useStorySetup()
      return { isReady }
    },
    template: `
      <div style="padding: 24px;">
        <Accounting v-if="isReady" />
      </div>
    `,
  }),
}
