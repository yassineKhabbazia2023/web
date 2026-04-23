import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PUserActionCard from './PUserActionCard.vue'
import { AvatarRoles } from '../../utils/avatar.roles'

const meta: Meta<typeof PUserActionCard> = {
  title: 'Atoms/PUserActionCard',
  component: PUserActionCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Composant d\'action utilisateur combinant un avatar, un texte principal, un sous-texte et une icône corbeille optionnelle.',
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
    pAvatarProps: {
      control: 'object',
      description: 'Props passées au composant PAvatar',
    },
  },
  args: {
    pTopLeftSectionText: 'Jean Dupont',
    pTopLeftSubText: 'Prospect',
    pIsTrashIconVisible: true,
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
