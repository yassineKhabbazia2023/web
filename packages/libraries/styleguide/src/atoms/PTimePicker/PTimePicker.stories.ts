import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import PTimePicker from './PTimePicker.vue'

const meta: Meta<typeof PTimePicker> = {
  title: 'Atoms/PTimePicker',
  component: PTimePicker as unknown as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: "Sélecteur d'heure avec plages et désactivation par créneau.",
      },
    },
  },
}

export default meta
export type Story = StoryObj<typeof meta>

export const Arbitrary: Story = {
  render: () => ({
    components: { PTimePicker },
    setup() {
      const value1 = ref<any>()
      const value2 = ref<any>()
      return { value1, value2 }
    },
    template: `
      <div class="example-basic">
        <PTimePicker v-model="value1" pPlaceholder="Heure arbitraire" />
        <PTimePicker v-model="value2" pPlaceholder="Heure arbitraire" />
      </div>
    `,
  }),
}

export const LimitedRange: Story = {
  render: () => ({
    components: { PTimePicker },
    setup() {
      const limit = ref<Date | undefined>(new Date(2016, 9, 10, 18, 30))
      const makeRange = (start: number, end: number) => Array.from({ length: end - start + 1 }, (_, i) => i + start)
      const disabledHours = () => makeRange(0, 16).concat(makeRange(19, 23))
      const disabledMinutes = (hour: number) => (hour === 17 ? makeRange(0, 29) : hour === 18 ? makeRange(31, 59) : [])
      const disabledSeconds = (hour: number, minute: number) => (hour === 18 && minute === 30 ? makeRange(1, 59) : [])
      return { limit, disabledHours, disabledMinutes, disabledSeconds }
    },
    template: `
      <div class="demo-range">
        <PTimePicker v-model="limit" :pDisabledHours="disabledHours" :pDisabledMinutes="disabledMinutes" :pDisabledSeconds="disabledSeconds" pPlaceholder="Heure arbitraire" />
      </div>
    `,
  }),
}

export const Range: Story = {
  render: () => ({
    components: { PTimePicker },
    setup() {
      const value1Range = ref<[Date, Date]>([new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)])
      return { value1Range }
    },
    template: `
      <div class="demo-range">
        <PTimePicker v-model="value1Range" pIsRange pRangeSeparator="à" pStartPlaceholder="Début" pEndPlaceholder="Fin" />
      </div>
    `,
  }),
}
