import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PLoader from './PLoader.vue'

const meta: Meta<typeof PLoader> = {
  title: 'Atoms/PLoader',
  component: PLoader,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Composant de chargement animé avec différents styles et tailles.',
      },
    },
  },
  argTypes: {
    pType: {
      control: 'select',
      options: ['default', 'primary', 'gradient', 'no-color'],
      description: 'Type de style du loader',
    },
    pSize: {
      control: 'text',
      description: 'Taille du loader (px, em, rem, etc.)',
    },
  },
  args: {
    pType: 'default',
    pSize: '24px',
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Default story
export const Default: Story = {
  render: (args) => ({
    components: { PLoader },
    setup() {
      return { args }
    },
    template: '<PLoader v-bind="args" />',
  }),
  parameters: {
    docs: {
      description: {
        story: 'Loader par défaut avec animation de rotation.',
      },
    },
  },
}

// Different types
export const Types: Story = {
  render: () => ({
    components: { PLoader },
    template: `
      <div style="display: flex; align-items: center; gap: 32px;">
        <div style="text-align: center;">
          <PLoader pType="default" pSize="32px" />
          <div style="margin-top: 8px; font-size: 12px;">Default</div>
        </div>
        <div style="text-align: center;">
          <PLoader pType="primary" pSize="32px" />
          <div style="margin-top: 8px; font-size: 12px;">Primary</div>
        </div>
        <div style="text-align: center;">
          <PLoader pType="gradient" pSize="32px" />
          <div style="margin-top: 8px; font-size: 12px;">Gradient</div>
        </div>
        <div style="text-align: center;">
          <PLoader pType="no-color" pSize="32px" />
          <div style="margin-top: 8px; font-size: 12px;">No Color</div>
        </div>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Différents types de styles disponibles pour le loader.',
      },
    },
  },
}

// Different sizes
export const Sizes: Story = {
  render: () => ({
    components: { PLoader },
    template: `
      <div style="display: flex; align-items: center; gap: 32px;">
        <div style="text-align: center;">
          <PLoader pType="primary" pSize="16px" />
          <div style="margin-top: 8px; font-size: 12px;">16px</div>
        </div>
        <div style="text-align: center;">
          <PLoader pType="primary" pSize="24px" />
          <div style="margin-top: 8px; font-size: 12px;">24px</div>
        </div>
        <div style="text-align: center;">
          <PLoader pType="primary" pSize="32px" />
          <div style="margin-top: 8px; font-size: 12px;">32px</div>
        </div>
        <div style="text-align: center;">
          <PLoader pType="primary" pSize="48px" />
          <div style="margin-top: 8px; font-size: 12px;">48px</div>
        </div>
        <div style="text-align: center;">
          <PLoader pType="primary" pSize="64px" />
          <div style="margin-top: 8px; font-size: 12px;">64px</div>
        </div>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Différentes tailles de loaders disponibles.',
      },
    },
  },
}

// In context examples
export const InContext: Story = {
  render: () => ({
    components: { PLoader },
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px;">
        <!-- Button loading -->
        <div style="display: flex; align-items: center; gap: 16px;">
          <button style="padding: 8px 16px; background: #6366f1; color: white; border: none; border-radius: 4px; display: flex; align-items: center; gap: 8px;">
            <PLoader pType="no-color" pSize="16px" />
            Chargement...
          </button>
          <button style="padding: 8px 16px; background: #e5e7eb; color: #6b7280; border: none; border-radius: 4px; display: flex; align-items: center; gap: 8px;" disabled>
            <PLoader pType="default" pSize="16px" />
            Traitement...
          </button>
        </div>
        
        <!-- Card loading -->
        <div style="width: 300px; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px; text-align: center;">
          <PLoader pType="primary" pSize="40px" />
          <p style="margin-top: 16px; color: #6b7280;">Chargement des données...</p>
        </div>
        
        <!-- Inline loading -->
        <div style="display: flex; align-items: center; gap: 8px;">
          <span>Sauvegarde en cours</span>
          <PLoader pType="primary" pSize="16px" />
        </div>
        
        <!-- Table loading -->
        <div style="width: 400px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <div style="padding: 16px; border-bottom: 1px solid #e5e7eb; background: #f9fafb;">
            <h3 style="margin: 0;">Liste des utilisateurs</h3>
          </div>
          <div style="padding: 48px; text-align: center;">
            <PLoader pType="gradient" pSize="48px" />
            <p style="margin-top: 16px; color: #6b7280;">Chargement des utilisateurs...</p>
          </div>
        </div>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Exemples d\'utilisation du loader dans différents contextes.',
      },
    },
  },
}

// Loading states comparison
export const LoadingStates: Story = {
  render: () => ({
    components: { PLoader },
    template: `
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; width: 600px;">
        <!-- Small loader for inline -->
        <div style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h4 style="margin-top: 0;">Chargement inline</h4>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span>Statut :</span>
            <PLoader pType="primary" pSize="16px" />
            <span style="color: #6b7280;">En cours...</span>
          </div>
        </div>
        
        <!-- Medium loader for forms -->
        <div style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h4 style="margin-top: 0;">Chargement formulaire</h4>
          <div style="text-align: center; padding: 20px;">
            <PLoader pType="primary" pSize="24px" />
            <p style="margin-top: 12px; margin-bottom: 0; color: #6b7280;">Validation...</p>
          </div>
        </div>
        
        <!-- Large loader for page -->
        <div style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h4 style="margin-top: 0;">Chargement page</h4>
          <div style="text-align: center; padding: 40px;">
            <PLoader pType="gradient" pSize="48px" />
            <p style="margin-top: 16px; margin-bottom: 0; color: #6b7280;">Chargement initial...</p>
          </div>
        </div>
        
        <!-- Subtle loader -->
        <div style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h4 style="margin-top: 0;">Chargement discret</h4>
          <div style="text-align: center; padding: 20px;">
            <PLoader pType="default" pSize="20px" />
            <p style="margin-top: 12px; margin-bottom: 0; color: #9ca3af;">Synchronisation...</p>
          </div>
        </div>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Comparaison des différents états de chargement selon le contexte.',
      },
    },
  },
}
