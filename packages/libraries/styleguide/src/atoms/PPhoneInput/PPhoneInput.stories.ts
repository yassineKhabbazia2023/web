import { reactive, ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import type { FormInstance, FormRules } from 'element-plus'
import PPhoneInput from './PPhoneInput.vue'
import PForm from '../../molecules/PForm'
import PFormItem from '../../atoms/PFormItem'
import PButton from '../../atoms/PButton'
import { validationRules } from '../../utils/validators/validators'

const meta: Meta<typeof PPhoneInput> = {
  title: 'Atoms/PPhoneInput',
  component: PPhoneInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'PPhoneInput is a phone number input with international country code selector. It uses libphonenumber-js for parsing and outputs E.164 format.',
      },
    },
  },
  argTypes: {
    modelValue: {
      control: 'text',
      description: 'Phone number in E.164 format (e.g. +33612345678)',
    },
    pDefaultCountry: {
      control: 'text',
      description: 'Default country ISO code (e.g. FR, US, GB)',
    },
    pDisabled: {
      control: 'boolean',
      description: 'Disables both the country selector and the number input',
    },
    pPlaceholder: {
      control: 'text',
      description: 'Placeholder text for the number input',
    },
    pCountryDisabled: {
      control: 'boolean',
      description: 'Disables only the country selector (locks the country)',
    },
    pPreferredCountries: {
      control: 'object',
      description: 'Array of country codes to display at the top of the list',
    },
  },
  args: {
    modelValue: '',
    pDefaultCountry: 'FR',
    pDisabled: false,
    pCountryDisabled: false,
    pPlaceholder: 'Phone number',
    pPreferredCountries: [],
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PPhoneInput },
    setup() {
      const phoneNumber = ref(args.modelValue ?? '')
      return { args, phoneNumber }
    },
    template: `
      <div style="width: 400px">
        <PPhoneInput v-bind="args" v-model="phoneNumber" />
        <pre style="margin-top: 12px; padding: 8px; background: #f5f5f5; border-radius: 4px; font-size: 13px;">model: {{ phoneNumber }}</pre>
      </div>
    `,
  }),
}

export const WithPreferredCountries: Story = {
  args: {
    pPreferredCountries: ['FR', 'BE', 'CH', 'LU', 'MC'],
    pPlaceholder: 'Phone number',
  },
}

export const WithExistingNumber: Story = {
  args: {
    modelValue: '+33612345678',
  },
}

export const Disabled: Story = {
  args: {
    modelValue: '+33612345678',
    pDisabled: true,
  },
}

export const USDefaultCountry: Story = {
  args: {
    pDefaultCountry: 'US',
    pPlaceholder: 'Phone number',
  },
}

export const CountryLocked: Story = {
  render: (args) => ({
    components: { PPhoneInput },
    setup() {
      const phoneNumber = ref(args.modelValue ?? '')
      return { args, phoneNumber }
    },
    template: `
      <div style="width: 400px">
        <PPhoneInput v-bind="args" v-model="phoneNumber" />
        <pre style="margin-top: 12px; padding: 8px; background: #f5f5f5; border-radius: 4px; font-size: 13px;">model: {{ phoneNumber }}</pre>
      </div>
    `,
  }),
  args: {
    pDefaultCountry: 'FR',
    pCountryDisabled: true,
    pPlaceholder: 'Phone number',
  },
}

export const WithValidation: Story = {
  render: () => ({
    components: { PForm, PFormItem, PPhoneInput, PButton },
    setup() {
      const formRef = ref<FormInstance>()
      const formData = reactive({ phone: '' })

      const rules = reactive<FormRules>({
        phone: [
          validationRules.requiredSelect('Phone number is required'),
          validationRules.phoneNumber('Invalid phone number'),
        ],
      })

      const onSubmit = () => {
        formRef.value?.validate((isValid) => {
          console.log(isValid ? 'Valid' : 'Invalid', formData.phone)
        })
      }

      return { formRef, formData, rules, onSubmit }
    },
    template: `
      <div style="width: 400px">
        <PForm
          ref="formRef"
          :pModel="formData"
          :pRules="rules"
        >
          <PFormItem pLabel="Phone" pProp="phone" pRequired>
            <PPhoneInput
              v-model="formData.phone"
              pPlaceholder="Phone number"
              :pPreferredCountries="['FR', 'BE', 'CH']"
            />
          </PFormItem>
          <PFormItem>
            <PButton pType="primary" @click="onSubmit">
              Submit
            </PButton>
          </PFormItem>
        </PForm>
        <pre style="margin-top: 12px; padding: 8px; background: #f5f5f5; border-radius: 4px; font-size: 13px;">model: {{ formData.phone }}</pre>
      </div>
    `,
  }),
}
