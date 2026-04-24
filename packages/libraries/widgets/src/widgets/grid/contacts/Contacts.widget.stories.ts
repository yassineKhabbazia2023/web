import type { Meta, StoryObj } from '@storybook/vue3-vite'
import ContactsWidget from './Contacts.widget.vue'
import type { WidgetContact } from './contact.widget.types'

const meta: Meta<typeof ContactsWidget> = {
  title: 'Libraries/Widgets/Grid/Contacts',
  component: ContactsWidget,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Widget listant les contacts RYDGE Conseil du prospect et la carte Support Client. Chaque contact propose un téléphone et un email via tooltip.',
      },
    },
  },
  argTypes: {
    contacts: {
      control: 'object',
      description: 'Liste des contacts à afficher (firstname, lastname, role, phoneNumber, email).',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

const render: Story['render'] = (args) => ({
  components: { ContactsWidget },
  setup() {
    return { args }
  },
  template: `
    <div style="max-width: 400px;">
      <ContactsWidget v-bind="args" />
    </div>
  `,
})

const buildContact = (overrides: Partial<WidgetContact> = {}): WidgetContact => ({
  firstname: 'Jean',
  lastname: 'Dupont',
  role: 'Conseiller',
  phoneNumber: '01 23 45 67 89',
  email: 'jean.dupont@rydge.fr',
  ...overrides,
})

export const Empty: Story = {
  render,
  args: {
    contacts: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'Aucun contact : seule la carte « Support Client » est affichée. Cas utilisé sur la Homepage Prospect.',
      },
    },
  },
}

export const SingleContact: Story = {
  render,
  args: {
    contacts: [buildContact()],
  },
  parameters: {
    docs: {
      description: {
        story: 'Un seul contact suivi de la carte Support Client.',
      },
    },
  },
}

export const FourContacts: Story = {
  render,
  args: {
    contacts: [
      buildContact({ firstname: 'Jean', lastname: 'Dupont', role: 'Conseiller', phoneNumber: '01 23 45 67 89', email: 'jean.dupont@rydge.fr' }),
      buildContact({ firstname: 'Marie', lastname: 'Martin', role: 'Expert-comptable', phoneNumber: '01 98 76 54 32', email: 'marie.martin@rydge.fr' }),
      buildContact({ firstname: 'Lucas', lastname: 'Bernard', role: 'Assistant', phoneNumber: '01 11 22 33 44', email: 'lucas.bernard@rydge.fr' }),
      buildContact({ firstname: 'Sophie', lastname: 'Leroy', role: 'Gestionnaire de paie', phoneNumber: '01 55 66 77 88', email: 'sophie.leroy@rydge.fr' }),
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Quatre contacts + carte Support Client pour valider le rendu en liste.',
      },
    },
  },
}
