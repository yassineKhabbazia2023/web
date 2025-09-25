import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { reactive } from 'vue'
import PField from './PField.vue'
import PForm from '../PForm'
import type {
  PFieldProps,
  PFieldPropsInput,
  PFieldPropsDropdown,
  PFieldPropsDate,
  PFieldPropsRadio,
  PFieldPropsEmailInput,
  PFieldPropsCheckbox,
} from './PFieldTypes'
import {
  getMockedInputField,
  getDropdownField,
  getDateField,
  getRadioField,
  getMockedEmailInputField,
  getMockedCheckbox,
} from './PField.mocks'
import type { PDropdownOption } from '../PDropdown/PDropdownTypes'

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
  },
  tags: ['autodocs'],
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
      const fieldProps = reactive<PFieldPropsInput<string>>(
        getMockedInputField('firstname', 'Prénom', 'John', 50),
      )

      return {
        fieldProps: { ...fieldProps, ...args },
      }
    },
    template: `
      <div style="padding: 20px;">
        <PForm pLabelPosition="top">
          <PField
            v-model="fieldProps.modelValue"
            v-bind="fieldProps"
          />
        </PForm>
        <div style="margin-top: 16px;">
          <strong>Value:</strong> {{ fieldProps.modelValue }}
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
  render: (args: any) => ({
    components: { PField, PForm },
    setup() {
      const fieldProps = reactive<PFieldPropsDropdown<number | undefined>>(
        getDropdownField('range', 'Tranche', 50, dropdownOptions),
      )

      return {
        fieldProps: { ...fieldProps, ...args },
      }
    },
    template: `
      <div style="padding: 20px;">
        <PForm pLabelPosition="top">
          <PField
            v-model="fieldProps.modelValue"
            v-bind="fieldProps"
          />
        </PForm>
        <div style="margin-top: 16px;">
          <strong>Value:</strong> {{ fieldProps.modelValue }}
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
      const fieldProps = reactive<any>({
        pFieldType: 'dropdown',
        pFieldKey: 'ranges',
        pLabel: 'Ranges',
        pPlaceholder: 'Select multiple ranges',
        pDropdownOptions: dropdownOptions,
        pMultiple: true,
        pCheckAllLabel: 'Select All',
        pDisabled: false,
        modelValue: undefined,
      })

      return {
        fieldProps: { ...fieldProps, ...args },
      }
    },
    template: `
      <div style="padding: 20px;">
        <PForm pLabelPosition="top">
          <PField
            v-model="fieldProps.modelValue"
            v-bind="fieldProps"
          />
        </PForm>
        <div style="margin-top: 16px;">
          <strong>Values:</strong> {{ fieldProps.modelValue }}
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
      const fieldProps = reactive<PFieldPropsDate<string>>(
        getDateField('creationDate', 'Date de création', '13/12/2014', 50),
      )

      return {
        fieldProps: { ...fieldProps, ...args },
      }
    },
    template: `
      <div style="padding: 20px;">
        <PForm pLabelPosition="top">
          <PField
            v-model="fieldProps.modelValue"
            v-bind="fieldProps"
          />
        </PForm>
        <div style="margin-top: 16px;">
          <strong>Value:</strong> {{ fieldProps.modelValue }}
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
      const fieldProps = reactive<PFieldPropsRadio<string | string[]>>(
        getRadioField({
          pFieldKey: 'type',
          pLabel: 'Type',
          flexBasis: 50,
        }),
      )

      return {
        fieldProps: { ...fieldProps, ...args },
      }
    },
    template: `
      <div style="padding: 20px;">
        <PForm pLabelPosition="top">
          <PField
            v-model="fieldProps.modelValue"
            v-bind="fieldProps"
          />
        </PForm>
        <div style="margin-top: 16px;">
          <strong>Value:</strong> {{ fieldProps.modelValue }}
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
      const fieldProps = reactive<PFieldPropsEmailInput<string>>(
        getMockedEmailInputField(
          'email',
          'company.com',
          'Enter local part',
          'Enter domain',
          false,
          false,
          50,
        ),
      )

      return {
        fieldProps: { ...fieldProps, ...args },
      }
    },
    template: `
      <div style="padding: 20px;">
        <PForm pLabelPosition="top">
          <PField
            v-model="fieldProps.modelValue"
            v-bind="fieldProps"
          />
        </PForm>
        <div style="margin-top: 16px;">
          <strong>Value:</strong> {{ fieldProps.modelValue }}
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
      const fieldProps = reactive<PFieldPropsCheckbox<boolean>>(
        getMockedCheckbox('terms', 'I accept the terms and conditions', false, false, 50),
      )

      return {
        fieldProps: { ...fieldProps, ...args },
      }
    },
    template: `
      <div style="padding: 20px;">
        <PForm pLabelPosition="top">
          <CheckboxField 
            v-model="fieldProps.modelValue"
            v-bind="fieldProps"
          />
        </PForm>
        <div style="margin-top: 16px;">
          <strong>Value:</strong> {{ fieldProps.modelValue }}
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
  render: () => ({
    components: { PField, PForm },
    setup() {
      const emailField = reactive<PFieldPropsInput<string>>(
        getMockedInputField('email', 'Email', 'Enter email', 50, false, ['email']),
      )
      const phoneField = reactive<PFieldPropsInput<string>>(
        getMockedInputField('phone', 'Phone', 'Enter phone', 50, false, ['phone']),
      )

      return {
        emailField,
        phoneField,
      }
    },
    template: `
      <div style="padding: 20px;">
        <h3>Fields with Validation</h3>
        <PForm pLabelPosition="top">
          <div style="display: grid; gap: 20px;">
            <PField v-bind="emailField" />
            <PField v-bind="phoneField" />
          </div>
        </PForm>
        <div style="margin-top: 16px;">
          <p><strong>Email value:</strong> {{ emailField.modelValue }}</p>
          <p><strong>Phone value:</strong> {{ phoneField.modelValue }}</p>
          <p><em>Try entering invalid values to see validation</em></p>
        </div>
      </div>
    `,
  }),
  args: {},
}

export const AllFieldTypes: Story = {
  render: () => ({
    components: {
      PField,
      PForm,
    },
    setup() {
      const stringField = reactive(getMockedInputField('text', 'Text Input', 'Enter text', 50))
      const dropdownField = reactive(getDropdownField('dropdown', 'Dropdown', 50, dropdownOptions))
      const dateField = reactive(getDateField('date', 'Date Picker', 'Select date', 50))
      const radioField = reactive(getRadioField({ pFieldKey: 'radio', pLabel: 'Radio Buttons', flexBasis: 50 }))
      const emailField = reactive(getMockedEmailInputField('email', 'company.com', 'username', 'domain', false, false, 50))
      const checkboxField = reactive(getMockedCheckbox('checkbox', 'Checkbox Option', false, false, 50))

      return {
        stringField,
        dropdownField,
        dateField,
        radioField,
        emailField,
        checkboxField,
      }
    },
    template: `
      <div style="padding: 20px;">
        <h3>All Field Types</h3>
        <PForm pLabelPosition="top">
          <div style="display: grid; gap: 20px; max-width: 500px;">
            <PField v-bind="stringField" />
            <PField v-bind="dropdownField" />
            <PField v-bind="dateField" />
            <PField v-bind="radioField" />
            <PField v-bind="emailField" />
            <PField v-bind="checkboxField" />
          </div>
        </PForm>
      </div>
    `,
  }),
  args: {},
}
