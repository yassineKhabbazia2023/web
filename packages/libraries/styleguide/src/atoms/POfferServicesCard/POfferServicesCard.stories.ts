import type { Meta, StoryObj } from '@storybook/vue3-vite'
import POfferServicesCard from './POfferServicesCard.vue'

const meta: Meta<typeof POfferServicesCard> = {
  title: 'Atoms/POfferServicesCard',
  component: POfferServicesCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'The Offer Services Card component is designed to efficiently display offers and associated services, ensuring a concise yet informative presentation for users.',
      },
    },
  },
  argTypes: {
    pLogo: {
      control: 'text',
      description: 'The logo/image name for the offer',
    },
    pTitle: {
      control: 'text',
      description: 'The title of the offer',
    },
    pServices: {
      control: 'object',
      description: 'Array of services with their status and properties',
    },
  },
  args: {
    pLogo: 'brand-color',
    pTitle: 'RYDGE platform services',
    pServices: [
      {
        pStatus: true,
        pDisabled: true,
        pName: 'GED Accounting',
        pTag: {
          pContent: 'Included',
          pColor: 'gray-900',
        },
      },
    ],
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { POfferServicesCard },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 700px; padding: 24px;">
        <POfferServicesCard v-bind="args" />
      </div>
    `,
  }),
}

export const WithMultipleServices: Story = {
  args: {
    pLogo: 'meg',
    pTitle: "MEG partner's services",
    pServices: [
      {
        pStatus: true,
        pDisabled: true,
        pName: 'Access to the Meg tool',
        pTag: {
          pContent: 'Included',
          pColor: 'gray-900',
        },
      },
      {
        pStatus: true,
        pDisabled: false,
        pName: 'Cash register module',
      },
      {
        pStatus: true,
        pDisabled: false,
        pName: 'Billing module',
      },
      {
        pStatus: false,
        pDisabled: false,
        pName: 'Initiation training in Meg',
        pTag: {
          pContent: 'Additional price',
          pColor: 'amethyste',
        },
      },
    ],
  },
}

export const LoopServices: Story = {
  args: {
    pLogo: 'loop-color',
    pTitle: "LOOP partner's services",
    pServices: [
      {
        pStatus: true,
        pDisabled: true,
        pName: 'Access to the Loop tool',
        pTag: {
          pContent: 'Included',
          pColor: 'gray-900',
        },
      },
      {
        pStatus: false,
        pDisabled: false,
        pName: 'Complete support training in Loop',
        pTag: {
          pContent: 'Additional price',
          pColor: 'amethyste',
        },
      },
    ],
  },
}

export const AllOffersShowcase: Story = {
  render: () => ({
    components: { POfferServicesCard },
    template: `
      <div style="width: 700px; padding: 24px; display: flex; flex-direction: column; gap: 16px;">
        <POfferServicesCard
          pLogo="brand-color"
          pTitle="RYDGE platform services"
          :pServices="[
            {
              pStatus: true,
              pDisabled: true,
              pName: 'GED Accounting',
              pTag: {
                pContent: 'Included',
                pColor: 'gray-900',
                pEffect: 'light',
              },
            },
          ]"
        />
        <POfferServicesCard
          pLogo="meg"
          pTitle="MEG partner's services"
          :pServices="[
            {
              pStatus: true,
              pDisabled: true,
              pName: 'Access to the Meg tool',
              pTag: {
                pContent: 'Included',
                pColor: 'gray-900',
                pEffect: 'light',
              },
            },
            {
              pStatus: true,
              pDisabled: false,
              pName: 'Cash register module',
            },
            {
              pStatus: true,
              pDisabled: false,
              pName: 'Billing module',
            },
            {
              pStatus: false,
              pDisabled: false,
              pName: 'Initiation training in Meg',
              pTag: {
                pContent: 'Additional price',
                pColor: 'amethyste',
                pEffect: 'light',
              },
            },
          ]"
        />
        <POfferServicesCard
          pLogo="loop-color"
          pTitle="LOOP partner's services"
          :pServices="[
            {
              pStatus: true,
              pDisabled: true,
              pName: 'Access to the Loop tool',
              pTag: {
                pContent: 'Included',
                pColor: 'gray-900',
                pEffect: 'light',
              },
            },
            {
              pStatus: false,
              pDisabled: false,
              pName: 'Complete support training in Loop',
              pTag: {
                pContent: 'Additional price',
                pColor: 'amethyste',
                pEffect: 'light',
              },
            },
          ]"
        />
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
  },
}
