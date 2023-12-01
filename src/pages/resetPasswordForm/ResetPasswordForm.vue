<template>
  <div class="page-content">
    <p class="txt-create-account">
      {{ t('createAccount') }}
      <span class="purple-text">
        {{ t('1step') }}
      </span>
    </p>
    <p>
      {{ t('defPassword') }}
    </p>
    <PForm
      class="form-password"
      labelPosition="top"
      hideRequiredAsterisk
      :rules="rules"
      ref="formRef"
      :model="formValue"
    >
      <PFormItem
        :label="t('labelPassword')"
        prop="password"
        required
      >
        <PopoverPasswordStrength
          :password="formValue.password"
        >
          <PInput
            v-model="formValue.password"
            :placeholder="t('placeholderPassword')"
            type="password"
            showPassword
          />
        </PopoverPasswordStrength>
      </PFormItem>
      <PFormItem
        :label="t('labelConfirmPassword')"
        prop="confirmPassword"
        required
      >
        <PInput
          v-model="formValue.confirmPassword"
          :placeholder="t('placeholderConfirmPassword')"
          type="password"
          showPassword
        />
      </PFormItem>
      <PFormItem>
        <PButton
          pType="primary"
          :pDisabled="!isValidForm"
          pSize="default"
          class="btn-submit"
          @click="submitForm(formRef)"
        >
          {{ t('btnSubmit') }}
        </PButton>
      </PFormItem>
    </PForm>
  </div>
</template>

<i18n lang="yaml">
  en-US:
    createAccount: 'Your '
    1step: 'new password.'
    defPassword: 'Please enter and confirm your new password'
    labelPassword: 'Your new password'
    labelConfirmPassword: 'Confirm your new password'
    placeholderPassword: 'Enter your new password'
    placeholderConfirmPassword: 'Confirm your new password'
    alertConfirmPass: 'Please confirm the password'
    alertPasswordNotMatch: "Passwords don't match!"
    alertPasswordRequired: 'Please enter the password'
    alertPasswordLevelLow: 'Your password is not valid'
    btnSubmit: 'Submit'
  fr-FR:
    createAccount: 'Votre '
    1step: 'nouveau mot de passe.'
    defPassword: 'Veuillez définir votre mot de passe et le confirmer.'
    labelPassword: 'Définissez votre mot de passe'
    labelConfirmPassword: 'Confirmer votre mot de passe'
    placeholderPassword: 'Saisir votre mot de passe'
    placeholderConfirmPassword: 'Confirmer votre mot de passe'
    alertConfirmPass: 'Veuillez confirmer votre mot de passe'
    alertPasswordNotMatch: 'Les mots de passe ne correspondent pas!'
    alertPasswordRequired: 'Veuillez rentrer votre mot de passe'
    alertPasswordLevelLow: "Votre mot de passe n'est pas valide"
    btnSubmit: 'Valider'
</i18n>

<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { FormRules, FormInstance } from 'element-plus'
import { commonApi } from '@kpmg/common'
import {
  onBeforeMount,
  reactive,
  ref,
  computed
} from 'vue'
import {
  PForm,
  PFormItem,
  PInput,
  PButton
} from '@kpmg/styleguide'
import PopoverPasswordStrength from '../createPassword/PopoverPasswordStrength'
import {
  PASSWORD_STRENGTH,
  levelPasswordStrength
} from '../createPassword/PopoverPasswordStrength/passwordStrength'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})
const route = useRoute()
const router = useRouter()
const { contactId, contactEmail, token } = route.query
const formRef = ref<FormInstance>()
const formValidity = reactive({
  password: false,
  confirmPassword: false
})
const formValue = reactive({
  password: '',
  confirmPassword: ''
})

const isValidForm = computed(() => {
  return formValidity.password &&
    formValidity.confirmPassword &&
    levelPasswordStrength(formValue.password) === PASSWORD_STRENGTH.STRONG
})

const validatePassword = (_rule: any, value: any, callback: any) => {
  if (!value) {
    formValidity.password = false
    callback(new Error(t('alertPasswordRequired')))
  } else {
    if (!formRef.value) return
    if (levelPasswordStrength(value) !== PASSWORD_STRENGTH.STRONG) {
      formValidity.password = false
      callback(new Error(t('alertPasswordLevelLow')))
    } else {
      formRef.value?.validateField('confirmPassword', () => null)
      callback()
    }
    formValidity.password = true
  }
}

const validateCheckPass = (_rule: any, value: any, callback: any) => {
  if (!value) {
    formValidity.confirmPassword = false
    callback(new Error(t('alertConfirmPass')))
  } else if (!!formValue.password && value !== formValue.password) {
    formValidity.confirmPassword = false
    callback(new Error(t('alertPasswordNotMatch')))
  } else {
    formValidity.confirmPassword = true
    callback()
  }
}

const rules = reactive<FormRules<typeof formValue>>({
  password: [{ trigger: ['change', 'blur'], validator: validatePassword }],
  confirmPassword: [{ trigger: ['change', 'blur'], validator: validateCheckPass }]
})

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      const data = {
        contactId,
        password: formValue.password,
        resetPasswordToken: token,
        isCreatePasswordAction: false
      }
      const urlUpdatePassword = '/createResetPassword'
      try {
        await commonApi().auth.post(urlUpdatePassword, data)
        router.push({ name: 'loginClient' })
      } catch {}
    } else {
      return false
    }
  })
}

const isValidToken = async (): Promise<any> => {
  const urlValidToken = `/Activation/IsInvitationTokenValid?invitationToken=${token}`
  try {
    const { data: value } = await commonApi().onboarding.get(urlValidToken)
    return value
  } catch {}
}

onBeforeMount(async () => {
  const isValid = await isValidToken()
  if (!isValid) {
    router.push({ name: 'expireToken', query: { contactEmail } })
  }
})
</script>

<style lang="scss" scoped>
.page-content {
  text-align: start;
  .txt-create-account {
    font-size: 21px;
    font-weight: 600;
    line-height: 25px;
    .purple-text {
      color: var(--el-color-persian-500);
    }
    margin-bottom: 24px;
    margin-top: 14px;
  }
  .form-password {
    margin-top: 18px;
  }
  .btn-submit {
    width: 100%;
    margin-bottom: 20px;
  }
}
</style>
