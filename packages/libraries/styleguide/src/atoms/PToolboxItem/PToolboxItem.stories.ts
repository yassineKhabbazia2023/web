import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { reactive } from 'vue'
import PToolboxItem from './PToolboxItem.vue'

const meta: Meta<typeof PToolboxItem> = {
  title: 'Atoms/PToolboxItem',
  component: PToolboxItem as unknown as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Élément de barre d’outils avec icône optionnelle et états.',
      },
    },
  },
}

export default meta
export type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { PToolboxItem },
    setup() {
      const state = reactive({ pValue: 'Supprimer', pIconName: 'trash', pActionName: 'delete', disabled: false, pState: 'default' as const })
      return { state }
    },
    template: '<PToolboxItem :pValue="state.pValue" :pIconName="state.pIconName" :pState="state.pState" :disabled="state.disabled" />',
  }),
}

export const DangerWithIcon: Story = {
  render: () => ({
    components: { PToolboxItem },
    setup() {
      const state = reactive({ pValue: 'Supprimer', pIconName: 'add', pActionName: 'delete', disabled: false, pState: 'danger' as const })
      return { state }
    },
    template: '<PToolboxItem :pValue="state.pValue" :pIconName="state.pIconName" :pState="state.pState" :disabled="state.disabled" />',
  }),
}

export const WithoutIcon: Story = {
  render: () => ({
    components: { PToolboxItem },
    setup() {
      const state = reactive<{ pValue: string; pIconName?: undefined; disabled: boolean; pActionName: string }>({ pActionName: 'add', pValue: 'Bonjour', disabled: false })
      return { state }
    },
    template: '<PToolboxItem :pValue="state.pValue" :pIconName="state.pIconName" :disabled="state.disabled" />',
  }),
}
