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
      :model="formValue">
      <PFormItem
        :label="t('lblPassword')"
        prop="password"
        required>
        <PInput
          v-model="formValue.password"
          :placeholder="t('phdPassword')"
          type="password"
          showPassword
        />
      </PFormItem>
      <PFormItem
        :label="t('lblConfirmPassword')"
        prop="confirmPassword"
        required
      >
        <PInput
          v-model="formValue.confirmPassword"
          :placeholder="t('phdConfirmPassword')"
          type="password"
          showPassword
        />
      </PFormItem>
      <p>
        {{ t('validCgu') }}
      </p>
      <PFormItem
        prop="terms"
        required>
        <PCheckbox
          v-model="formValue.terms"
          class="cgu-checkbox"
          ref="checkbox"
        >
          {{ t('cguMsg') }}
          <a
            href="https://www.google.com"
            target="_blank"
            class="cgu-link">
            {{ t('cguLink') }}
          </a>
          {{ t('cguMsg2') }}
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
    lblPassword: 'Your new password'
    lblConfirmPassword: 'Confirm your new password'
    phdPassword: 'Enter your new password'
    phdConfirmPassword: 'Confirm your new password'
    validCgu: 'Please valid the General Terms and Conditions of use'
    cguMsg: 'By checking this box, I confirm that I have read and accepted the '
    cguLink: 'general terms and conditions of use '
    cguMsg2: 'of KPMG Pulse.'
    alertConfirmPass: 'Please confirm the password'
    alertPasswordNotMatch: 'Passwords don''t match!'
    alertCgu: 'Please accept the general terms and conditions of use'
    alertPasswordRequired: 'Please enter the password'
    btnSubmit: 'Activate my account'
  fr-FR:
    createAccount: 'Créez votre compte'
    1step: 'en une étape.'
    defPassword: 'Veuillez définir votre mot de passe et le confirmer.'
    lblPassword: 'Définissez votre mot de passe'
    lblConfirmPassword: 'Confirmer votre mot de passe'
    phdPassword: 'Saisir votre mot de passe'
    phdConfirmPassword: 'Confirmer votre mot de passe'
    validCgu: 'Validez les conditions générales d''utilisation.'
    cguMsg: 'En cochant cette case, je confirme avoir lu et accepté '
    cguLink: 'conditions générales d''utilisation '
    cguMsg2: 'de KPMG Pulse.'
    alertConfirmPass: 'Veuillez confirmer votre mot de passe'
    alertPasswordNotMatch: 'Mot de passe ne correspondent pas!'
    alertCgu: 'Veuillez accepter les conditions générales d''utilisation'
    alertPasswordRequired: 'Veuillez renter votre mot de passe'
    btnSubmit: 'Activer mon compte'
</i18n>

<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { FormRules, FormInstance } from 'element-plus'
import { commonApi, commonStore as store } from '@kpmg/common'
import {
  onBeforeMount,
  onMounted,
  reactive,
  ref,
  watch
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
const accountId = route.query.accountid
const formRef = ref<FormInstance>()
const isValidForm = ref(false)
const formValue = reactive({
  password: '',
  confirmPassword: '',
  terms: false
})

watch(formValue, async () => {
  await formRef.value?.validate((valid) => {
    isValidForm.value = valid
  })
})

const validatePassword = (_rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error(t('alertPasswordRequired')))
  } else {
    callback()
  }
}

const validateCheckPass = (_rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error(t('alertConfirmPass')))
  } else if (value !== formValue.password) {
    callback(new Error(t('alertPasswordNotMatch')))
  } else {
    callback()
  }
}

const validateTerm = (_rule: any, value: any, callback: any) => {
  if (!value) {
    callback(new Error(t('alertCgu')))
  } else {
    callback()
  }
}

const rules = reactive<FormRules<typeof formValue>>({
  password: [{ trigger: 'blur', validator: validatePassword }],
  confirmPassword: [{ trigger: 'blur', validator: validateCheckPass }],
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
        router.push({ name: '/home' })
      } catch {}
    } else {
      return false
    }
  })
}

const isValidToken = async (): Promise<any> => {
  const token = route.query.pwrt
  const urlValidToken = `/Activation/IsInvitationTokenValid?invitationToken=${token}`
  try {
    const { data: value } = await commonApi().onboarding.get(urlValidToken)
    return value
  } catch {}
}

onBeforeMount(async () => {
  const isValid = await isValidToken()
  if (!isValid) {
    router.push({ path: '/expireToken', query: { email, accountId } })
  }
})

onMounted(() => {
  setTimeout(async () => {
    if (formRef.value) {
      await formRef.value.validate((valid) => { return valid })
    }
  }, 1000)
})
</script>

<style lang="scss" scoped>
.page-content {
  text-align: start;
  max-width: 376px;
  .txt-create-account {
    font-size: 21px;
    font-weight: 600;
    line-height: 25.2px;
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
    line-height: 16.8px;

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
