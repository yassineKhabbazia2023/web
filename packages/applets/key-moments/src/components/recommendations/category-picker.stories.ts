import CategoryPicker from './category-picker.vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

const meta: Meta<typeof CategoryPicker> = {
  title: 'Applets/KeyMoments/Recommendations/CategoryPicker',
  component: CategoryPicker,
  parameters: {
    layout: 'padded',
  },
  tags: ['!autodocs'],
  args: {
    categories: [
      { id: 1, label: 'BTP & Construction', pitch: 'Chantiers, sous-traitance, travaux en cours et autoliquidation de TVA.' },
      { id: 2, label: 'Commerce & Distribution', pitch: 'Stocks, saisonnalité, encaissements et marges par rayon.' },
      { id: 3, label: 'Services & Conseil', pitch: 'Facturation au temps passé, sous-traitance et trésorerie.' },
      { id: 4, label: 'Professions libérales', pitch: 'Rémunération, protection sociale et prévoyance du dirigeant.' },
    ],
    isChanging: false,
  },
}

export default meta
type Story = StoryObj<typeof meta>

/** The very first choice: nothing exists yet, nothing to cancel. */
export const FirstChoice: Story = {}

/** A category already generated: the choice screen offers to come back to it. */
export const Changing: Story = {
  args: { isChanging: true },
}

export const NoCategory: Story = {
  args: { categories: [] },
}
