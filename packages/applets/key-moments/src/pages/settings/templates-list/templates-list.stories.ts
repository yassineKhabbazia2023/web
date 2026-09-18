import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { RouteName } from '@pulse/common/enums'
import TemplatesListPage from './templates-list.page.vue'
import TemplateEditorPage from '../template-editor/template-editor.page.vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

const meta: Meta<typeof TemplatesListPage> = {
  title: 'Applets/KeyMoments/Settings/TemplatesList',
  component: TemplatesListPage,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

const routes = [
  {
    path: '/portefeuille/moments-cles',
    name: RouteName.KEY_MOMENTS_SETTINGS,
    component: TemplatesListPage,
  },
  {
    path: '/portefeuille/moments-cles/templates/:templateId',
    name: RouteName.KEY_MOMENTS_TEMPLATE_EDITOR,
    component: TemplateEditorPage,
  },
]

export const Default: Story = {
  render: () => ({
    components: { TemplatesListPage },
    setup() {
      const router = useRouter()
      const isReady = ref(false)

      routes
        .filter(route => router.hasRoute(route.name) === false)
        .forEach(route => router.addRoute(route))

      onMounted(async () => {
        await router.push({ name: RouteName.KEY_MOMENTS_SETTINGS })
        isReady.value = true
      })

      return { isReady }
    },
    template: '<TemplatesListPage v-if="isReady" />',
  }),
}
