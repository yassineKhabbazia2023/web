import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Mandate from './Mandate.vue'

const meta: Meta<typeof Mandate> = {
  title: 'Applets/Mandate/Pages/Mandate',
  component: Mandate,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { Mandate },
    template: `
      <div style="padding: 24px;">
        <Mandate />
      </div>
    `,
  }),
}
