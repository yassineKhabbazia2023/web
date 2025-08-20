import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PUserAction from './PUserAction.vue'
import type { PUserActionProps } from './PUserActionTypes'
import { getMockedOptions } from './PUserAction.mocks'
import { AvatarRoles } from '../../utils/avatar.roles'

const meta: Meta<typeof PUserAction> = {
  title: 'Molecules/User Action',
  component: PUserAction as any,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'User action component for displaying user profile with various interactive elements like input fields, options dropdown, and action buttons.',
      },
    },
  },
  argTypes: {
    pProfile: {
      control: { type: 'text' },
      description: 'User profile initials or abbreviation',
    },
    pTitle: {
      control: { type: 'text' },
      description: 'User full name or title',
    },
    pDescription: {
      control: { type: 'text' },
      description: 'User description or email',
    },
    pTagContent: {
      control: { type: 'text' },
      description: 'Content for the tag display',
    },
    pRole: {
      control: { type: 'text' },
      description: 'User role or position',
    },
    pShowInput: {
      control: { type: 'boolean' },
      description: 'Show input field',
    },
    pInputValue: {
      control: { type: 'text' },
      description: 'Input field value',
    },
    pInputPlaceholder: {
      control: { type: 'text' },
      description: 'Input field placeholder text',
    },
    pShowDelete: {
      control: { type: 'boolean' },
      description: 'Show delete button',
    },
    pShowOptions: {
      control: { type: 'boolean' },
      description: 'Show options dropdown',
    },
    pOptionsPlaceholder: {
      control: { type: 'text' },
      description: 'Options dropdown placeholder',
    },
    pOptionsMultiple: {
      control: { type: 'boolean' },
      description: 'Allow multiple option selections',
    },
    pWarningContent: {
      control: { type: 'text' },
      description: 'Warning message content',
    },
    pAvatarRole: {
      control: { type: 'select' },
      options: Object.values(AvatarRoles),
      description: 'Avatar role for styling',
    },
  },
}

export default meta
type Story = StoryObj<typeof PUserAction>

export const Basic: Story = {
  args: {
    pProfile: 'SL',
    pTitle: 'Suliman Lescot',
    pDescription: 'suliman.lescot@test.fr',
    pRole: 'Consultant advisory',
    pShowDelete: true,
    pAvatarRole: AvatarRoles.COLLAB,
  },
}

export const WithTag: Story = {
  args: {
    pProfile: 'JD',
    pTitle: 'Jean Dupont',
    pDescription: 'jean.dupont@company.fr',
    pTagContent: 'By default',
    pShowDelete: true,
    pAvatarRole: AvatarRoles.COLLAB,
  },
}

export const WithInput: Story = {
  args: {
    pProfile: 'MM',
    pTitle: 'Marie Martin',
    pDescription: 'marie.martin@company.fr',
    pTagContent: 'By default',
    pShowInput: true,
    pInputPlaceholder: 'Entrez la fonction du collaborateur',
    pShowDelete: true,
    pAvatarRole: AvatarRoles.COLLAB,
  },
}

export const WithInputNoDelete: Story = {
  args: {
    pProfile: 'AB',
    pTitle: 'Alice Bernard',
    pDescription: 'alice.bernard@company.fr',
    pTagContent: 'By default',
    pShowInput: true,
    pInputPlaceholder: 'Entrez la fonction du collaborateur',
    pShowDelete: false,
    pAvatarRole: AvatarRoles.COLLAB,
  },
}

export const WithSingleSelect: Story = {
  args: {
    pProfile: 'PL',
    pTitle: 'Paul Laurent',
    pDescription: 'paul.laurent@company.fr',
    pShowDelete: true,
    pShowOptions: true,
    pOptionsMultiple: false,
    pOptions: getMockedOptions(),
    pOptionsPlaceholder: 'Rôle Akuiteo',
    pAvatarRole: AvatarRoles.COLLAB,
  },
}

export const WithMultiSelect: Story = {
  args: {
    pProfile: 'CT',
    pTitle: 'Claire Thomas',
    pDescription: 'claire.thomas@company.fr',
    pShowDelete: true,
    pShowOptions: true,
    pOptionsMultiple: true,
    pOptions: getMockedOptions(),
    pOptionsPlaceholder: 'Rôles Akuiteo',
    pAvatarRole: AvatarRoles.COLLAB,
  },
}

export const WithWarning: Story = {
  args: {
    pProfile: 'NG',
    pTitle: 'Nicolas Garcia',
    pDescription: 'nicolas.garcia@company.fr',
    pWarningContent: 'Vous avez déjà délégué votre portefeuille à ce collaborateur.',
    pAvatarRole: AvatarRoles.COLLAB,
  },
}

export const Interactive: Story = {
  args: {
    pProfile: 'IL',
    pTitle: 'Isabelle Leroy',
    pDescription: 'isabelle.leroy@company.fr',
    pShowInput: true,
    pInputPlaceholder: 'Fonction du collaborateur',
    pShowDelete: true,
    pShowOptions: true,
    pOptionsMultiple: false,
    pOptions: [
      { pValue: 'manager', pLabel: 'Manager' },
      { pValue: 'consultant', pLabel: 'Consultant' },
      { pValue: 'analyst', pLabel: 'Analyst' },
      { pValue: 'director', pLabel: 'Director' },
    ],
    pOptionsPlaceholder: 'Sélectionner un rôle',
    pAvatarRole: AvatarRoles.COLLAB,
  },
}

export const AllVariants: Story = {
  render: () => ({
    components: { PUserAction },
    setup() {
      const variants: PUserActionProps[] = [
        {
          pProfile: 'SL',
          pTitle: 'Suliman Lescot',
          pDescription: 'suliman.lescot@test.fr',
          pRole: 'Consultant advisory',
          pShowDelete: true,
          pAvatarRole: AvatarRoles.COLLAB,
        },
        {
          pProfile: 'JD',
          pTitle: 'Jean Dupont',
          pDescription: 'jean.dupont@company.fr',
          pTagContent: 'By default',
          pShowInput: true,
          pInputPlaceholder: 'Entrez la fonction du collaborateur',
          pShowDelete: true,
          pAvatarRole: AvatarRoles.COLLAB,
        },
        {
          pProfile: 'MM',
          pTitle: 'Marie Martin',
          pDescription: 'marie.martin@company.fr',
          pShowDelete: true,
          pShowOptions: true,
          pOptionsMultiple: false,
          pOptions: getMockedOptions(),
          pOptionsPlaceholder: 'Rôle Akuiteo',
          pAvatarRole: AvatarRoles.COLLAB,
        },
        {
          pProfile: 'AB',
          pTitle: 'Alice Bernard',
          pDescription: 'alice.bernard@company.fr',
          pWarningContent: 'Attention: Action non disponible.',
          pAvatarRole: AvatarRoles.COLLAB,
        },
      ]

      return { variants }
    },
    template: `
      <div class="space-y-4">
        <PUserAction
          v-for="(variant, index) in variants"
          :key="index"
          v-bind="variant"
        />
      </div>
    `,
  }),
}
