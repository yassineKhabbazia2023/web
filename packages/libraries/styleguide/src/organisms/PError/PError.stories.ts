import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PError from './PError.vue'
import { PErrorBlockProps } from './PErrorTypes'

const meta: Meta<typeof PError> = {
  title: 'Organisms/PError',
  component: PError,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'An error page component that displays error information with illustration, title, description, and action button.',
      },
    },
  },
  argTypes: {
    pTitle: {
      control: 'text',
      description: 'Title of the error page',
      table: {
        type: { summary: 'string' },
      },
    },
    pDescription: {
      control: 'text',
      description: 'Description text explaining the error',
      table: {
        type: { summary: 'string' },
      },
    },
    pErrorName: {
      control: 'text',
      description: 'Error code or name (e.g., 404, 500)',
      table: {
        type: { summary: 'string' },
      },
    },
    pErrorText: {
      control: 'text',
      description: 'Short error text',
      table: {
        type: { summary: 'string' },
      },
    },
    pButtonText: {
      control: 'text',
      description: 'Text for the action button',
      table: {
        type: { summary: 'string' },
      },
    },
    pIllustrationName: {
      control: 'select',
      options: ['error-page-1', 'error-page-2', 'error-page-3'],
      description: 'Name of the illustration to display',
      table: {
        type: { summary: 'ImageName' },
      },
    },
    pHasFooter: {
      control: 'boolean',
      description: 'Whether to show the footer slot',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    pIsFullSize: {
      control: 'boolean',
      description: 'Whether the error page should take full size',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<PErrorBlockProps>

export const Default: Story = {
  render: (args) => ({
    components: { PError },
    setup() {
      const handleClick = () => {
        console.log('Error page button clicked')
      }

      return {
        args,
        handleClick,
      }
    },
    template: `
      <PError v-bind="args" @handle-click="handleClick">
        <template #title>
          Cette page n'existe pas.
        </template>
        <template #footer-middle-content>
          <div>
            Contact support : <span class="no-wrap">01 23 45 67 89</span>
          </div>
          <div>
            © Awesome Brand
          </div>
        </template>
      </PError>
    `,
  }),
  args: {
    pTitle: "Cette page n'existe pas.",
    pDescription: 'Nous sommes désolés, mais la page que vous recherchez est introuvable.',
    pButtonText: "Retour à la page d'accueil",
    pErrorName: '404',
    pErrorText: 'Page introuvable',
    pIllustrationName: 'error-page-1',
    pHasFooter: true,
    pIsFullSize: false,
  },
}

export const Error500: Story = {
  render: (args) => ({
    components: { PError },
    setup() {
      const handleClick = () => {
        console.log('Refresh page clicked')
      }

      return {
        args,
        handleClick,
      }
    },
    template: `
      <PError v-bind="args" @handle-click="handleClick">
        <template #title>
          Erreur interne du serveur
        </template>
        <template #footer-middle-content>
          <div>
            En cas de problème persistant, contactez-nous : <span class="no-wrap">support@example.com</span>
          </div>
          <div>
            © Awesome Brand
          </div>
        </template>
      </PError>
    `,
  }),
  args: {
    pTitle: 'Erreur interne du serveur',
    pDescription: 'Une erreur technique est survenue. Nos équipes ont été notifiées et travaillent à résoudre le problème.',
    pButtonText: 'Actualiser la page',
    pErrorName: '500',
    pErrorText: 'Erreur serveur',
    pIllustrationName: 'error-page-2',
    pHasFooter: true,
    pIsFullSize: false,
  },
}

export const Error403: Story = {
  render: (args) => ({
    components: { PError },
    setup() {
      const handleClick = () => {
        console.log('Go back clicked')
      }

      return {
        args,
        handleClick,
      }
    },
    template: `
      <PError v-bind="args" @handle-click="handleClick">
        <template #title>
          Accès refusé
        </template>
        <template #footer-middle-content>
          <div>
            Besoin d'aide ? Contactez votre administrateur
          </div>
          <div>
            © Awesome Brand
          </div>
        </template>
      </PError>
    `,
  }),
  args: {
    pTitle: 'Accès refusé',
    pDescription: "Vous n'avez pas les permissions nécessaires pour accéder à cette page.",
    pButtonText: 'Retour',
    pErrorName: '403',
    pErrorText: 'Accès interdit',
    pIllustrationName: 'error-page-3',
    pHasFooter: true,
    pIsFullSize: false,
  },
}

export const WithoutFooter: Story = {
  render: (args) => ({
    components: { PError },
    setup() {
      const handleClick = () => {
        console.log('Action button clicked')
      }

      return {
        args,
        handleClick,
      }
    },
    template: `
      <PError v-bind="args" @handle-click="handleClick">
        <template #title>
          Page temporairement indisponible
        </template>
      </PError>
    `,
  }),
  args: {
    pTitle: 'Page temporairement indisponible',
    pDescription: 'Cette page est actuellement en maintenance. Veuillez réessayer plus tard.',
    pButtonText: 'Réessayer',
    pErrorName: '503',
    pErrorText: 'Service indisponible',
    pIllustrationName: 'error-page-1',
    pHasFooter: false,
    pIsFullSize: false,
  },
}

export const FullSize: Story = {
  render: (args) => ({
    components: { PError },
    setup() {
      const handleClick = () => {
        console.log('Home button clicked')
      }

      return {
        args,
        handleClick,
      }
    },
    template: `
      <PError v-bind="args" @handle-click="handleClick">
        <template #title>
          Application Error
        </template>
        <template #footer-middle-content>
          <div>
            Error ID: #ERR-2024-001
          </div>
          <div>
            Time: ${new Date().toLocaleString()}
          </div>
        </template>
      </PError>
    `,
  }),
  args: {
    pTitle: 'Application Error',
    pDescription: "Une erreur inattendue s'est produite. L'erreur a été enregistrée et sera corrigée prochainement.",
    pButtonText: 'Retour à l\'accueil',
    pErrorName: 'ERROR',
    pErrorText: 'Application Error',
    pIllustrationName: 'error-page-2',
    pHasFooter: true,
    pIsFullSize: true,
  },
}

export const CustomContent: Story = {
  render: (args) => ({
    components: { PError },
    setup() {
      const handleClick = () => {
        console.log('Contact support clicked')
      }

      return {
        args,
        handleClick,
      }
    },
    template: `
      <PError v-bind="args" @handle-click="handleClick">
        <template #title>
          <h1 style="color: #e74c3c;">Oops! Something went wrong</h1>
        </template>
        <template #footer-middle-content>
          <div style="text-align: center;">
            <p><strong>Need immediate assistance?</strong></p>
            <p>📞 Emergency hotline: +1 (555) 123-4567</p>
            <p>📧 support@example.com</p>
            <p style="margin-top: 16px; font-size: 12px; color: #666;">
              © 2024 Your Company Name. All rights reserved.
            </p>
          </div>
        </template>
      </PError>
    `,
  }),
  args: {
    pTitle: 'Custom Error Page',
    pDescription: 'This demonstrates how you can customize the error page with custom templates and styling.',
    pButtonText: 'Contact Support',
    pErrorName: 'CUSTOM',
    pErrorText: 'Custom Error',
    pIllustrationName: 'error-page-3',
    pHasFooter: true,
    pIsFullSize: false,
  },
}
