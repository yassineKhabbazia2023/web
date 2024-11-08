<template>
  <Story
    title="3. Molecules/Form"
    icon="icon-park-outline:form"
  >
    <Variant title="Basic Usage">
      <PForm
        ref="formRef"
        :pRules="rules"
        :pModel="formValues"
        pRequireAsteriskPosition="right"
        pLabelPosition="top"
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
            @click="handleSubmit(formRef)"
            :pDisabled="!isFormValid"
            class="margin-right--4"
          >
            Submit
          </PButton>
          <PButton @click="handleReset(formRef)">
            Reset
          </PButton>
        </PFormItem>
      </PForm>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { computed, inject, reactive, ref } from 'vue'
// the following types are exported in the styleguide as PFormInstance & PFormRules
import type { ElNotification, FormInstance, FormRules } from 'element-plus'
import { PICheck, PIExclamationTriangle } from '@styleguide/atoms/PIcon/components'
import PFormItem from '@styleguide/atoms/PFormItem'
import PButton from '@styleguide/atoms/PButton'
import PInput from '@styleguide/atoms/PInput'
import PForm from '@styleguide/molecules/PForm'

const toastPlugin = inject('toast') as typeof ElNotification

const formRef = ref<FormInstance>()

const formValues = reactive({
  pass: '',
  checkPass: '',
  age: '',
})

const formValidity: any = reactive({
  pass: false,
  checkPass: false,
  age: false,
})

const isFormValid = computed(() =>
  formValidity.pass && formValidity.checkPass && formValidity.age,
)

const validateHandler = (propName: string, isValid: boolean) => {
  formValidity[propName] = isValid
}

const validateAge = (rule: any, value: any, callback: any) => {
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

const validateCheckConfirmPass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('Please enter the password again'))
  } else if (value !== formValues.pass) {
    callback(new Error("Passwords don't match!"))
  } else {
    callback()
  }
}

const validateCheckPass = (rule: any, value: any, callback: any) => {
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

export interface openToastArgs {
  message: string
  icon: any
  customClass: string
}

const openToast = ({ message, icon, customClass }: openToastArgs) => {
  toastPlugin({
    message,
    icon,
    showClose: false,
    customClass,
  })
}

const handleSubmit = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate().then((valid) => {
    openToast({
      message: valid ? 'Form submitted' : 'Error',
      icon: valid ? PICheck : PIExclamationTriangle,
      customClass: valid ? 'success' : 'error',
    })
    if (!valid) return false
  })
}

const handleReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>

<docs lang="md">
  # Context
  This is the form and form item same as element plus except for the rendering (css)

  # Figma
  <div class="responsive-figma-container">
    <iframe class="responsive-figma" src="https://www.figma.com/file/hycpUsOrc1fFD7xcYY0ryN/%F0%9F%A6%84-Librairie-de-composants?node-id=23%3A212&mode=dev" allowfullscreen></iframe>
  </div>
</docs>
