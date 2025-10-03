import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { reactive, ref } from 'vue'
import PField from './PField.vue'
import PForm from '../PForm'
import type {
  PFieldProps,
  PFieldPropsInput,
  PFieldPropsDropdown,
  PFieldPropsDate,
  PFieldPropsRadio,
} from './PFieldTypes'
import {
  getMockedInputField,
  getDropdownField,
  getDateField,
  getRadioField,
} from './PField.mocks'
import type { PDropdownOption } from '../PDropdown/PDropdownTypes'
import { pulseGeneratedIcons } from '../../atoms/PIcon/components/constants'

const meta: Meta<typeof PField> = {
  title: 'Molecules/PField',
  component: PField as any,
  parameters: {
    docs: {
      description: {
        component: 'A versatile field component that can render different input types including text inputs, dropdowns, date pickers, radio buttons, and more.',
      },
    },
  },
  argTypes: {
    modelValue: {
      control: 'text',
      description: 'Current field value',
      table: {
        type: { summary: 'T' },
      },
    },
    pFieldType: {
      control: 'select',
      options: ['input', 'dropdown', 'date', 'radio', 'email-input', 'checkbox'],
      description: 'Type of field to render',
      table: {
        type: { summary: "'input' | 'dropdown' | 'date' | 'radio' | 'email-input' | 'checkbox'" },
      },
    },
    pFieldKey: {
      control: 'text',
      description: 'Unique key for the field',
      table: {
        type: { summary: 'string' },
      },
    },
    pLabel: {
      control: 'text',
      description: 'Field label',
      table: {
        type: { summary: 'string' },
      },
    },
    pPlaceholder: {
      control: 'text',
      description: 'Placeholder text',
      table: {
        type: { summary: 'string' },
      },
    },
    pReadonly: {
      control: 'boolean',
      description: 'Make field readonly',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    pDisabled: {
      control: 'boolean',
      description: 'Disable the field',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    pSuffixIconName: {
      control: 'select',
      options: [undefined, ...pulseGeneratedIcons.map(icon => icon.name)],
      description: 'Nom de l\'icône en suffix du champ (facultatif)',
    },
  },
  tags: ['autodocs'],
  args: {
    pFieldType: 'input',
    pFieldKey: '',
    pLabel: '',
    pPlaceholder: '',
    pReadonly: false,
    pDisabled: false,
    pCssClass: '',
  },
}

export default meta
type Story = StoryObj<PFieldProps<any>>

const dropdownOptions: PDropdownOption[] = [
  {
    pValue: 1,
    pLabel: '1 à 9',
  },
  {
    pValue: 10,
    pLabel: '10 à 49',
  },
  {
    pValue: 50,
    pLabel: '50 et plus',
  },
]

export const StringInput: Story = {
  render: (args: any) => ({
    components: { PField, PForm },
    setup() {
      const value = ref('')
      return {
        args,
        value,
      }
    },
    template: `
      <div style="padding: 20px;">
        <PForm pLabelPosition="top">
          <PField
            v-model="value" 
            v-bind="args"
          />
        </PForm>
        <div style="margin-top: 16px;">
          <strong>Value:</strong> {{ value }}
        </div>
      </div>
    `,
  }),
  args: {
    pFieldType: 'input',
    pFieldKey: 'firstname',
    pLabel: 'First Name',
    pPlaceholder: 'Enter your first name',
    pDisabled: false,
  },
}

export const NumberDropdown: Story = {
  render: (args) => ({
    components: { PField, PForm },
    setup() {
      const value = ref('')
      return {
        args: { ...args },
        value,
      }
    },
    template: `
      <div style="padding: 20px;">
        <PForm pLabelPosition="top">
          <PField
            v-model="value"
            v-bind="args"
          />
        </PForm>
        <div style="margin-top: 16px;">
          <strong>Value:</strong> {{ value }}
        </div>
      </div>
    `,
  }),
  args: {
    pFieldType: 'dropdown',
    pFieldKey: 'range',
    pLabel: 'Range',
    pPlaceholder: 'Select a range',
    pDropdownOptions: dropdownOptions,
    pDisabled: false,
  },
}

export const MultipleDropdown: Story = {
  render: (args: any) => ({
    components: { PField, PForm },
    setup() {
      const value = ref('')
      return {
        args: { ...args },
        value,
      }
    },
    template: `
      <div style="padding: 20px;">
        <PForm pLabelPosition="top">
          <PField
            v-model="value"
            v-bind="args"
          />
        </PForm>
        <div style="margin-top: 16px;">
          <strong>Values:</strong> {{ value }}
        </div>
      </div>
    `,
  }),
  args: {
    pFieldType: 'dropdown',
    pFieldKey: 'ranges',
    pLabel: 'Ranges',
    pPlaceholder: 'Select multiple ranges',
    pDropdownOptions: dropdownOptions,
    pMultiple: true,
    pCheckAllLabel: 'Select All',
    pDisabled: false,
  },
}

export const DatePicker: Story = {
  render: (args: any) => ({
    components: { PField, PForm },
    setup() {
      const value = ref('')
      return {
        args: { ...args },
        value,
      }
    },
    template: `
      <div style="padding: 20px;">
        <PForm pLabelPosition="top">
          <PField
            v-model="value"
            v-bind="args"
          />
        </PForm>
        <div style="margin-top: 16px;">
          <strong>Value:</strong> {{ value }}
        </div>
      </div>
    `,
  }),
  args: {
    pFieldType: 'date',
    pFieldKey: 'creationDate',
    pLabel: 'Creation Date',
    pPlaceholder: 'Select date',
    pFormat: 'DD/MM/YYYY',
    pDisabled: false,
  },
}

export const RadioButtons: Story = {
  render: (args: any) => ({
    components: { PField, PForm },
    setup() {
      const value = ref('')
      return {
        args: { ...args },
        value,
      }
    },
    template: `
      <div style="padding: 20px;">
        <PForm pLabelPosition="top">
          <PField
            v-model="value"
            v-bind="args"
          />
        </PForm>
        <div style="margin-top: 16px;">
          <strong>Value:</strong> {{ value }}
        </div>
      </div>
    `,
  }),
  args: {
    pFieldType: 'radio',
    pFieldKey: 'type',
    pLabel: 'Type',
    pOptions: [
      { pValue: 'a', pLabel: 'Option A' },
      { pValue: 'b', pLabel: 'Option B' },
    ],
    pFlexColumn: false,
    pBorder: false,
    pDisabled: false,
  },
}

export const EmailInput: Story = {
  render: (args: any) => ({
    components: { PField, PForm },
    setup() {
      const value = ref('')
      return {
        args: { ...args },
        value,
      }
    },
    template: `
      <div style="padding: 20px;">
        <PForm pLabelPosition="top">
          <PField
            v-model="value"
            v-bind="args"
          />
        </PForm>
        <div style="margin-top: 16px;">
          <strong>Value:</strong> {{ value }}
        </div>
      </div>
    `,
  }),
  args: {
    pFieldType: 'email-input',
    pFieldKey: 'email',
    pLabel: 'Email Address',
    pDefaultDomainPart: 'company.com',
    pLocalPartPlaceholder: 'username',
    pDomainPartPlaceholder: 'domain.com',
    pLocalPartDisabled: false,
    pDomainPartDisabled: false,
    pDisabled: false,
  },
}

export const CheckboxField: Story = {
  render: (args: any) => ({
    components: { PField, PForm },
    setup() {
      const value = ref('')

      return {
        args,
        value,
      }
    },
    template: `
      <div style="padding: 20px;">
        <PForm pLabelPosition="top">
          <PField 
            v-model="value"
            v-bind="args"
          />
        </PForm>
        <div style="margin-top: 16px;">
          <strong>Value:</strong> {{ value }}
        </div>
      </div>
    `,
  }),
  args: {
    pFieldType: 'checkbox',
    pFieldKey: 'terms',
    pLabel: 'Terms and Conditions',
    pChecked: false,
    pRounded: false,
    pDisabled: false,
  },
}

export const DisabledStates: Story = {
  render: () => ({
    components: { PField, PForm },
    setup() {
      const stringField = reactive<PFieldPropsInput<string>>(
        getMockedInputField('firstname', 'First Name', 'John', 50, true),
      )
      const dropdownField = reactive<PFieldPropsDropdown<number | undefined>>(
        getDropdownField('range', 'Range', 50, dropdownOptions, true),
      )
      const dateField = reactive<PFieldPropsDate<string>>(
        getDateField('date', 'Date', 'Select date', 50, 'DD/MM/YYYY', 'YYYY-MM-DD', true),
      )
      const radioField = reactive<PFieldPropsRadio<string | string[]>>(
        getRadioField({
          pFieldKey: 'type',
          pLabel: 'Type',
          flexBasis: 50,
          pDisabled: true,
        }),
      )

      return {
        stringField,
        dropdownField,
        dateField,
        radioField,
      }
    },
    template: `
      <div style="padding: 20px;">
        <h3>Disabled Field States</h3>
        <PForm pLabelPosition="top">
          <div style="display: grid; gap: 20px;">
            <PField v-bind="stringField" />
            <PField v-bind="dropdownField" />
            <PField v-bind="dateField" />
            <PField v-bind="radioField" />
          </div>
        </PForm>
      </div>
    `,
  }),
  args: {},
}

export const WithValidation: Story = {
  render: (args) => ({
    components: { PField, PForm },
    setup() {
      const valueMail = ref('')
      const valuePhone = ref('')
      return {
        args,
        valueMail,
        valuePhone,
      }
    },
    template: `
      <div style="padding: 20px;">
        <h3>Fields with Validation</h3>
        <PForm pLabelPosition="top">
          <div style="display: grid; gap: 20px;">
            <PField
              v-model="valueMail"
              v-bind="args"
              pFieldKey="email"
              pLabel="Email"
              pPlaceholder="Enter email"
              required
            />
            <PField
              v-model="valuePhone"
              v-bind="args"
              pFieldKey="phone"
              pLabel="Phone"
              pPlaceholder="Enter phone"
              required
            />
          </div>
        </PForm>
        <div style="margin-top: 16px;">
          <p><strong>Email value:</strong> {{ valueMail }}</p>
          <p><strong>Phone value:</strong> {{ valuePhone }}</p>
          <p><em>Try entering invalid values to see validation</em></p>
        </div>
      </div>
    `,
  }),
  args: {},
}

export const AllFieldTypes: Story = {
  render: (args) => ({
    components: {
      PField,
      PForm,
    },
    setup() {
      const value = ref('')
      const valueDropdown = ref('')
      const valueDate = ref('')
      const valueMail = ref('')
      const valueRadio = ref('')
      const valueCheckbox = ref('')

      return {
        args,
        value,
        valueDropdown,
        valueRadio,
        valueDate,
        valueMail,
        valueCheckbox,
        dropdownOptions,
      }
    },
    template: `
      <div style="padding: 20px;">
        <h3>All Field Types</h3>
        <PForm pLabelPosition="top">
          <div style="display: grid; gap: 20px; max-width: 500px;">
            <PField 
              v-model="value"
              v-bind="args"
              pFieldKey="text"
              pLabel="Text Input"
              pPlaceholder="Enter text" />
            <PField 
              v-model="valueDropdown"
              v-bind="args"
              pFieldType="dropdown"
              pFieldKey="dropdown"
              pLabel="Dropdown"
              :pDropdownOptions="dropdownOptions"
            />
            <PField 
              v-model="valueDate"
              v-bind="args"
              pFieldType="date"
              pFieldKey="date"
              pLabel="Date Picker"
              pPlaceholder="Select Date" />
            <PField 
              v-model="valueRadio"
              v-bind="args"
              pFieldType="radio"
              pFieldKey="radio"
              pLabel="Radio Button"
              :pOptions="[
                { pValue: 'a', pLabel: 'Option A' },
                { pValue: 'b', pLabel: 'Option B' },
              ]"
            />
            <PField 
              v-model="valueMail"
              v-bind="args"
              pFieldType="email-input"
              pFieldKey="email"
              pLabel="Email Address"
              pDefaultDomainPart="company.com"
              pLocalPartPlaceholder="username"
              pDomainPartPlaceholder="domain.com"
            />
            <PField 
              v-model="valueCheckbox"
              v-bind="args"
              pFieldType="checkbox"
              pFieldKey="checkbox"
              pLabel="Checkbox Options" />
          </div>
        </PForm>
      </div>
    `,
  }),
  args: {},
}
