import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { setWith } from 'lodash-es'
import PFieldSet from './PFieldSet.vue'
import PForm from '../PForm'
import { getMockedFields } from './PFieldSet.mocks'
import { PFieldSetProps } from './PFieldSetTypes'

interface CustomModel {
  person: {
    firstname: string
    lastname?: string
  }
  contact: {
    email: string
    phone?: string
  }
  street?: string
  additional?: string
  zipCode?: string
  city?: string
  country?: string
  accountingYearStart?: string
  accountingYearDuration?: number
  accountingType?: string
  taxSystem?: string
  taxationRegime?: string
  activityType?: string[]
}

const meta: Meta<typeof PFieldSet> = {
  title: 'Molecules/PFieldSet',
  component: PFieldSet as any,
  parameters: {
    docs: {
      description: {
        component: 'A fieldset component that renders multiple fields based on a field configuration array. Supports various field types and automatic model binding.',
      },
    },
    layout: 'fullscreen',
  },
  argTypes: {
    pModel: {
      control: 'object',
      description: 'Data model object that contains field values',
      table: {
        type: { summary: 'T' },
      },
    },
    pFields: {
      control: 'object',
      description: 'Array of field configurations',
      table: {
        type: { summary: 'PFieldProps<any>[]' },
      },
    },
    pReadonly: {
      control: 'boolean',
      description: 'Make all fields readonly',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<PFieldSetProps<CustomModel>>

export const CompanyIdentification: Story = {
  render: (args) => ({
    components: { PFieldSet, PForm },
    setup() {
      const model = ref<CustomModel>({
        person: {
          firstname: 'John',
          lastname: 'Doe',
        },
        contact: {
          email: 'john.doe@example.com',
          phone: '0123456789',
        },
      })

      const fields = getMockedFields('companyIdentification')

      const onUpdatePModel = (fieldKey: string, fieldValue: any) => {
        setWith(model.value, fieldKey, fieldValue, Object)
      }

      return {
        args: { ...args, pModel: model.value, pFields: fields },
        model,
        onUpdatePModel,
      }
    },
    template: `
      <div style="padding: 20px;">
        <h2>Company Identification</h2>
        <PForm pLabelPosition="top">
          <PFieldSet
            v-bind="args"
            @update:p-model="onUpdatePModel"
          />
        </PForm>
        <div style="margin-top: 20px; padding: 16px; background: #f5f5f5; border-radius: 8px;">
          <h3>Model Data:</h3>
          <pre>{{ JSON.stringify(model, null, 2) }}</pre>
        </div>
      </div>
    `,
  }),
  args: {
    pReadonly: false,
  },
}

export const CompanyContact: Story = {
  render: (args) => ({
    components: { PFieldSet, PForm },
    setup() {
      const model = ref<CustomModel>({
        person: {
          firstname: 'Jane',
          lastname: 'Smith',
        },
        contact: {
          email: 'jane.smith@company.com',
          phone: '+33 1 23 45 67 89',
        },
      })

      const fields = getMockedFields('companyContact')

      const onUpdatePModel = (fieldKey: string, fieldValue: any) => {
        setWith(model.value, fieldKey, fieldValue, Object)
      }

      return {
        args: { ...args, pModel: model.value, pFields: fields },
        model,
        onUpdatePModel,
      }
    },
    template: `
      <div style="padding: 20px;">
        <h2>Company Contact Information</h2>
        <PForm pLabelPosition="top">
          <PFieldSet
            v-bind="args"
            @update:p-model="onUpdatePModel"
          />
        </PForm>
        <div style="margin-top: 20px; padding: 16px; background: #f5f5f5; border-radius: 8px;">
          <h3>Model Data:</h3>
          <pre>{{ JSON.stringify(model, null, 2) }}</pre>
        </div>
      </div>
    `,
  }),
  args: {
    pReadonly: false,
  },
}

export const CompanyAddress: Story = {
  render: (args) => ({
    components: { PFieldSet, PForm },
    setup() {
      const model = ref<CustomModel>({
        person: {
          firstname: 'John',
          lastname: 'Doe',
        },
        contact: {
          email: 'john.doe@example.com',
        },
        street: '123 Main Street',
        additional: 'Suite 100',
        zipCode: '75001',
        city: 'Paris',
        country: 'fr',
      })

      const fields = getMockedFields('companyAddress')

      const onUpdatePModel = (fieldKey: string, fieldValue: any) => {
        setWith(model.value, fieldKey, fieldValue, Object)
      }

      return {
        args: { ...args, pModel: model.value, pFields: fields },
        model,
        onUpdatePModel,
      }
    },
    template: `
      <div style="padding: 20px;">
        <h2>Company Address</h2>
        <PForm pLabelPosition="top">
          <PFieldSet
            v-bind="args"
            @update:p-model="onUpdatePModel"
          />
        </PForm>
        <div style="margin-top: 20px; padding: 16px; background: #f5f5f5; border-radius: 8px;">
          <h3>Model Data:</h3>
          <pre>{{ JSON.stringify(model, null, 2) }}</pre>
        </div>
      </div>
    `,
  }),
  args: {
    pReadonly: false,
  },
}

export const AccountingInformation: Story = {
  render: (args) => ({
    components: { PFieldSet, PForm },
    setup() {
      const model = ref<CustomModel>({
        person: {
          firstname: 'John',
          lastname: 'Doe',
        },
        contact: {
          email: 'john.doe@example.com',
        },
        accountingYearStart: '01/01/2023',
        accountingYearDuration: 12,
        accountingType: 'accrual',
        country: 'fr',
        taxSystem: 'bic',
        taxationRegime: 'is',
        activityType: ['services'],
      })

      const fields = getMockedFields('accountingAndTaxInformation')

      const onUpdatePModel = (fieldKey: string, fieldValue: any) => {
        setWith(model.value, fieldKey, fieldValue, Object)
      }

      return {
        args: { ...args, pModel: model.value, pFields: fields },
        model,
        onUpdatePModel,
      }
    },
    template: `
      <div style="padding: 20px;">
        <h2>Accounting and Tax Information</h2>
        <PForm pLabelPosition="top">
          <PFieldSet
            v-bind="args"
            @update:p-model="onUpdatePModel"
          />
        </PForm>
        <div style="margin-top: 20px; padding: 16px; background: #f5f5f5; border-radius: 8px;">
          <h3>Model Data:</h3>
          <pre>{{ JSON.stringify(model, null, 2) }}</pre>
        </div>
      </div>
    `,
  }),
  args: {
    pReadonly: false,
  },
}

export const ReadonlyMode: Story = {
  render: (args) => ({
    components: { PFieldSet, PForm },
    setup() {
      const model = ref<CustomModel>({
        person: {
          firstname: 'John',
          lastname: 'Doe',
        },
        contact: {
          email: 'john.doe@example.com',
          phone: '+33 1 23 45 67 89',
        },
      })

      const fields = getMockedFields('companyIdentification', true)

      const onUpdatePModel = (fieldKey: string, fieldValue: any) => {
        setWith(model.value, fieldKey, fieldValue, Object)
      }

      return {
        args: { ...args, pModel: model.value, pFields: fields },
        model,
        onUpdatePModel,
      }
    },
    template: `
      <div style="padding: 20px;">
        <h2>Readonly Mode</h2>
        <PForm pLabelPosition="top">
          <PFieldSet
            v-bind="args"
            @update:p-model="onUpdatePModel"
          />
        </PForm>
        <div style="margin-top: 20px; padding: 16px; background: #f5f5f5; border-radius: 8px;">
          <h3>Model Data:</h3>
          <pre>{{ JSON.stringify(model, null, 2) }}</pre>
          <p><em>Fields are readonly - values cannot be modified</em></p>
        </div>
      </div>
    `,
  }),
  args: {
    pReadonly: true,
  },
}

export const CompleteForm: Story = {
  render: (args) => ({
    components: { PFieldSet, PForm },
    setup() {
      const model = ref<CustomModel>({
        person: {
          firstname: 'Alice',
          lastname: 'Johnson',
        },
        contact: {
          email: 'alice.johnson@company.com',
          phone: '+33 1 23 45 67 89',
        },
        street: '456 Corporate Blvd',
        additional: 'Building A, Floor 3',
        zipCode: '75008',
        city: 'Paris',
        country: 'fr',
        accountingYearStart: '01/01/2023',
        accountingYearDuration: 12,
        accountingType: 'accrual',
        taxSystem: 'bic',
        taxationRegime: 'is',
        activityType: ['services', 'commerce'],
      })

      const sections = [
        { title: 'Company Identification', fields: getMockedFields('companyIdentification') },
        { title: 'Contact Information', fields: getMockedFields('companyContact') },
        { title: 'Address', fields: getMockedFields('companyAddress') },
        { title: 'Accounting & Tax', fields: getMockedFields('accountingAndTaxInformation') },
      ]

      const onUpdatePModel = (fieldKey: string, fieldValue: any) => {
        setWith(model.value, fieldKey, fieldValue, Object)
      }

      return {
        args,
        model,
        sections,
        onUpdatePModel,
      }
    },
    template: `
      <div style="padding: 20px;">
        <h2>Complete Company Form</h2>
        <PForm pLabelPosition="top">
          <div v-for="(section, index) in sections" :key="index" 
               style="margin-bottom: 32px; padding: 24px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h3 style="margin: 0 0 20px 0; color: #333;">{{ section.title }}</h3>
            <PFieldSet
              :pModel="model"
              :pFields="section.fields"
              :pReadonly="args.pReadonly"
              @update:p-model="onUpdatePModel"
            />
          </div>
        </PForm>
        <div style="margin-top: 32px; padding: 16px; background: #f5f5f5; border-radius: 8px;">
          <h3>Complete Model Data:</h3>
          <pre style="font-size: 12px; max-height: 300px; overflow-y: auto;">{{ JSON.stringify(model, null, 2) }}</pre>
        </div>
      </div>
    `,
  }),
  args: {
    pReadonly: false,
  },
}

export const EmptyFieldSet: Story = {
  render: (args) => ({
    components: { PFieldSet, PForm },
    setup() {
      const model = ref<CustomModel>({
        person: {
          firstname: '',
          lastname: '',
        },
        contact: {
          email: '',
        },
      })

      const fields: any[] = []

      const onUpdatePModel = (fieldKey: string, fieldValue: any) => {
        setWith(model.value, fieldKey, fieldValue, Object)
      }

      return {
        args: { ...args, pModel: model.value, pFields: fields },
        model,
        onUpdatePModel,
      }
    },
    template: `
      <div style="padding: 20px;">
        <h2>Empty FieldSet</h2>
        <PForm pLabelPosition="top">
          <PFieldSet
            v-bind="args"
            @update:p-model="onUpdatePModel"
          />
        </PForm>
        <p style="margin-top: 20px; color: #666;">
          <em>No fields configured - this shows the component behavior with an empty field array</em>
        </p>
      </div>
    `,
  }),
  args: {},
}
