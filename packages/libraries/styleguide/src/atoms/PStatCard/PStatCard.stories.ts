import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PStatCard from './PStatCard.vue'

const meta: Meta<typeof PStatCard> = {
  title: 'Atoms/PStatCard',
  component: PStatCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Stat card component for displaying key metrics with an icon, value, and description. Used in dashboards to show KPIs.',
      },
    },
  },
  argTypes: {
    pTitle: {
      control: 'text',
      description: 'Title displayed in the header (will be uppercased)',
    },
    pValue: {
      control: 'text',
      description: 'Main value to display',
    },
    pDescription: {
      control: 'text',
      description: 'Description text below the value',
    },
    pIcon: {
      control: 'select',
      options: [undefined, 'clock', 'currencyEuro', 'thumbsUp', 'barChart', 'speedometer2', 'people', 'checkCircle', 'exclamationTriangle', 'xCircle'],
      description: 'Icon displayed next to the title',
    },
    pBackgroundClass: {
      control: 'text',
      description: 'CSS class for background color (StyleGuide class)',
    },
    pAccentClass: {
      control: 'text',
      description: 'CSS class for icon and title color (StyleGuide class)',
    },
  },
  args: {
    pTitle: 'Utilisation',
    pValue: '10',
    pDescription: 'Nombre total d\'appels',
    pIcon: 'clock',
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Default story - uses default information colors
export const Default: Story = {
  render: (args) => ({
    components: { PStatCard },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 280px;">
        <PStatCard v-bind="args" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Default stat card with information colors (blue background, teal accent).',
      },
    },
  },
}

// Dashboard Example - 4 cards in a row
export const DashboardExample: Story = {
  render: () => ({
    components: { PStatCard },
    template: `
      <div style="display: flex; gap: 16px;">
        <div style="flex: 1; min-width: 200px;">
          <PStatCard
            pTitle="Utilisation"
            pValue="10"
            pDescription="Nombre total d'appels"
            pIcon="clock"
          />
        </div>
        <div style="flex: 1; min-width: 200px;">
          <PStatCard
            pTitle="Coût total"
            pValue="0.99 €"
            pDescription="sur la sélection actuelle"
            pIcon="currencyEuro"
          />
        </div>
        <div style="flex: 1; min-width: 200px;">
          <PStatCard
            pTitle="Temps moyen"
            pValue="2.21 s"
            pDescription="Latence moyenne de réponse"
            pIcon="clock"
          />
        </div>
        <div style="flex: 1; min-width: 200px;">
          <PStatCard
            pTitle="Satisfaction"
            pValue="75%"
            pDescription="Taux d'avis positif"
            pIcon="thumbsUp"
          />
        </div>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Example of stat cards used together in a dashboard layout.',
      },
    },
  },
}

// Color Variants
export const ColorVariants: Story = {
  render: () => ({
    components: { PStatCard },
    template: `
      <div style="display: flex; gap: 16px; flex-wrap: wrap;">
        <div style="width: 220px;">
          <PStatCard
            pTitle="Information"
            pValue="42"
            pDescription="Default variant"
            pIcon="infoCircle"
          />
        </div>
        <div style="width: 220px;">
          <PStatCard
            pTitle="Success"
            pValue="98%"
            pDescription="Success rate"
            pIcon="checkCircle"
            pBackgroundClass="bg--surface-success"
            pAccentClass="text-color--text-success"
          />
        </div>
        <div style="width: 220px;">
          <PStatCard
            pTitle="Warning"
            pValue="3"
            pDescription="Items need attention"
            pIcon="exclamationTriangle"
            pBackgroundClass="bg--surface-warning"
            pAccentClass="text-color--text-warning"
          />
        </div>
        <div style="width: 220px;">
          <PStatCard
            pTitle="Error"
            pValue="1"
            pDescription="Critical error"
            pIcon="xCircle"
            pBackgroundClass="bg--surface-error"
            pAccentClass="text-color--text-error"
          />
        </div>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Different color variants using StyleGuide classes: information (default), success, warning, error.',
      },
    },
  },
}

// Without Icon
export const WithoutIcon: Story = {
  render: () => ({
    components: { PStatCard },
    template: `
      <div style="width: 280px;">
        <PStatCard
          pTitle="Total"
          pValue="1,234"
          pDescription="Without an icon"
        />
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Stat card without an icon.',
      },
    },
  },
}

// Without Description
export const WithoutDescription: Story = {
  render: () => ({
    components: { PStatCard },
    template: `
      <div style="width: 280px;">
        <PStatCard
          pTitle="Revenue"
          pValue="12,450 €"
          pIcon="currencyEuro"
        />
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Stat card without a description.',
      },
    },
  },
}

// Custom Colors Example
export const CustomColors: Story = {
  render: () => ({
    components: { PStatCard },
    template: `
      <div style="display: flex; gap: 16px;">
        <div style="width: 220px;">
          <PStatCard
            pTitle="Persian"
            pValue="256"
            pDescription="Custom purple"
            pIcon="stars"
            pBackgroundClass="bg--persian-100"
            pAccentClass="text-color--persian-500"
          />
        </div>
        <div style="width: 220px;">
          <PStatCard
            pTitle="Jungle"
            pValue="512"
            pDescription="Custom green"
            pIcon="checkCircle"
            pBackgroundClass="bg--jungle-50"
            pAccentClass="text-color--jungle-600"
          />
        </div>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Examples using custom StyleGuide color classes.',
      },
    },
  },
}
