import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { reactive } from 'vue'
import PRadioCard from './PRadioCard.vue'
import PForm from '../../molecules/PForm/PForm.vue'
import PButton from '../PButton/PButton.vue'
import PIcon from '../PIcon/PIcon.vue'
import { ElRadioGroup as PRadioGroup } from 'element-plus'

const meta: Meta<typeof PRadioCard> = {
  title: 'Atoms/PRadioCard',
  component: PRadioCard as unknown as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Carte radio pour sélectionner une option avec titre et description.',
      },
    },
  },
}

export default meta
export type Story = StoryObj<typeof meta>

export const Basic: Story = {
  render: () => ({
    components: { PForm, PRadioGroup, PRadioCard, PButton, PIcon },
    setup() {
      const formValues = reactive<{ radioValue?: string }>({ radioValue: undefined })
      const pRadioCard1 = reactive({
        label: 'value1',
        title: 'Direction et administration générale',
        description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.',
      })
      const pRadioCard2 = reactive({ label: 'value2', title: 'Direction et administration générale' })
      const submit = () => {
        // eslint-disable-next-line no-console
        console.log('submit', formValues.radioValue)
      }
      return { formValues, pRadioCard1, pRadioCard2, submit }
    },
    template: `
      <PForm :pModel="formValues" @submit.prevent="submit">
        <PRadioCard :pLabel="pRadioCard1.label" :pTitle="pRadioCard1.title" :pDescription="pRadioCard1.description">
          <PButton pType="white">
            Personnaliser
            <PIcon class="el-button__icon--right" pName="arrowRight" />
          </PButton>
        </PRadioCard>
        <br />
        <PRadioCard :pLabel="pRadioCard2.label" :pTitle="pRadioCard2.title" />
        <br />
        <PButton pType="primary" class="margin-top--4" @click="submit">Soumettre</PButton>
      </PForm>
    `,
  }),
}
