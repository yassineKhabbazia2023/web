import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PEntityAvatar from './PEntityAvatar.vue'

const meta: Meta<typeof PEntityAvatar> = {
  title: 'Atoms/PEntityAvatar',
  component: PEntityAvatar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Avatar dédié aux entités. La couleur et l\'icône sont dérivées automatiquement à partir du `pAccountType` (PROSPECT ou REGULAR).',
      },
    },
  },
  argTypes: {
    pAccountType: {
      control: 'select',
      options: ['REGULAR', 'PROSPECT'],
      description: 'Type de compte de l\'entité.',
    },
    pColor: {
      control: 'select',
      options: ['amethyste', 'persian-light', 'persian-400', 'orange', 'cyan', 'teal'],
      description: 'Couleur pour les comptes REGULAR (ignorée pour les prospects).',
    },
    pType: {
      control: 'select',
      options: ['xsmall', 'small', 'default', 'large', 'xlarge'],
      description: 'Taille de l\'avatar.',
    },
    pShape: {
      control: 'select',
      options: ['circle', 'square'],
      description: 'Forme de l\'avatar.',
    },
    pSelected: {
      control: 'boolean',
      description: 'État sélectionné (uniquement visible sur le type small).',
    },
  },
  args: {
    pAccountType: 'REGULAR',
    pColor: 'amethyste',
    pType: 'default',
    pShape: 'circle',
    pSelected: false,
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PEntityAvatar },
    setup() {
      return { args }
    },
    template: '<PEntityAvatar v-bind="args" />',
  }),
  parameters: {
    docs: {
      description: {
        story: 'Avatar d\'entité régulière : couleur par défaut, icône `pulse`.',
      },
    },
  },
}

export const Prospect: Story = {
  args: {
    pAccountType: 'PROSPECT',
  },
  render: (args) => ({
    components: { PEntityAvatar },
    setup() {
      return { args }
    },
    template: '<PEntityAvatar v-bind="args" />',
  }),
  parameters: {
    docs: {
      description: {
        story: 'Avatar d\'entité prospect : couleur dédiée `prospect`, icône `rydgeMonogram`.',
      },
    },
  },
}

export const AllSizes: Story = {
  render: () => ({
    components: { PEntityAvatar },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4 style="margin-bottom: 12px;">Regular</h4>
          <div style="display: flex; align-items: center; gap: 16px;">
            <PEntityAvatar pAccountType="REGULAR" pType="xsmall" />
            <PEntityAvatar pAccountType="REGULAR" pType="small" />
            <PEntityAvatar pAccountType="REGULAR" pType="default" />
            <PEntityAvatar pAccountType="REGULAR" pType="large" />
            <PEntityAvatar pAccountType="REGULAR" pType="xlarge" />
          </div>
        </div>
        <div>
          <h4 style="margin-bottom: 12px;">Prospect</h4>
          <div style="display: flex; align-items: center; gap: 16px;">
            <PEntityAvatar pAccountType="PROSPECT" pType="xsmall" />
            <PEntityAvatar pAccountType="PROSPECT" pType="small" />
            <PEntityAvatar pAccountType="PROSPECT" pType="default" />
            <PEntityAvatar pAccountType="PROSPECT" pType="large" />
            <PEntityAvatar pAccountType="PROSPECT" pType="xlarge" />
          </div>
        </div>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Toutes les tailles pour chaque type de compte.',
      },
    },
  },
}
