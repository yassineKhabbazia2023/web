import type { Meta, StoryObj } from '@storybook/vue3-vite'
import OffersCatalog from './offers-catalog.vue'

const meta: Meta<typeof OffersCatalog> = {
  title: 'Applets/OffersCatalog/Pages/OffersCatalog',
  component: OffersCatalog,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { OffersCatalog },
    template: `
      <div style="padding: 24px;">
        <OffersCatalog />
      </div>
    `,
  }),
}
