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
        <PInput
          v-model="formValue.password"
          :placeholder="t('placeholderPassword')"
          type="password"
          showPassword
        />
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
      <p>
        {{ t('validCgu') }}
      </p>
      <PFormItem
        prop="terms"
        required
        >
        <PCheckbox
          v-model="formValue.terms"
          class="cgu-checkbox"
          ref="checkbox"
        >
          {{ t('cguMessagePartOne') }}
          <a
            href=""
            target="_blank"
            class="cgu-link">
            {{ t('cguLink') }}
          </a>
          {{ t('cguMessagePartTwo') }}
        </PCheckbox>
      </PFormItem>
      <PFormItem>
        <PButton
          type="primary"
          :disabled="!isValidForm"
          size="large"
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
    createAccount: 'Create your account '
    1step: 'in 1 step.'
    defPassword: 'Please enter and confirm your new password'
    labelPassword: 'Your new password'
    labelConfirmPassword: 'Confirm your new password'
    placeholderPassword: 'Enter your new password'
    placeholderConfirmPassword: 'Confirm your new password'
    validCgu: 'Please valid the General Terms and Conditions of use'
    cguMessagePartOne: 'By checking this box, I confirm that I have read and accepted the '
    cguLink: 'general terms and conditions of use '
    cguMessagePartTwo: 'of KPMG Pulse.'
    alertConfirmPass: 'Please confirm the password'
    alertPasswordNotMatch: "Passwords don't match!"
    alertCgu: 'Please accept the general terms and conditions of use'
    alertPasswordRequired: 'Please enter the password'
    btnSubmit: 'Activate my account'
  fr-FR:
    createAccount: 'Créez votre compte'
    1step: 'en une étape.'
    defPassword: 'Veuillez définir votre mot de passe et le confirmer.'
    labelPassword: 'Définissez votre mot de passe'
    labelConfirmPassword: 'Confirmer votre mot de passe'
    placeholderPassword: 'Saisir votre mot de passe'
    placeholderConfirmPassword: 'Confirmer votre mot de passe'
    validCgu: "Validez les conditions générales d'utilisation."
    cguMessagePartOne: 'En cochant cette case, je confirme avoir lu et accepté '
    cguLink: "conditions générales d'utilisation "
    cguMessagePartTwo: 'de KPMG Pulse.'
    alertConfirmPass: 'Veuillez confirmer votre mot de passe'
    alertPasswordNotMatch: 'Mot de passe ne correspondent pas!'
    alertCgu: "Veuillez accepter les conditions générales d'utilisation"
    alertPasswordRequired: 'Veuillez rentrer votre mot de passe'
    btnSubmit: 'Activer mon compte'
</i18n>

<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { FormRules, FormInstance } from 'element-plus'
import { commonApi, commonStore as store } from '@kpmg/common'
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
  PCheckbox,
  PButton
} from '@kpmg/styleguide'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})
const route = useRoute()
const router = useRouter()
const email = route.query.email
const accountId = route.query.accountId
const formRef = ref<FormInstance>()
const formValidity = reactive({
  password: false,
  confirmPassword: false,
  terms: false
})
const formValue = reactive({
  password: '',
  confirmPassword: '',
  terms: false
})

const isValidForm = computed(() => {
  return formValidity.password && formValidity.confirmPassword && formValidity.terms
})

const validatePassword = (_rule: any, value: any, callback: any) => {
  if (!value) {
    formValidity.password = false
    callback(new Error(t('alertPasswordRequired')))
  } else {
    if (!formRef.value) return
    formRef.value?.validateField('confirmPassword', () => null)
    callback()
  }
  formValidity.password = true
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

const validateTerm = (_rule: any, value: any, callback: any) => {
  formValidity.terms = !!value
  if (!value) {
    callback(new Error(t('alertCgu')))
  } else {
    callback()
  }
}

const rules = reactive<FormRules<typeof formValue>>({
  password: [{ trigger: ['change', 'blur'], validator: validatePassword }],
  confirmPassword: [{ trigger: ['change', 'blur'], validator: validateCheckPass }],
  terms: [{ trigger: 'change', validator: validateTerm }]
})

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      const data = {
        email,
        password: formValue.password
      }
      const urlAcceptTerms = `/Activation/AcceptTerms?email=${email}`
      const urlUpdatePassword = '/api/createPassword'
      try {
        await commonApi().onboarding.patch(urlAcceptTerms)
        const {
          data: {
            userId: id,
            webToken: token
          }
        } = await commonApi().auth.post(urlUpdatePassword, data)
        sessionStorage.setItem('token', token)
        store().$patch({
          user: {
            id,
            token
          }
        })
        router.push({ name: 'home' })
      } catch {}
    } else {
      return false
    }
  })
}

const isValidToken = async (): Promise<any> => {
  const token = route.query.token
  const urlValidToken = `/Activation/IsInvitationTokenValid?invitationToken=${token}`
  try {
    const { data: value } = await commonApi().onboarding.get(urlValidToken)
    return value
  } catch {}
}

onBeforeMount(async () => {
  const isValid = await isValidToken()
  if (!isValid) {
    router.push({ name: 'expireToken', query: { email, accountId } })
  }
})
</script>

<style lang="scss" scoped>
.page-content {
  text-align: start;
  max-width: 376px;
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
  .cgu-checkbox {
    margin-top: 18px;
    white-space: pre-wrap;
    height: 81px;
    align-items: start;
    background-color: var(--el-color-neutral-gray-50);
    border-radius: 6px;
    padding: 14px 12px 16px 12px;
    font-weight: 400;
    font-size: 14px;
    line-height: 16px;

    .cgu-link {
      font-weight: 700;
    }
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
