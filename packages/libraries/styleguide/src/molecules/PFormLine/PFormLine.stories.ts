import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { reactive } from 'vue'
import PFormLine from './PFormLine.vue'
import PForm from '../PForm'
import PFormItem from '../../atoms/PFormItem'
import PInput from '../../atoms/PInput'
import PDropdown from '../PDropdown'
import { getMockedDropdownOptions } from '../PDropdown/PDropdown.mocks'

const meta: Meta<typeof PFormLine> = {
  title: 'Molecules/PFormLine',
  component: PFormLine,
  parameters: {
    docs: {
      description: {
        component: 'A horizontal layout wrapper that arranges multiple PFormItem children in a single wrapping flex row.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof PFormLine>

const dropdownOptions = getMockedDropdownOptions(false)

export const Basic: Story = {
  render: () => ({
    components: { PForm, PFormLine, PFormItem, PInput, PDropdown },
    setup() {
      const formValues = reactive({
        owner: '',
        firstName: '',
        lastName: '',
      })

      return {
        formValues,
        dropdownOptions,
      }
    },
    template: `
      <div style="padding: 20px;">
        <PForm :pModel="formValues" style="max-width: 720px;">
          <PFormLine>
            <PFormItem pLabel="Owner" pProp="owner">
              <PDropdown
                v-model="formValues.owner"
                :pOptions="dropdownOptions"
                pPlaceholder="Select an owner"
                style="width: 200px;"
              />
            </PFormItem>
            <PFormItem pLabel="First name" pProp="firstName">
              <PInput v-model="formValues.firstName" pPlaceholder="First name" />
            </PFormItem>
            <PFormItem pLabel="Last name" pProp="lastName">
              <PInput v-model="formValues.lastName" pPlaceholder="Last name" />
            </PFormItem>
          </PFormLine>
        </PForm>
      </div>
    `,
  }),
}

export const WithFixedSize: Story = {
  render: () => ({
    components: { PForm, PFormLine, PFormItem, PInput, PDropdown },
    setup() {
      const formValues = reactive({
        owner: '',
        firstName: '',
        lastName: '',
      })

      return {
        formValues,
        dropdownOptions,
      }
    },
    template: `
      <div style="padding: 20px;">
        <PForm :pModel="formValues" style="max-width: 720px;">
          <PFormLine>
            <PFormItem pLabel="Owner" pProp="owner" pWidth="300px">
              <PDropdown
                v-model="formValues.owner"
                :pOptions="dropdownOptions"
                pPlaceholder="Select an owner"
              />
            </PFormItem>
            <PFormItem pLabel="First name" pProp="firstName">
              <PInput v-model="formValues.firstName" pPlaceholder="First name" />
            </PFormItem>
            <PFormItem pLabel="Last name" pProp="lastName" :pWidth="500">
              <PInput v-model="formValues.lastName" pPlaceholder="Last name" />
            </PFormItem>
          </PFormLine>
        </PForm>
      </div>
    `,
  }),
}

export const InlineForm: Story = {
  render: () => ({
    components: { PForm, PFormLine, PFormItem, PInput, PDropdown },
    setup() {
      const formValues = reactive({
        owner: '',
        firstName: '',
        lastName: '',
      })

      return {
        formValues,
        dropdownOptions,
      }
    },
    template: `
      <div style="padding: 20px;">
        <PForm :pModel="formValues" pInline style="max-width: 720px;">
          <PFormLine>
            <PFormItem pLabel="Owner" pProp="owner">
              <PDropdown
                v-model="formValues.owner"
                :pOptions="dropdownOptions"
                pPlaceholder="Select an owner"
                style="width: 200px;"
              />
            </PFormItem>
            <PFormItem pLabel="First name" pProp="firstName">
              <PInput v-model="formValues.firstName" pPlaceholder="First name" />
            </PFormItem>
            <PFormItem pLabel="Last name" pProp="lastName">
              <PInput v-model="formValues.lastName" pPlaceholder="Last name" />
            </PFormItem>
          </PFormLine>
        </PForm>
      </div>
    `,
  }),
}
