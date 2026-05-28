import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PUserActionCard from './PUserActionCard.vue'
import PTag from '../PTag/PTag.vue'
import { AvatarRoles } from '../../utils/avatar.roles'

const meta: Meta<typeof PUserActionCard> = {
  title: 'Atoms/PUserActionCard',
  component: PUserActionCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Composant d\'action utilisateur combinant un avatar, un texte principal, un sous-texte et une icône corbeille optionnelle. Supporte un layout responsive et un slot #content pour du contenu personnalisé.',
      },
    },
  },
  argTypes: {
    pTopLeftSectionText: {
      control: 'text',
      description: 'Texte principal affiché en haut à gauche',
    },
    pTopLeftSubText: {
      control: 'text',
      description: 'Sous-texte affiché sous le texte principal',
    },
    pIsTrashIconVisible: {
      control: 'boolean',
      description: 'Affiche l\'icône corbeille à droite',
    },
    pIsAvatarVisible: {
      control: 'boolean',
      description: 'Affiche l\'avatar',
    },
    pAvatarProps: {
      control: 'object',
      description: 'Props passées au composant PAvatar',
    },
  },
  args: {
    pTopLeftSectionText: 'Jean Dupont',
    pTopLeftSubText: 'Prospect',
    pIsTrashIconVisible: true,
    pIsAvatarVisible: true,
    pAvatarProps: {
      pType: 'default',
      pRole: AvatarRoles.PROSPECT,
      pShape: 'circle',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PUserActionCard },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 400px;">
        <PUserActionCard v-bind="args" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Exemple de base du composant PUserActionCard avec un avatar prospect et l\'icône corbeille visible.',
      },
    },
  },
}

export const CollaboratorWithoutTrash: Story = {
  args: {
    pTopLeftSectionText: 'Marie Martin',
    pTopLeftSubText: 'Collaboratrice',
    pIsTrashIconVisible: false,
    pAvatarProps: {
      pType: 'default',
      pRole: AvatarRoles.COLLAB,
      pShape: 'circle',
    },
  },
  render: (args) => ({
    components: { PUserActionCard },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 400px;">
        <PUserActionCard v-bind="args">
          <template #avatar>MM</template>
        </PUserActionCard>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Exemple avec un avatar collaborateur affichant les initiales et l\'icône corbeille masquée.',
      },
    },
  },
}

export const WithCustomContent: Story = {
  args: {
    pIsTrashIconVisible: true,
    pAvatarProps: {
      pType: 'large',
      pColor: 'green',
      pShape: 'circle',
    },
  },
  render: (args) => ({
    components: { PUserActionCard, PTag },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 500px;">
        <PUserActionCard v-bind="args">
          <template #avatar>
            AB
          </template>
          <template #content>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <p style="font-weight: bold; font-size: 16px;">
                ACME Corporation
              </p>
              <PTag
                pColor="gray"
                pSize="small"
                pIconLeftName="building"
                pContent="C-12345"
              />
            </div>
            <p style="font-size: 16px; margin-top: 8px;">
              <a href="mailto:contact@acme.com" style="text-decoration: underline;">contact@acme.com</a>
              | SIRET: 12345678901234
            </p>
          </template>
        </PUserActionCard>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Exemple avec contenu personnalisé via le slot #content. Utilisé dans le formulaire de demande de délégation pour afficher les informations d\'un compte.',
      },
    },
  },
}

export const WithRightSection: Story = {
  args: {
    pTopLeftSectionText: 'Sophie Dubois',
    pTopLeftSubText: 'Expert-comptable',
    pIsTrashIconVisible: false,
    pAvatarProps: {
      pType: 'default',
      pRole: AvatarRoles.COLLAB,
      pShape: 'circle',
    },
  },
  render: (args) => ({
    components: { PUserActionCard, PTag },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 600px;">
        <PUserActionCard v-bind="args">
          <template #avatar>SD</template>
          <template #right-section>
            <PTag pColor="blue" pContent="Manager" />
            <PTag pColor="green" pContent="Active" />
          </template>
        </PUserActionCard>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Exemple avec section droite personnalisée via le slot #right-section. Sur mobile, cette section passe en dessous du contenu principal.',
      },
    },
  },
}
