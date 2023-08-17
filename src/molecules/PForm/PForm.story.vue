<template>
  <Story
    title="3. Molecules/Form"
    icon="icon-park-outline:form"
  >
    <PForm
      ref="formRef"
      :rules="rules"
      :model="formValues"
      requireAsteriskPosition="right"
      labelPosition="top"
      @submit.prevent="handleSubmit"
    >
      <PFormItem
        label="Password"
        prop="pass"
        required
      >
        <PInput
          v-model="formValues.pass"
          type="password"
          autocomplete="off"
        />
      </PFormItem>
      <PFormItem
        label="Retype password"
        prop="checkPass"
        required
      >
        <PInput
          v-model="formValues.checkPass"
          type="password"
          autocomplete="off"
        />
      </PFormItem>
      <PFormItem
        label="Age"
        prop="age"
        required
      >
        <PInput v-model="formValues.age" type="number" />
      </PFormItem>
      <PFormItem>
      <PButton
        type="primary"
        @click="handleSubmit(formRef)"
      >
        Submit
      </PButton>
      <PButton @click="handleReset(formRef)">
        Reset
      </PButton>
    </PFormItem>
    </PForm>
  </Story>
</template>

<script setup lang="ts">
import { inject, reactive, ref } from 'vue'
import { ElNotification } from 'element-plus'
// the following types are exported in the styleguide as PFormInstance & PFormRules
import type { FormInstance, FormRules } from 'element-plus'
import { PICheck, PIExclamationTriangle } from '@/atoms/PIcon/components'

const toastPlugin = inject('toast') as typeof ElNotification

const formRef = ref<FormInstance>()

const formValues = reactive({
  pass: '',
  checkPass: '',
  age: ''
})

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

const validateCheckPass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('Please enter the password again'))
  } else if (value !== formValues.pass) {
    callback(new Error("Passwords don't match!"))
  } else {
    callback()
  }
}

const rules = reactive<FormRules<typeof formValues>>({
  pass: [{ trigger: 'blur' }],
  checkPass: [{ validator: validateCheckPass, trigger: 'blur' }],
  age: [{ validator: validateAge, trigger: 'blur' }]
})

interface openToastArgs {
  message: string;
  icon: any;
  customClass: string;
}

const openToast = ({ message, icon, customClass }: openToastArgs) => {
  toastPlugin({
    message,
    icon,
    showClose: false,
    customClass
  })
}

const handleSubmit = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    openToast({
      message: valid ? 'Form submitted' : 'Error',
      icon: valid ? PICheck : PIExclamationTriangle,
      customClass: valid ? 'success' : 'error'
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
