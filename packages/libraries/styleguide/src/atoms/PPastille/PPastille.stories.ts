import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PPastille from './PPastille.vue'
import { pulseGeneratedIcons } from '../PIcon/components/constants'

const meta: Meta<typeof PPastille> = {
  title: 'Atoms/PPastille',
  component: PPastille,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Composant pastille/badge basé sur Element Plus avec différents styles.',
      },
    },
  },
  argTypes: {
    pType: {
      control: 'select',
      options: ['default', 'warning', 'dark-green', 'white'],
      description: 'Type de style de la pastille',
    },
    pSize: {
      control: 'select',
      options: ['default', 'small'],
      description: 'Taille de la pastille',
    },
    pDisabled: {
      control: 'boolean',
      description: 'État désactivé de la pastille',
    },
    pIconName: {
      control: 'select',
      options: [undefined, ...pulseGeneratedIcons.map(icon => icon.name)],
      description: 'Nom de l\'icône à afficher (optionnel)',
    },
  },
  args: {
    pType: 'default',
    pSize: 'default',
    pDisabled: false,
    pIconName: undefined,
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Default story
export const Default: Story = {
  render: (args) => ({
    components: { PPastille },
    setup() {
      return { args }
    },
    template: '<PPastille v-bind="args">3</PPastille>',
  }),
  parameters: {
    docs: {
      description: {
        story: 'Pastille par défaut.',
      },
    },
  },
}

// Different types
export const DifferentTypes: Story = {
  render: () => ({
    components: { PPastille },
    template: `
      <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
        <PPastille pType="default">1</PPastille>
        <PPastille pType="warning">12</PPastille>
        <PPastille pType="dark-green">1234</PPastille>
        <PPastille pType="white">1</PPastille>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Différents types de pastilles avec leurs styles respectifs.',
      },
    },
  },
}

// Different sizes
export const DifferentSizes: Story = {
  render: () => ({
    components: { PPastille },
    template: `
      <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
        <PPastille pSize="small">1</PPastille>
        <PPastille pSize="default">12</PPastille>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Différentes tailles de pastilles.',
      },
    },
  },
}

// With icons
export const WithIcons: Story = {
  render: () => ({
    components: { PPastille },
    template: `
      <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
        <PPastille pIconName="check" pType="default" />
        <PPastille pIconName="exclamationTriangle" pType="warning" />
        <PPastille pIconName="x" pType="dark-green" />
        <PPastille pIconName="infoCircle" pType="white" />
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Pastilles avec des icônes au lieu de nombres.',
      },
    },
  },
}

// States
export const States: Story = {
  render: () => ({
    components: { PPastille },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="display: flex; gap: 16px; align-items: center;">
          <PPastille pType="default">1</PPastille>
          <PPastille pType="default" :pDisabled="true">1</PPastille>
        </div>
        <div style="display: flex; gap: 16px; align-items: center;">
          <PPastille pType="warning">2</PPastille>
          <PPastille pType="warning" :pDisabled="true">2</PPastille>
        </div>
        <div style="display: flex; gap: 16px; align-items: center;">
          <PPastille pIconName="check" pType="dark-green"></PPastille>
          <PPastille pIconName="check" pType="dark-green" :pDisabled="true"></PPastille>
        </div>
        <div style="display: flex; gap: 16px; align-items: center;">
          <PPastille pIconName="check" pType="white">3</PPastille>
          <PPastille pIconName="check" pType="white" :pDisabled="true">3</PPastille>
        </div>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'États normal et désactivé des pastilles.',
      },
    },
  },
}
