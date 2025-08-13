import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PDivider from './PDivider.vue'

const meta: Meta<typeof PDivider> = {
  title: 'Atoms/PDivider',
  component: PDivider,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Composant de séparateur basé sur Element Plus avec personnalisation des couleurs et styles.',
      },
    },
  },
  argTypes: {
    pDirection: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Direction du séparateur',
    },
    pBorderStyle: {
      control: 'select',
      options: ['none', 'solid', 'hidden', 'dashed'],
      description: 'Style de la bordure',
    },
    pContentPosition: {
      control: 'select',
      options: ['left', 'right', 'center'],
      description: 'Position du contenu dans le séparateur',
    },
    pBorderColor: {
      control: 'select',
      options: [
        'neutral-gray-100',
        'neutral-gray-200',
        'neutral-gray-300',
        'persian-200',
        'persian-300',
        'secondary-fuschia',
        'secondary-cyan',
        'functionnal-red',
        'functionnal-green',
      ],
      description: 'Couleur de la bordure',
    },
  },
  args: {
    pDirection: 'horizontal',
    pBorderStyle: 'solid',
    pContentPosition: 'center',
    pBorderColor: 'neutral-gray-100',
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Default story
export const Default: Story = {
  render: (args) => ({
    components: { PDivider },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 400px;">
        <p>Contenu avant le séparateur</p>
        <PDivider v-bind="args" />
        <p>Contenu après le séparateur</p>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Séparateur par défaut horizontal.',
      },
    },
  },
}

// With content
export const WithContent: Story = {
  render: () => ({
    components: { PDivider },
    template: `
      <div style="width: 400px;">
        <p>Section 1</p>
        <PDivider>OU</PDivider>
        <p>Section 2</p>
        <PDivider pContentPosition="left">Début</PDivider>
        <p>Section 3</p>
        <PDivider pContentPosition="right">Fin</PDivider>
        <p>Section 4</p>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Séparateurs avec du contenu à différentes positions.',
      },
    },
  },
}

// Different directions
export const Directions: Story = {
  render: () => ({
    components: { PDivider },
    template: `
      <div style="display: flex; gap: 32px;">
        <div style="width: 200px;">
          <p>Séparateur horizontal</p>
          <PDivider pDirection="horizontal">Horizontal</PDivider>
          <p>Contenu suivant</p>
        </div>
        
        <div style="display: flex; align-items: center; gap: 16px; height: 200px;">
          <span>Gauche</span>
          <PDivider pDirection="vertical" />
          <span>Milieu</span>
          <PDivider pDirection="vertical">Vertical</PDivider>
          <span>Droite</span>
        </div>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Séparateurs horizontaux et verticaux.',
      },
    },
  },
}

// Different styles
export const Styles: Story = {
  render: () => ({
    components: { PDivider },
    template: `
      <div style="width: 400px; display: flex; flex-direction: column; gap: 24px;">
        <div>
          <p>Style solid (par défaut)</p>
          <PDivider pBorderStyle="solid">Solid</PDivider>
        </div>
        
        <div>
          <p>Style dashed</p>
          <PDivider pBorderStyle="dashed">Dashed</PDivider>
        </div>
        
        <div>
          <p>Style none (invisible)</p>
          <PDivider pBorderStyle="none">None</PDivider>
        </div>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Différents styles de bordures disponibles.',
      },
    },
  },
}

// Different colors
export const Colors: Story = {
  render: () => ({
    components: { PDivider },
    template: `
      <div style="width: 400px; display: flex; flex-direction: column; gap: 16px;">
        <div>
          <PDivider pBorderColor="neutral-gray-100">Gris clair</PDivider>
        </div>
        <div>
          <PDivider pBorderColor="neutral-gray-300">Gris foncé</PDivider>
        </div>
        <div>
          <PDivider pBorderColor="persian-200">Persian clair</PDivider>
        </div>
        <div>
          <PDivider pBorderColor="secondary-fuschia">Fuschia</PDivider>
        </div>
        <div>
          <PDivider pBorderColor="secondary-cyan">Cyan</PDivider>
        </div>
        <div>
          <PDivider pBorderColor="functionnal-green">Vert</PDivider>
        </div>
        <div>
          <PDivider pBorderColor="functionnal-red">Rouge</PDivider>
        </div>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Séparateurs avec différentes couleurs de bordure.',
      },
    },
  },
}

// Form sections example
export const FormSections: Story = {
  render: () => ({
    components: { PDivider },
    template: `
      <div style="width: 500px; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h2 style="margin-top: 0;">Informations personnelles</h2>
        <div style="margin-bottom: 16px;">
          <label>Nom :</label>
          <input type="text" style="margin-left: 8px; padding: 4px;" />
        </div>
        <div style="margin-bottom: 16px;">
          <label>Email :</label>
          <input type="email" style="margin-left: 8px; padding: 4px;" />
        </div>
        
        <PDivider pBorderColor="persian-200">Informations de contact</PDivider>
        
        <div style="margin-bottom: 16px;">
          <label>Téléphone :</label>
          <input type="tel" style="margin-left: 8px; padding: 4px;" />
        </div>
        <div style="margin-bottom: 16px;">
          <label>Adresse :</label>
          <textarea style="margin-left: 8px; padding: 4px; width: 200px;"></textarea>
        </div>
        
        <PDivider pBorderColor="functionnal-green">Validation</PDivider>
        
        <div style="text-align: center;">
          <button style="padding: 8px 16px; background: #10b981; color: white; border: none; border-radius: 4px;">
            Enregistrer
          </button>
        </div>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Exemple d\'utilisation pour séparer des sections dans un formulaire.',
      },
    },
  },
}
