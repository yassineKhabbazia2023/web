import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PdfTextExtraction from './pdf-text-extraction.vue'

const meta: Meta<typeof PdfTextExtraction> = {
  title: 'Laboratory/PDF Text Extraction',
  component: PdfTextExtraction,
  parameters: {
    docs: {
      description: {
        component: 'POC démontrant l\'extraction de texte à partir d\'un PDF uploadé via PUpload, avec pré-remplissage automatique de formulaire. Utilise PDF.js pour l\'extraction (texte embarqué uniquement, pas d\'OCR).',
      },
    },
  },
  tags: ['!autodocs'],
}

export default meta
type Story = StoryObj<typeof PdfTextExtraction>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Démonstration complète de l\'extraction de texte PDF avec upload, affichage du texte brut et pré-remplissage de formulaire.',
      },
    },
  },
}
