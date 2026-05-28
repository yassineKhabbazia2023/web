import type { Meta, StoryObj } from '@storybook/vue3-vite'
import GetAcceptPoc from './GetAcceptPoc.vue'

const meta: Meta<typeof GetAcceptPoc> = {
  title: 'Laboratory/POC/GetAccept',
  component: GetAcceptPoc,
  parameters: {
    docs: {
      description: {
        component: 'POC d\'integration GetAccept pour la signature electronique dans une iframe. Permet de tester le flow complet : authentification, creation de document, signature dans une iframe, et verification du statut.',
      },
    },
  },
  tags: ['!autodocs'],
}

export default meta
type Story = StoryObj<typeof GetAcceptPoc>

export const Default: Story = {}
