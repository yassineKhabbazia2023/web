import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PImage from './PImage.vue'

const meta: Meta<typeof PImage> = {
  title: 'Atoms/PImage',
  component: PImage,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Composant image avec résolution automatique et options d\'ajustement.',
      },
    },
  },
  argTypes: {
    pName: {
      control: 'select',
      options: [
        'check-success',
        'email',
        'eye-slash',
        'file-pdf',
        'folder',
        'hourglass',
        'lock',
        'star',
        'unlock-success',
        'warning',
        'x',
        'bell-slash-duotone',
        'brand-monogram',
        'building-duotone',
        'hourglass-duotone',
        'power-duotone',
        'error-page-1',
        'error-page-2',
        'error-page-3',
      ],
      description: 'Nom de l\'image à afficher',
    },
    pFit: {
      control: 'select',
      options: ['', 'fill', 'contain', 'cover', 'none', 'scale-down'],
      description: 'Mode d\'ajustement de l\'image',
    },
  },
  args: {
    pName: 'brand-monogram',
    pFit: 'fill',
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Default story
export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Image par défaut avec le monogramme de la marque.',
      },
    },
  },
}

// Different images
export const DifferentImages: Story = {
  render: () => ({
    components: { PImage },
    template: `
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; width: 400px;">
        <div style="text-align: center;">
          <PImage pName="brand-monogram" style="width: 80px; height: 80px;" />
          <p style="margin-top: 8px; font-size: 12px;">Monogramme</p>
        </div>
        <div style="text-align: center;">
          <PImage pName="check-success" style="width: 80px; height: 80px;" />
          <p style="margin-top: 8px; font-size: 12px;">Succès</p>
        </div>
        <div style="text-align: center;">
          <PImage pName="warning" style="width: 80px; height: 80px;" />
          <p style="margin-top: 8px; font-size: 12px;">Avertissement</p>
        </div>
        <div style="text-align: center;">
          <PImage pName="folder" style="width: 80px; height: 80px;" />
          <p style="margin-top: 8px; font-size: 12px;">Dossier</p>
        </div>
        <div style="text-align: center;">
          <PImage pName="file-pdf" style="width: 80px; height: 80px;" />
          <p style="margin-top: 8px; font-size: 12px;">PDF</p>
        </div>
        <div style="text-align: center;">
          <PImage pName="star" style="width: 80px; height: 80px;" />
          <p style="margin-top: 8px; font-size: 12px;">Étoile</p>
        </div>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Collection d\'images disponibles dans le système.',
      },
    },
  },
}

// Different fit modes
export const DifferentFitModes: Story = {
  render: () => ({
    components: { PImage },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h3 style="margin-bottom: 12px;">Fill (par défaut)</h3>
          <div style="width: 200px; height: 120px; border: 1px solid #ccc;">
            <PImage pName="brand-monogram" pFit="fill" style="width: 100%; height: 100%;" />
          </div>
        </div>
        
        <div>
          <h3 style="margin-bottom: 12px;">Contain</h3>
          <div style="width: 200px; height: 120px; border: 1px solid #ccc;">
            <PImage pName="brand-monogram" pFit="contain" style="width: 100%; height: 100%;" />
          </div>
        </div>
        
        <div>
          <h3 style="margin-bottom: 12px;">Cover</h3>
          <div style="width: 200px; height: 120px; border: 1px solid #ccc;">
            <PImage pName="brand-monogram" pFit="cover" style="width: 100%; height: 100%;" />
          </div>
        </div>
        
        <div>
          <h3 style="margin-bottom: 12px;">Scale-down</h3>
          <div style="width: 200px; height: 120px; border: 1px solid #ccc;">
            <PImage pName="brand-monogram" pFit="scale-down" style="width: 100%; height: 100%;" />
          </div>
        </div>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Différents modes d\'ajustement de l\'image dans son conteneur.',
      },
    },
  },
}

// Status images
export const StatusImages: Story = {
  render: () => ({
    components: { PImage },
    template: `
      <div style="display: flex; gap: 32px; align-items: center;">
        <div style="text-align: center;">
          <PImage pName="check-success" style="width: 64px; height: 64px;" />
          <h4 style="margin-top: 12px; color: #52c41a;">Opération réussie</h4>
          <p style="margin-top: 4px; color: #666;">Votre action a été effectuée avec succès</p>
        </div>
        
        <div style="text-align: center;">
          <PImage pName="warning" style="width: 64px; height: 64px;" />
          <h4 style="margin-top: 12px; color: #faad14;">Attention requise</h4>
          <p style="margin-top: 4px; color: #666;">Vérifiez les informations saisies</p>
        </div>
        
        <div style="text-align: center;">
          <PImage pName="x" style="width: 64px; height: 64px;" />
          <h4 style="margin-top: 12px; color: #ff4d4f;">Erreur détectée</h4>
          <p style="margin-top: 4px; color: #666;">Une erreur s'est produite</p>
        </div>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Images utilisées pour indiquer le statut d\'une opération.',
      },
    },
  },
}

// File type images
export const FileTypePng: Story = {
  render: () => ({
    components: { PImage },
    template: `
      <div style="display: flex; gap: 24px; align-items: center;">
        <div style="text-align: center;">
          <PImage pName="file-pdf" style="width: 48px; height: 48px;" />
          <p style="margin-top: 8px; font-size: 14px;">document.pdf</p>
        </div>
        
        <div style="text-align: center;">
          <PImage pName="folder" style="width: 48px; height: 48px;" />
          <p style="margin-top: 8px; font-size: 14px;">Mes Documents</p>
        </div>
        
        <div style="text-align: center;">
          <PImage pName="email" style="width: 48px; height: 48px;" />
          <p style="margin-top: 8px; font-size: 14px;">message.eml</p>
        </div>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Images représentant différents types de fichiers.',
      },
    },
  },
}

// Error pages
export const ErrorPages: Story = {
  render: () => ({
    components: { PImage },
    template: `
      <div style="display: flex; gap: 32px;">
        <div style="text-align: center;">
          <PImage pName="error-page-1" style="width: 120px; height: 120px;" />
          <h4 style="margin-top: 12px;">Page non trouvée</h4>
          <p style="margin-top: 4px; color: #666;">Erreur 404</p>
        </div>
        
        <div style="text-align: center;">
          <PImage pName="error-page-2" style="width: 120px; height: 120px;" />
          <h4 style="margin-top: 12px;">Accès refusé</h4>
          <p style="margin-top: 4px; color: #666;">Erreur 403</p>
        </div>
        
        <div style="text-align: center;">
          <PImage pName="error-page-3" style="width: 120px; height: 120px;" />
          <h4 style="margin-top: 12px;">Erreur serveur</h4>
          <p style="margin-top: 4px; color: #666;">Erreur 500</p>
        </div>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Images utilisées pour les pages d\'erreur.',
      },
    },
  },
}
