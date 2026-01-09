import type { Meta, StoryObj } from '@storybook/vue3-vite'
import AzureDevOpsPage from './azure-devops.page.vue'

const meta: Meta<typeof AzureDevOpsPage> = {
  title: 'Apps/Backoffice/Azure DevOps',
  component: AzureDevOpsPage,
  tags: ['!autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Azure DevOps',
  render: () => ({
    components: { AzureDevOpsPage },
    template: '<AzureDevOpsPage />',
  }),
}
