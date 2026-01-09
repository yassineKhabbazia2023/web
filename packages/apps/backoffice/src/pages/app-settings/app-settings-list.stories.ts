import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { getWorker } from '@pulse/e2e-mocks/msw'
import { appSettingsHandlers } from '@pulse/e2e-mocks/handlers/backoffice'
import AppSettingsListPage from './app-settings-list.page.vue'

const meta: Meta<typeof AppSettingsListPage> = {
  title: 'Apps/Backoffice/App Settings',
  component: AppSettingsListPage,
  tags: ['!autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'App Settings',
  render: () => ({
    components: { AppSettingsListPage },
    setup() {
      getWorker().use(...appSettingsHandlers)
      return {}
    },
    template: '<AppSettingsListPage />',
  }),
}
