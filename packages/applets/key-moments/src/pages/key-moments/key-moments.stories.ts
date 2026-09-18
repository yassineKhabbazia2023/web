import { ref, onMounted } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { useRouter } from 'vue-router'
import { useCurrentEntityStore } from '@pulse/common/stores'
import { getMockedEntitySummary } from '@pulse/common/mocks'
import { RouteName } from '@pulse/common/enums'
import KeyMomentsPage from './key-moments.page.vue'

const meta: Meta<typeof KeyMomentsPage> = {
  title: 'Applets/KeyMoments/Pages/KeyMoments',
  component: KeyMomentsPage,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

const MOCK_ENTITY_ID = '602'

const keyMomentsRoute = {
  path: '/entity/:entityId/moments-cles',
  name: RouteName.KEY_MOMENTS,
  component: KeyMomentsPage,
}

function useStorySetup() {
  const router = useRouter()
  const isReady = ref(false)

  const currentEntityStore = useCurrentEntityStore()
  currentEntityStore.setCurrentEntity(getMockedEntitySummary())

  if (router.hasRoute(keyMomentsRoute.name) === false) {
    router.addRoute(keyMomentsRoute)
  }

  onMounted(async () => {
    await router.push({ name: RouteName.KEY_MOMENTS, params: { entityId: MOCK_ENTITY_ID } })
    isReady.value = true
  })

  return { isReady }
}

export const Default: Story = {
  render: () => ({
    components: { KeyMomentsPage },
    setup() {
      const { isReady } = useStorySetup()
      return { isReady }
    },
    template: `
      <KeyMomentsPage v-if="isReady" />
    `,
  }),
}
