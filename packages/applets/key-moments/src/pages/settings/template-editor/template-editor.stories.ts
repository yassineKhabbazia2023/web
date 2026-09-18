import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { RouteName } from '@pulse/common/enums'
import TemplateEditorPage from './template-editor.page.vue'
import { useTemplateEditorStore } from '@key-moments/stores/template-editor.store'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

const meta: Meta<typeof TemplateEditorPage> = {
  title: 'Applets/KeyMoments/Settings/TemplateEditor',
  component: TemplateEditorPage,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

const editorRoute = {
  path: '/portefeuille/moments-cles/templates/:templateId',
  name: RouteName.KEY_MOMENTS_TEMPLATE_EDITOR,
  component: TemplateEditorPage,
}

function useStorySetup(templateId: string) {
  const router = useRouter()
  const isReady = ref(false)

  // the editor holds a whole document: a story always opens on a clean one
  useTemplateEditorStore().reset()

  if (router.hasRoute(editorRoute.name) === false) {
    router.addRoute(editorRoute)
  }

  onMounted(async () => {
    await router.push({ name: RouteName.KEY_MOMENTS_TEMPLATE_EDITOR, params: { templateId } })
    isReady.value = true
  })

  return { isReady }
}

export const Engagement: Story = {
  render: () => ({
    components: { TemplateEditorPage },
    setup() {
      return useStorySetup('1')
    },
    template: '<TemplateEditorPage v-if="isReady" />',
  }),
}

export const Tresorerie: Story = {
  render: () => ({
    components: { TemplateEditorPage },
    setup() {
      return useStorySetup('2')
    },
    template: '<TemplateEditorPage v-if="isReady" />',
  }),
}
