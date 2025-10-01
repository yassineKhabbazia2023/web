import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { reactive } from 'vue'
import PFilterOption from './PFilterOption.vue'
import type { PFilterOptionProps } from './PFilterOptionTypes'

const meta: Meta<typeof PFilterOption> = {
  title: 'Atoms/PFilterOption',
  component: PFilterOption as unknown as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Option de filtre avec compteur, couleur et icône.',
      },
    },
  },
}

export default meta
export type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { PFilterOption },
    setup() {
      const props: PFilterOptionProps = reactive({
        pSelected: false,
        pDisabled: false,
        pContent: 'À déployer',
        pIconName: 'arrowUpCircle',
        pValue: 3,
        pColor: 'disabled',
      })
      const filterOptionColor: { label: string; value: PFilterOptionProps['pColor'] }[] = [
        { label: 'En cours', value: 'tranquil' },
        { label: 'Succès', value: 'success' },
        { label: 'Avertissement', value: 'warning' },
        { label: 'Erreur', value: 'danger' },
        { label: 'Gris Léger', value: 'light-gray' },
        { label: 'Gris', value: 'gray' },
      ]
      return { props, filterOptionColor }
    },
    template: `
      <div style="padding: 16px;">
        <PFilterOption
          v-model:pSelected="props.pSelected"
          :pDisabled="props.pDisabled"
          :pContent="props.pContent"
          :pColor="props.pColor"
          :pIconName="props.pIconName"
          :pValue="props.pValue"
        />
      </div>
    `,
  }),
}
