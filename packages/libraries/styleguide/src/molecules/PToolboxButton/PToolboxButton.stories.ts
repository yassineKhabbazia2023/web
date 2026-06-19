import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PToolboxButton from './PToolboxButton.vue'
import PPastille from '../../atoms/PPastille'
import PIcon from '../../atoms/PIcon'
import type { PToolboxItemProps } from '../../atoms/PToolboxItem/PToolboxItemTypes'

const sampleElements: PToolboxItemProps[] = [
  { pValue: 'Déléguer mon portefeuille', pIconName: 'inbox', pActionName: 'delegate' },
  { pValue: 'Voir mes délégations permanentes', pIconName: 'person', pActionName: 'permanent' },
  { pValue: 'Demander une délégation', pIconName: 'arrowLeftRight', pActionName: 'request' },
  { pValue: 'Créer un compte de test', pIconName: 'fileText', pActionName: 'createTestAccount' },
]

const meta: Meta<typeof PToolboxButton> = {
  title: 'Molecules/PToolboxButton',
  component: PToolboxButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A toolbox dropdown driven by a button trigger. The default slot owns the button content; a chevron is always appended after the slot.',
      },
    },
  },
  argTypes: {
    pElements: { control: 'object', description: 'Toolbox menu items' },
    pType: {
      control: 'select',
      options: ['active', 'primary', 'secondary', 'tertiary', 'white', 'danger', 'default'],
      description: 'Button type',
    },
    pSize: { control: 'select', options: ['default', 'small'], description: 'Button size' },
    pTrigger: { control: 'select', options: ['click', 'hover'], description: 'Dropdown trigger' },
    pPlacement: {
      control: 'select',
      options: ['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end'],
      description: 'Dropdown placement',
    },
    pDisabled: { control: 'boolean', description: 'Disables the button' },
  },
  args: {
    pElements: sampleElements,
    pType: 'active',
    pSize: 'default',
    pTrigger: 'click',
    pPlacement: 'bottom-end',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PToolboxButton },
    setup() {
      return { args }
    },
    template: `
      <PToolboxButton v-bind="args">
        <span>Gérer mon portefeuille</span>
      </PToolboxButton>
    `,
  }),
}

export const WithLeftIcon: Story = {
  render: (args) => ({
    components: { PToolboxButton, PIcon },
    setup() {
      return { args }
    },
    template: `
      <PToolboxButton v-bind="args">
        <PIcon pName="inbox" class="margin-right--2" />
        <span>Déléguer mon portefeuille</span>
      </PToolboxButton>
    `,
  }),
}

export const WithTwoIcons: Story = {
  render: (args) => ({
    components: { PToolboxButton, PIcon },
    setup() {
      return { args }
    },
    template: `
      <PToolboxButton v-bind="args">
        <PIcon pName="person" class="margin-right--2" />
        <span>Voir mes délégations</span>
        <PIcon pName="patchCheck" class="margin-left--2" />
      </PToolboxButton>
    `,
  }),
}

export const WithBadge: Story = {
  render: (args) => ({
    components: { PToolboxButton, PPastille },
    setup() {
      return { args }
    },
    template: `
      <PToolboxButton v-bind="args">
        <span>Gérer ces dossiers</span>
        <PPastille pType="default" pSize="small" class="margin-left--3">2</PPastille>
      </PToolboxButton>
    `,
  }),
}

export const Secondary: Story = {
  args: {
    pType: 'secondary',
  },
  render: (args) => ({
    components: { PToolboxButton },
    setup() {
      return { args }
    },
    template: `
      <PToolboxButton v-bind="args">
        <span>Gérer mon portefeuille</span>
      </PToolboxButton>
    `,
  }),
}
