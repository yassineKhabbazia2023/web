import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { computed, ref } from 'vue'
import dayjs from 'dayjs'
import PCalendar from './PCalendar.vue'
import { itemsGroupedByDate } from './PCalendar.mocks'

const meta: Meta<typeof PCalendar> = {
  title: 'Atoms/PCalendar',
  component: PCalendar as unknown as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Calendrier avec plage de dates et éléments groupés par date.',
      },
    },
  },
  argTypes: {
    pItemsGroupedByDate: { control: false, description: 'Éléments groupés par date' },
    pInitialDateRange: { control: false, description: 'Plage de dates initiale' },
  },
}

export default meta
export type Story = StoryObj<typeof meta>

export const Basic: Story = {
  render: () => ({
    components: { PCalendar },
    setup() {
      const activeDate = ref<Date>(new Date('2024-05-01'))
      const pInitialDateRange: [Date, Date] = [activeDate.value, new Date('2024-05-31')]
      const dateLabel = computed(() => dayjs(activeDate.value).format('DD/MM/YYYY'))
      const groups = itemsGroupedByDate
      return { activeDate, pInitialDateRange, dateLabel, groups }
    },
    template: `
      <div>
        <p style="margin-bottom: 12px;">Date sélectionnée : {{ dateLabel }}</p>
        <PCalendar
          v-model="activeDate"
          :pItemsGroupedByDate="groups"
          :pInitialDateRange="pInitialDateRange"
        />
      </div>
    `,
  }),
}
