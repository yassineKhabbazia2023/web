import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { computed, reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import PForm from './PForm.vue'
import PFormItem from '../../atoms/PFormItem'
import PButton from '../../atoms/PButton'
import PInput from '../../atoms/PInput'
import PCheckbox from '../../atoms/PCheckbox'
import { PFormProps } from './PFormTypes'

const meta: Meta<typeof PForm> = {
  title: 'Molecules/PForm',
  component: PForm,
  parameters: {
    docs: {
      description: {
        component: 'A form component with validation capabilities based on Element Plus Form component with custom styling.',
      },
    },
  },
  argTypes: {
    pModel: {
      control: 'object',
      description: 'Form data model',
      table: {
        type: { summary: 'Record<string, any>' },
      },
    },
    pRules: {
      control: 'object',
      description: 'Validation rules',
      table: {
        type: { summary: 'FormRules' },
      },
    },
    pInline: {
      control: 'boolean',
      description: 'Whether the form is inline',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    pLabelPosition: {
      control: 'select',
      options: ['left', 'right', 'top'],
      description: 'Position of form labels',
      table: {
        type: { summary: "'left' | 'right' | 'top'" },
        defaultValue: { summary: 'top' },
      },
    },
    pLabelWidth: {
      control: 'text',
      description: 'Width of form labels',
      table: {
        type: { summary: 'string | number' },
      },
    },
    pLabelSuffix: {
      control: 'text',
      description: 'Suffix for form labels',
      table: {
        type: { summary: 'string' },
      },
    },
    pHideRequiredAsterisk: {
      control: 'boolean',
      description: 'Whether to hide required asterisks',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    pRequireAsteriskPosition: {
      control: 'select',
      options: ['left', 'right'],
      description: 'Position of required asterisk',
      table: {
        type: { summary: "'left' | 'right'" },
        defaultValue: { summary: 'left' },
      },
    },
    pShowMessage: {
      control: 'boolean',
      description: 'Whether to show validation messages',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    pInlineMessage: {
      control: 'boolean',
      description: 'Whether to show validation messages inline',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    pStatusIcon: {
      control: 'boolean',
      description: 'Whether to show validation status icons',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    pValidateOnRuleChange: {
      control: 'boolean',
      description: 'Whether to validate when rules change',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    pSize: {
      control: 'select',
      options: ['', 'large', 'default', 'small'],
      description: 'Size of form elements',
      table: {
        type: { summary: "'' | 'large' | 'default' | 'small'" },
      },
    },
    pDisabled: {
      control: 'boolean',
      description: 'Whether to disable the entire form',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    pScrollToError: {
      control: 'boolean',
      description: 'Whether to scroll to first error field',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<PFormProps>

export const Basic: Story = {
  render: (args) => ({
    components: { PForm, PFormItem, PButton, PInput },
    setup() {
      const formRef = ref<FormInstance>()
      const formValues = reactive({
        pass: '',
        checkPass: '',
        age: '',
      })

      const formValidity = reactive({
        pass: false,
        checkPass: false,
        age: false,
      })

      const isFormValid = computed(() =>
        formValidity.pass && formValidity.checkPass && formValidity.age,
      )

      const validateHandler = (propName: string, isValid: boolean) => {
        ;(formValidity as any)[propName] = isValid
      }

      const validateAge = (_rule: any, value: any, callback: any) => {
        if (!value) {
          return callback(new Error('Please enter the age'))
        }

        const numberValue = Number(value)
        setTimeout(() => {
          if (!Number.isInteger(numberValue)) {
            callback(new Error('Please enter digits'))
          } else {
            if (numberValue < 18) {
              callback(new Error('Age must be greater or equal to 18'))
            } else {
              callback()
            }
          }
        }, 1000)
      }

      const validateCheckConfirmPass = (_rule: any, value: any, callback: any) => {
        if (value === '') {
          callback(new Error('Please enter the password again'))
        } else if (value !== formValues.pass) {
          callback(new Error("Passwords don't match!"))
        } else {
          callback()
        }
      }

      const validateCheckPass = (_rule: any, value: any, callback: any) => {
        if (value === '') {
          callback(new Error('Please enter the password'))
        } else if (value.length < 3) {
          callback(new Error('Password must be at least 3 characters'))
        } else {
          callback()
        }
      }

      const rules = reactive<FormRules<typeof formValues>>({
        pass: [{ validator: validateCheckPass, trigger: 'blur' }],
        checkPass: [{ validator: validateCheckConfirmPass, trigger: 'blur' }],
        age: [{ validator: validateAge, trigger: 'blur' }],
      })

      const handleSubmit = (formEl: FormInstance | undefined) => {
        if (!formEl) {
          return
        }
        formEl.validate().then((valid) => {
          console.log(valid ? 'Form submitted' : 'Form validation failed')
        })
      }

      const handleReset = (formEl: FormInstance | undefined) => {
        if (!formEl) {
          return
        }
        formEl.resetFields()
      }

      return {
        args: { ...args, pModel: formValues, pRules: rules },
        formRef,
        formValues,
        isFormValid,
        validateHandler,
        handleSubmit,
        handleReset,
      }
    },
    template: `
      <div style="padding: 20px;">
        <PForm
          ref="formRef"
          v-bind="args"
          @submit.prevent="handleSubmit"
          @validate="validateHandler"
        >
          <PFormItem
            pLabel="Password"
            pProp="pass"
            pRequired
          >
            <PInput
              v-model="formValues.pass"
              pType="password"
              pAutocomplete="off"
            />
          </PFormItem>
          <PFormItem
            pLabel="Retype password"
            pProp="checkPass"
            pRequired
          >
            <PInput
              v-model="formValues.checkPass"
              pType="password"
              pAutocomplete="off"
            />
          </PFormItem>
          <PFormItem
            pLabel="Age"
            pProp="age"
            pRequired
          >
            <PInput v-model="formValues.age" pType="number" />
          </PFormItem>
          <PFormItem>
            <PButton
              pType="primary"
              :pDisabled="!isFormValid"
              style="margin-right: 16px;"
              @click="handleSubmit(formRef)"
            >
              Submit
            </PButton>
            <PButton @click="handleReset(formRef)">
              Reset
            </PButton>
          </PFormItem>
        </PForm>
      </div>
    `,
  }),
  args: {
    pRequireAsteriskPosition: 'right',
  },
}

export const InlineForm: Story = {
  render: (args) => ({
    components: { PForm, PFormItem, PButton, PInput },
    setup() {
      const formRef = ref<FormInstance>()
      const formValues = reactive({
        user: '',
        region: '',
      })

      const rules = reactive<FormRules<typeof formValues>>({
        user: [
          { required: true, message: 'Please input Activity name', trigger: 'blur' },
          { min: 3, max: 15, message: 'Length should be 3 to 15', trigger: 'blur' },
        ],
        region: [
          { required: true, message: 'Please select Activity zone', trigger: 'change' },
        ],
      })

      const onSubmit = () => {
        console.log('Inline form submitted!', formValues)
      }

      return {
        args: { ...args, pModel: formValues, pRules: rules },
        formRef,
        formValues,
        onSubmit,
      }
    },
    template: `
      <div style="padding: 20px;">
        <PForm
          ref="formRef"
          v-bind="args"
          style="max-width: 600px"
          @submit.prevent="onSubmit"
        >
          <PFormItem pLabel="Approved by" pProp="user">
            <PInput v-model="formValues.user" pPlaceholder="Approved by" />
          </PFormItem>
          <PFormItem pLabel="Activity zone" pProp="region">
            <PInput v-model="formValues.region" pPlaceholder="Activity zone" />
          </PFormItem>
          <PFormItem>
            <PButton pType="primary" @click="onSubmit">Submit</PButton>
          </PFormItem>
        </PForm>
      </div>
    `,
  }),
  args: {
    pInline: true,
  },
}

export const RequiredAsteriskPositions: Story = {
  render: () => ({
    components: { PForm, PFormItem, PInput },
    setup() {
      const formValues = reactive({
        firstName: '',
        lastName: '',
        email: '',
      })

      const rules = reactive<FormRules<typeof formValues>>({
        firstName: [{ required: true, message: 'First name is required', trigger: 'blur' }],
        lastName: [{ required: true, message: 'Last name is required', trigger: 'blur' }],
        email: [{ required: true, message: 'Email is required', trigger: 'blur' }],
      })

      return {
        formValues,
        rules,
      }
    },
    template: `
      <div style="padding: 20px;">
        <h3>Required Asterisk Positions</h3>
        
        <div style="margin-bottom: 32px;">
          <h4>Asterisk on Left (Default)</h4>
          <PForm :pModel="formValues" :pRules="rules" pRequireAsteriskPosition="left" style="max-width: 400px;">
            <PFormItem pLabel="First Name" pProp="firstName" pRequired>
              <PInput v-model="formValues.firstName" pPlaceholder="Enter first name" />
            </PFormItem>
            <PFormItem pLabel="Last Name" pProp="lastName" pRequired>
              <PInput v-model="formValues.lastName" pPlaceholder="Enter last name" />
            </PFormItem>
            <PFormItem pLabel="Email" pProp="email" pRequired>
              <PInput v-model="formValues.email" pPlaceholder="Enter email" />
            </PFormItem>
          </PForm>
        </div>
        
        <div>
          <h4>Asterisk on Right</h4>
          <PForm :pModel="formValues" :pRules="rules" pRequireAsteriskPosition="right" style="max-width: 400px;">
            <PFormItem pLabel="First Name" pProp="firstName" pRequired>
              <PInput v-model="formValues.firstName" pPlaceholder="Enter first name" />
            </PFormItem>
            <PFormItem pLabel="Last Name" pProp="lastName" pRequired>
              <PInput v-model="formValues.lastName" pPlaceholder="Enter last name" />
            </PFormItem>
            <PFormItem pLabel="Email" pProp="email" pRequired>
              <PInput v-model="formValues.email" pPlaceholder="Enter email" />
            </PFormItem>
          </PForm>
        </div>
      </div>
    `,
  }),
  args: {},
}

export const FormSizes: Story = {
  render: () => ({
    components: { PForm, PFormItem, PInput, PButton },
    setup() {
      const formValues = reactive({
        input1: 'Large form',
        input2: 'Default form',
        input3: 'Small form',
      })

      return {
        formValues,
      }
    },
    template: `
      <div style="padding: 20px;">
        <h3>Form Sizes</h3>
        
        <div style="margin-bottom: 32px;">
          <h4>Large Size</h4>
          <PForm :pModel="formValues" pSize="large" style="max-width: 400px;">
            <PFormItem pLabel="Large Input">
              <PInput v-model="formValues.input1" />
            </PFormItem>
            <PFormItem>
              <PButton pType="primary">Large Button</PButton>
            </PFormItem>
          </PForm>
        </div>
        
        <div style="margin-bottom: 32px;">
          <h4>Default Size</h4>
          <PForm :pModel="formValues" pSize="default" style="max-width: 400px;">
            <PFormItem pLabel="Default Input">
              <PInput v-model="formValues.input2" />
            </PFormItem>
            <PFormItem>
              <PButton pType="primary">Default Button</PButton>
            </PFormItem>
          </PForm>
        </div>
        
        <div>
          <h4>Small Size</h4>
          <PForm :pModel="formValues" pSize="small" style="max-width: 400px;">
            <PFormItem pLabel="Small Input">
              <PInput v-model="formValues.input3" />
            </PFormItem>
            <PFormItem>
              <PButton pType="primary">Small Button</PButton>
            </PFormItem>
          </PForm>
        </div>
      </div>
    `,
  }),
  args: {},
}

export const DisabledForm: Story = {
  render: (args) => ({
    components: { PForm, PFormItem, PInput, PButton, PCheckbox },
    setup() {
      const formValues = reactive({
        name: 'John Doe',
        email: 'john@example.com',
        terms: true,
      })

      return {
        args: { ...args, pModel: formValues },
        formValues,
      }
    },
    template: `
      <div style="padding: 20px;">
        <PForm v-bind="args" style="max-width: 400px;">
          <PFormItem pLabel="Name">
            <PInput v-model="formValues.name" />
          </PFormItem>
          <PFormItem pLabel="Email">
            <PInput v-model="formValues.email" />
          </PFormItem>
          <PFormItem pLabel="Terms">
            <PCheckbox v-model="formValues.terms" pLabel="I accept the terms and conditions" />
          </PFormItem>
          <PFormItem>
            <PButton pType="primary">Submit</PButton>
            <PButton style="margin-left: 16px;">Cancel</PButton>
          </PFormItem>
        </PForm>
      </div>
    `,
  }),
  args: {
    pDisabled: true,
  },
}
