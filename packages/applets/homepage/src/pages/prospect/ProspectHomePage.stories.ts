import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { useCurrentEntityStore } from '@pulse/common/stores'
import { getMockedEntitySummary } from '@pulse/common/mocks'
import ProspectHomePage from './prospect.home-page.vue'

const withProspectHomePageSetup = () => (_story: unknown) => ({
  setup() {
    const currentEntityStore = useCurrentEntityStore()
    currentEntityStore.currentEntity = getMockedEntitySummary()
    return {}
  },
  template: '<story />',
})

const meta: Meta<typeof ProspectHomePage> = {
  title: 'Applets/Homepage/ProspectHomePage',
  component: ProspectHomePage,
  tags: ['!autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Page d\'accueil du prospect, affiche le header d\'entité et le widget WorkspaceIntro.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  decorators: [withProspectHomePageSetup()],
  render: () => ({
    components: { ProspectHomePage },
    template: '<ProspectHomePage />',
  }),
}
