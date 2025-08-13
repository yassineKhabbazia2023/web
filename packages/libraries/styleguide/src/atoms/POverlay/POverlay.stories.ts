import type { Meta, StoryObj } from '@storybook/vue3-vite'
import POverlay from './POverlay.vue'

const meta: Meta<typeof POverlay> = {
  title: 'Atoms/POverlay',
  component: POverlay,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Composant overlay pour créer des superpositions avec arrière-plan et contenu centralisé.',
      },
    },
  },
  argTypes: {
    pBackgroundColor: {
      control: 'text',
      description: 'Couleur de l\'arrière-plan de l\'overlay',
    },
    pHasOverEffect: {
      control: 'boolean',
      description: 'Applique un effet au survol',
    },
    pIsVignette: {
      control: 'boolean',
      description: 'Mode vignette (hauteur 100%) vs mode plein écran (100vh)',
    },
  },
  args: {
    pBackgroundColor: undefined,
    pHasOverEffect: false,
    pIsVignette: false,
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Default story
export const Default: Story = {
  render: (args) => ({
    components: { POverlay },
    setup() {
      return { args }
    },
    template: `
      <POverlay v-bind="args">
        <div style="background: white; padding: 32px; border-radius: 8px; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
          <h2>Contenu de l'overlay</h2>
          <p>Ceci est un exemple d'overlay par défaut</p>
          <button style="margin-top: 16px; padding: 8px 16px; background: #1890ff; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Action
          </button>
        </div>
      </POverlay>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Overlay par défaut en mode plein écran avec contenu centré.',
      },
    },
  },
}

// Vignette mode
export const VignetteMode: Story = {
  render: () => ({
    components: { POverlay },
    template: `
      <div style="height: 400px; border: 2px dashed #ccc; position: relative;">
        <p style="position: absolute; top: 10px; left: 10px; margin: 0; color: #666;">
          Zone conteneur (400px de hauteur)
        </p>
        <POverlay :pIsVignette="true">
          <div style="background: white; padding: 24px; border-radius: 8px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h3>Mode vignette</h3>
            <p>L'overlay prend la hauteur de son conteneur</p>
          </div>
        </POverlay>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Overlay en mode vignette qui s\'adapte à la hauteur de son conteneur.',
      },
    },
  },
}

// With hover effect
export const WithHoverEffect: Story = {
  render: () => ({
    components: { POverlay },
    template: `
      <div style="height: 300px; border: 2px dashed #ccc; position: relative;">
        <p style="position: absolute; top: 10px; left: 10px; margin: 0; color: #666;">
          Survolez l'overlay pour voir l'effet
        </p>
        <POverlay :pIsVignette="true" :pHasOverEffect="true">
          <div style="background: white; padding: 24px; border-radius: 8px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h3>Effet au survol</h3>
            <p>Cet overlay réagit au survol de la souris</p>
          </div>
        </POverlay>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Overlay avec effet visuel au survol de la souris.',
      },
    },
  },
}

// Different content types
export const DifferentContentTypes: Story = {
  render: () => ({
    components: { POverlay },
    template: `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; height: 600px;">
        <div style="border: 2px dashed #ccc; position: relative;">
          <p style="position: absolute; top: 10px; left: 10px; margin: 0; color: #666; z-index: 10;">
            Modal de confirmation
          </p>
          <POverlay :pIsVignette="true">
            <div style="background: white; padding: 24px; border-radius: 8px; text-align: center; max-width: 400px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
              <div style="font-size: 48px; margin-bottom: 16px;">⚠️</div>
              <h3 style="margin-bottom: 16px; color: #d32f2f;">Confirmer la suppression</h3>
              <p style="margin-bottom: 24px; color: #666;">
                Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.
              </p>
              <div style="display: flex; gap: 12px; justify-content: center;">
                <button style="padding: 8px 16px; background: #f5f5f5; border: 1px solid #ccc; border-radius: 4px; cursor: pointer;">
                  Annuler
                </button>
                <button style="padding: 8px 16px; background: #d32f2f; color: white; border: none; border-radius: 4px; cursor: pointer;">
                  Supprimer
                </button>
              </div>
            </div>
          </POverlay>
        </div>
        
        <div style="border: 2px dashed #ccc; position: relative;">
          <p style="position: absolute; top: 10px; left: 10px; margin: 0; color: #666; z-index: 10;">
            Chargement
          </p>
          <POverlay :pIsVignette="true">
            <div style="background: white; padding: 32px; border-radius: 8px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <div style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #1890ff; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 16px;"></div>
              <p style="color: #666;">Chargement en cours...</p>
            </div>
          </POverlay>
        </div>
      </div>
      
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Différents types de contenu dans des overlays : modal de confirmation et indicateur de chargement.',
      },
    },
  },
}

// Image gallery overlay
export const ImageGalleryOverlay: Story = {
  render: () => ({
    components: { POverlay },
    template: `
      <div style="height: 500px; border: 2px dashed #ccc; position: relative;">
        <p style="position: absolute; top: 10px; left: 10px; margin: 0; color: #666; z-index: 10;">
          Overlay pour galerie d'images
        </p>
        <POverlay :pIsVignette="true">
          <div style="background: white; border-radius: 8px; overflow: hidden; max-width: 600px; box-shadow: 0 4px 20px rgba(0,0,0,0.15);">
            <div style="position: relative;">
              <div style="width: 100%; height: 300px; background: linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%); background-size: 20px 20px; background-position: 0 0, 0 10px, 10px -10px, -10px 0px; display: flex; align-items: center; justify-content: center; color: #666;">
                📷 Image exemple
              </div>
              <button style="position: absolute; top: 12px; right: 12px; width: 32px; height: 32px; background: rgba(0,0,0,0.5); color: white; border: none; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                ✕
              </button>
            </div>
            <div style="padding: 16px;">
              <h4 style="margin: 0 0 8px 0;">Titre de l'image</h4>
              <p style="margin: 0; color: #666; font-size: 14px;">
                Description de l'image avec quelques détails supplémentaires.
              </p>
              <div style="margin-top: 16px; display: flex; justify-content: space-between; align-items: center;">
                <button style="padding: 8px 16px; background: #f5f5f5; border: 1px solid #ccc; border-radius: 4px; cursor: pointer;">
                  ← Précédent
                </button>
                <span style="color: #666; font-size: 14px;">1 / 5</span>
                <button style="padding: 8px 16px; background: #1890ff; color: white; border: none; border-radius: 4px; cursor: pointer;">
                  Suivant →
                </button>
              </div>
            </div>
          </div>
        </POverlay>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Exemple d\'overlay pour une galerie d\'images avec navigation.',
      },
    },
  },
}
