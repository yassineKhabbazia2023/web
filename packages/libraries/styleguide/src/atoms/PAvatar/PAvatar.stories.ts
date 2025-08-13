import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PAvatar from './PAvatar.vue'
import { AvatarRoles } from '../../utils/avatar.roles'

const meta: Meta<typeof PAvatar> = {
  title: 'Atoms/PAvatar',
  component: PAvatar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Composant d\'avatar basé sur Element Plus avec différentes tailles, couleurs et formes.',
      },
    },
  },
  argTypes: {
    pType: {
      control: 'select',
      options: ['default', 'small', 'large', 'xsmall', 'xlarge'],
      description: 'Taille de l\'avatar',
    },
    pColor: {
      control: 'select',
      options: [
        'persian-gradient',
        'orange',
        'persian',
        'cyan',
        'amethyste',
        'teal',
        'green',
        'fuschia',
        'gray',
        'white',
        'bordered-persian',
        'blue-pulse',
        'persian-light',
        'persian-600',
        'persian-400',
      ],
      description: 'Couleur de l\'avatar',
    },
    pFit: {
      control: 'select',
      options: ['fill', 'contain', 'cover', 'none', 'scale-down'],
      description: 'Mode d\'ajustement de l\'image',
    },
    pSrc: {
      control: 'text',
      description: 'URL de l\'image',
    },
    pShape: {
      control: 'select',
      options: ['circle', 'square'],
      description: 'Forme de l\'avatar',
    },
    pSelected: {
      control: 'boolean',
      description: 'État sélectionné (visible seulement sur type small)',
    },
    pRole: {
      control: 'select',
      options: ['COLLAB', 'CLIENT'],
      description: 'Rôle qui détermine la couleur automatiquement',
    },
  },
  args: {
    pType: 'default',
    pColor: 'persian-gradient',
    pFit: 'cover',
    pSrc: undefined,
    pShape: 'circle',
    pSelected: false,
    pRole: undefined,
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Default story
export const Default: Story = {
  render: (args) => ({
    components: { PAvatar },
    setup() {
      return { args }
    },
    template: '<PAvatar v-bind="args">JD</PAvatar>',
  }),
  parameters: {
    docs: {
      description: {
        story: 'Avatar par défaut avec initiales.',
      },
    },
  },
}

// Different sizes
export const Sizes: Story = {
  render: () => ({
    components: { PAvatar },
    template: `
      <div style="display: flex; align-items: center; gap: 24px;">
        <div style="text-align: center;">
          <PAvatar pType="xsmall">XS</PAvatar>
          <div style="margin-top: 8px; font-size: 12px;">XSmall</div>
        </div>
        <div style="text-align: center;">
          <PAvatar pType="small">S</PAvatar>
          <div style="margin-top: 8px; font-size: 12px;">Small</div>
        </div>
        <div style="text-align: center;">
          <PAvatar pType="default">M</PAvatar>
          <div style="margin-top: 8px; font-size: 12px;">Default</div>
        </div>
        <div style="text-align: center;">
          <PAvatar pType="large">L</PAvatar>
          <div style="margin-top: 8px; font-size: 12px;">Large</div>
        </div>
        <div style="text-align: center;">
          <PAvatar pType="xlarge">XL</PAvatar>
          <div style="margin-top: 8px; font-size: 12px;">XLarge</div>
        </div>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Différentes tailles d\'avatars disponibles.',
      },
    },
  },
}

// Different colors
export const Colors: Story = {
  render: () => ({
    components: { PAvatar },
    template: `
      <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 20px; align-items: center; text-align: center;">
        <div>
          <PAvatar pColor="persian-gradient">PG</PAvatar>
          <div style="margin-top: 8px; font-size: 11px;">Persian Gradient</div>
        </div>
        <div>
          <PAvatar pColor="orange">OR</PAvatar>
          <div style="margin-top: 8px; font-size: 11px;">Orange</div>
        </div>
        <div>
          <PAvatar pColor="cyan">CY</PAvatar>
          <div style="margin-top: 8px; font-size: 11px;">Cyan</div>
        </div>
        <div>
          <PAvatar pColor="amethyste">AM</PAvatar>
          <div style="margin-top: 8px; font-size: 11px;">Amethyste</div>
        </div>
        <div>
          <PAvatar pColor="teal">TE</PAvatar>
          <div style="margin-top: 8px; font-size: 11px;">Teal</div>
        </div>
        <div>
          <PAvatar pColor="green">GR</PAvatar>
          <div style="margin-top: 8px; font-size: 11px;">Green</div>
        </div>
        <div>
          <PAvatar pColor="fuschia">FU</PAvatar>
          <div style="margin-top: 8px; font-size: 11px;">Fuschia</div>
        </div>
        <div>
          <PAvatar pColor="gray">GY</PAvatar>
          <div style="margin-top: 8px; font-size: 11px;">Gray</div>
        </div>
        <div>
          <PAvatar pColor="blue-pulse">BP</PAvatar>
          <div style="margin-top: 8px; font-size: 11px;">Blue Pulse</div>
        </div>
        <div>
          <PAvatar pColor="persian-light">PL</PAvatar>
          <div style="margin-top: 8px; font-size: 11px;">Persian Light</div>
        </div>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Palette de couleurs disponibles pour les avatars.',
      },
    },
  },
}

// With images
export const WithImages: Story = {
  render: () => ({
    components: { PAvatar },
    template: `
      <div style="display: flex; align-items: center; gap: 24px;">
        <div style="text-align: center;">
          <PAvatar 
            pSrc="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
            pType="small"
          />
          <div style="margin-top: 8px; font-size: 12px;">Small + Image</div>
        </div>
        <div style="text-align: center;">
          <PAvatar 
            pSrc="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
            pType="default"
          />
          <div style="margin-top: 8px; font-size: 12px;">Default + Image</div>
        </div>
        <div style="text-align: center;">
          <PAvatar 
            pSrc="https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop&crop=face"
            pType="large"
          />
          <div style="margin-top: 8px; font-size: 12px;">Large + Image</div>
        </div>
        <div style="text-align: center;">
          <PAvatar pSrc="invalid-url" pType="default">
            FO
          </PAvatar>
          <div style="margin-top: 8px; font-size: 12px;">Fallback</div>
        </div>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Avatars avec images et gestion du fallback avec initiales.',
      },
    },
  },
}

// Shapes
export const Shapes: Story = {
  render: () => ({
    components: { PAvatar },
    template: `
      <div style="display: flex; align-items: center; gap: 32px;">
        <div style="text-align: center;">
          <PAvatar 
            pShape="circle" 
            pColor="persian"
            pType="large"
          >
            CI
          </PAvatar>
          <div style="margin-top: 8px; font-size: 12px;">Circle</div>
        </div>
        <div style="text-align: center;">
          <PAvatar 
            pShape="square" 
            pColor="teal"
            pType="large"
          >
            SQ
          </PAvatar>
          <div style="margin-top: 8px; font-size: 12px;">Square</div>
        </div>
        <div style="text-align: center;">
          <PAvatar 
            pShape="circle" 
            pSrc="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
            pType="large"
          />
          <div style="margin-top: 8px; font-size: 12px;">Circle + Image</div>
        </div>
        <div style="text-align: center;">
          <PAvatar 
            pShape="square" 
            pSrc="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
            pType="large"
          />
          <div style="margin-top: 8px; font-size: 12px;">Square + Image</div>
        </div>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Formes disponibles : cercle et carré, avec et sans image.',
      },
    },
  },
}

// Role-based colors
export const RoleBasedColors: Story = {
  render: () => ({
    components: { PAvatar },
    template: `
      <div style="display: flex; align-items: center; gap: 32px;">
        <div style="text-align: center;">
          <PAvatar pRole="${ AvatarRoles.COLLAB }" pType="large">
            CO
          </PAvatar>
          <div style="margin-top: 8px; font-size: 12px;">Collaborateur</div>
          <div style="margin-top: 4px; font-size: 10px; color: #666;">Role: COLLAB</div>
        </div>
        <div style="text-align: center;">
          <PAvatar pRole="${ AvatarRoles.CLIENT }" pType="large">
            CL
          </PAvatar>
          <div style="margin-top: 8px; font-size: 12px;">Client</div>
          <div style="margin-top: 4px; font-size: 10px; color: #666;">Role: CLIENT</div>
        </div>
        <div style="text-align: center;">
          <PAvatar pType="large">
            DE
          </PAvatar>
          <div style="margin-top: 8px; font-size: 12px;">Par défaut</div>
          <div style="margin-top: 4px; font-size: 10px; color: #666;">Sans rôle</div>
        </div>
        <div style="text-align: center;">
          <PAvatar pRole="${ AvatarRoles.COLLAB }" pColor="cyan" pType="large">
            FO
          </PAvatar>
          <div style="margin-top: 8px; font-size: 12px;">Couleur forcée</div>
          <div style="margin-top: 4px; font-size: 10px; color: #666;">pColor override</div>
        </div>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Couleurs automatiques basées sur les rôles utilisateur.',
      },
    },
  },
}

// All variants showcase
export const AllVariants: Story = {
  render: () => ({
    components: { PAvatar },
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px;">
        <div>
          <h3 style="margin-bottom: 16px;">Tailles</h3>
          <div style="display: flex; align-items: center; gap: 16px;">
            <PAvatar pType="xsmall" pColor="persian">XS</PAvatar>
            <PAvatar pType="small" pColor="orange">S</PAvatar>
            <PAvatar pType="default" pColor="cyan">M</PAvatar>
            <PAvatar pType="large" pColor="green">L</PAvatar>
            <PAvatar pType="xlarge" pColor="fuschia">XL</PAvatar>
          </div>
        </div>
        
        <div>
          <h3 style="margin-bottom: 16px;">Couleurs populaires</h3>
          <div style="display: flex; align-items: center; gap: 16px;">
            <PAvatar pColor="persian-gradient">PG</PAvatar>
            <PAvatar pColor="orange">OR</PAvatar>
            <PAvatar pColor="cyan">CY</PAvatar>
            <PAvatar pColor="teal">TE</PAvatar>
            <PAvatar pColor="fuschia">FU</PAvatar>
            <PAvatar pColor="blue-pulse">BP</PAvatar>
          </div>
        </div>
        
        <div>
          <h3 style="margin-bottom: 16px;">Formes et états</h3>
          <div style="display: flex; align-items: center; gap: 16px;">
            <PAvatar pShape="circle" pColor="persian">CI</PAvatar>
            <PAvatar pShape="square" pColor="teal">SQ</PAvatar>
            <PAvatar pType="small" :pSelected="false" pColor="orange">NS</PAvatar>
            <PAvatar pType="small" :pSelected="true" pColor="green">SE</PAvatar>
          </div>
        </div>
        
        <div>
          <h3 style="margin-bottom: 16px;">Avec images</h3>
          <div style="display: flex; align-items: center; gap: 16px;">
            <PAvatar 
              pSrc="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
            />
            <PAvatar 
              pSrc="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
              pShape="square"
            />
            <PAvatar 
              pSrc="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
              pType="small"
              :pSelected="true"
            />
          </div>
        </div>
        
        <div>
          <h3 style="margin-bottom: 16px;">Rôles</h3>
          <div style="display: flex; align-items: center; gap: 16px;">
            <PAvatar pRole="${AvatarRoles.COLLAB}">CO</PAvatar>
            <PAvatar pRole="${AvatarRoles.CLIENT}">CL</PAvatar>
            <PAvatar>DE</PAvatar>
          </div>
        </div>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Aperçu complet de toutes les variantes du composant PAvatar.',
      },
    },
  },
}
