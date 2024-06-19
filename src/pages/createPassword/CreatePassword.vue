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
      ref="formRef"
      class="form-password"
      pLabelPosition="top"
      pHideRequiredAsterisk
      :pRules="rules"
      :pModel="formValue"
    >
      <PFormItem
        :pLabel="t('labelPassword')"
        pProp="password"
        pRequired
      >
        <PopoverPasswordStrength
          :password="formValue.password"
        >
          <PInput
            v-model="formValue.password"
            :pPlaceholder="t('placeholderPassword')"
            pType="password"
            pShowPassword
          />
        </PopoverPasswordStrength>
      </PFormItem>
      <PFormItem
        :pLabel="t('labelConfirmPassword')"
        pProp="confirmPassword"
        pRequired
      >
        <PInput
          v-model="formValue.confirmPassword"
          :pPlaceholder="t('placeholderConfirmPassword')"
          pType="password"
          pShowPassword
        />
      </PFormItem>
      <p>
        {{ t('validCgu') }}
      </p>
      <PFormItem
        pProp="terms"
        pRequired
      >
        <PCheckbox
          v-model="formValue.terms"
          class="
            cgu-checkbox
            font-base
            font-normal
            padding--3
            bg--neutral-gray-50
            radius--2
          "
          ref="checkbox"
        >
          {{ t('cguMessagePartOne') }}
          <a
            :href="urlTerms"
            target="_blank"
            class="cgu-link font-bold text-color--persian-500">
            {{ t('cguLink') }}
          </a>
          {{ t('cguMessagePartTwo') }}
        </PCheckbox>
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

<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { FormRules, FormInstance } from 'element-plus'
import { commonApi, commonStore as store, fetchUrlTerms, tokenService, amplitudeService } from '@kpmg/common'
import {
  onBeforeMount,
  reactive,
  ref,
  computed,
  onMounted,
} from 'vue'
import {
  PForm,
  PFormItem,
  PInput,
  PCheckbox,
  PButton,
} from '@kpmg/styleguide'
import PopoverPasswordStrength from './PopoverPasswordStrength'
import {
  PASSWORD_STRENGTH,
  levelPasswordStrength,
} from './PopoverPasswordStrength/passwordStrength'
import useNavigation from '@/composable/useNavigation'
import { getTermsByContactId, updateTermsByContactId } from '@/services/cgu'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})
const route = useRoute()
const router = useRouter()
const contactId = route.query.contactId
const accountId = route.query.accountId
const email = route.query.email?.toString().trim().replace(' ', '+')
const resetPasswordToken = route.query.token
const formRef = ref<FormInstance>()
const urlTerms = ref('')
const termsId = ref<null | number>(null)
const formValidity = reactive({
  password: false,
  confirmPassword: false,
  terms: false,
})
const formValue = reactive({
  password: '',
  confirmPassword: '',
  terms: false,
})

const isValidForm = computed(() => {
  return formValidity.password &&
    formValidity.confirmPassword &&
    formValidity.terms &&
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
  terms: [{ trigger: 'change', validator: validateTerm }],
})

const { navigateToCustomerWallet } = useNavigation()
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      const data = {
        contactId,
        newPassword: formValue.password,
        resetPasswordToken,
      }
      const urlUpdatePassword = 'authentication/api/createNewPassword'
      try {
        await updateTermsByContactId(parseInt(contactId as string), termsId.value as number)
        await commonApi().gateway.post(urlUpdatePassword, data)
        const urlLogin = 'authentication/api/login'
        const {
          data: {
            userId: id,
            webToken: token,
          },
        } = await commonApi().gateway.post(urlLogin, { email, password: formValue.password })
        tokenService.setToken(token)
        store().$patch({
          user: {
            id,
            isCollab: false,
          },
        })
        amplitudeService.track('Onboarding Completed', {
          onboarding_result: 'succeeded',
        })
        navigateToCustomerWallet()
      } catch {}
    } else {
      amplitudeService.track('Onboarding Completed', {
        onboarding_result: 'failed',
      })
      return false
    }
  })
}

const isValidToken = async (): Promise<any> => {
  const token = route.query.token
  const urlValidToken = `authentication/api/IsInvitationTokenValid?invitationToken=${token}`
  try {
    const { data: value } = await commonApi().gateway.get(urlValidToken)
    return value
  } catch {}
}

onBeforeMount(async () => {
  const isValid = await isValidToken()
  if (!isValid) {
    router.push({ name: 'expireToken', query: { contactId, accountId } })
  }
})
onMounted(async () => {
  amplitudeService.reset()
  amplitudeService.track('Onboarding Email Accepted', {
    onboarding_email_click: '',
  })
  try {
    urlTerms.value = await fetchUrlTerms()
    const { terms } = await getTermsByContactId(parseInt(contactId as string))
    termsId.value = terms.termsId
  } catch (error) {
    console.error(error)
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
  .cgu-checkbox {
    margin-top: 18px;
    white-space: pre-wrap;
    height: auto;
    width: 100%;
    align-items: start;

    .cgu-link {
      &:hover,
      &:focus {
        text-decoration: underline;
      }
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
    alertPasswordLevelLow: 'Your password is not valid'
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
    cguMessagePartOne: 'En cochant cette case, je confirme avoir lu et accepté les'
    cguLink: "conditions générales d'utilisation "
    cguMessagePartTwo: 'de KPMG Pulse.'
    alertConfirmPass: 'Veuillez confirmer votre mot de passe'
    alertPasswordNotMatch: 'Mot de passe ne correspondent pas!'
    alertCgu: "Veuillez accepter les conditions générales d'utilisation"
    alertPasswordRequired: 'Veuillez rentrer votre mot de passe'
    alertPasswordLevelLow: "Votre mot de passe n'est pas valide"
    btnSubmit: 'Activer mon compte'
</i18n>
