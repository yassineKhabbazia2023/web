import type { Meta, StoryObj } from '@storybook/vue3-vite'
import AppVersion from './app-version.vue'

const meta: Meta<typeof AppVersion> = {
  title: 'Libraries/AppVersion',
  component: AppVersion,
  tags: ['!autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

// Default story
export const Default: Story = {
  render: () => ({
    components: { AppVersion },
    template: `
      <div style="position: relative; width: 40px; height: 30px; background-color: #515151;">
        <AppVersion />
      </div>
    `,
  }),
}
