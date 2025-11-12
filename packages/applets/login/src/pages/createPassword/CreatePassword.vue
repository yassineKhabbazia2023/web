<template>
  <div
    class="page-content flex flex--direction-column flex--align-items-center margin-y--4"
  >
    <div>
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
              data-testid="create-password-first-password"
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
            data-testid="create-password-second-password"
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
            ref="checkbox"
            v-model="formValue.terms"
            class="
              cgu-checkbox
              font-base
              font-normal
              padding--3
              bg--neutral-gray-50
            "
            data-testid="create-password-terms-checkbox"
          >
            {{ t('cguMessagePartOne') }}
            <a
              :href="urlTerms"
              target="_blank"
              class="cgu-link font-bold text-color--black-rock-700"
            >
              {{ t('cguLink') }}
            </a>
            {{ t('cguMessagePartTwo') }}
          </PCheckbox>
        </PFormItem>
        <PFormItem>
          <PButton
            pType="primary"
            :pDisabled="!isValidForm || isLoading"
            :pLoading="isLoading"
            pSize="default"
            class="btn-submit"
            data-testid="create-password-submit-button"
            @click="submitForm(formRef)"
          >
            {{ t('btnSubmit') }}
          </PButton>
        </PFormItem>
      </PForm>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { logger } from '@pulse/toolbox'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { FormRules, FormInstance } from 'element-plus'
import {
  fetchUrlTerms,
  createNewPassword,
  login,
} from '@pulse/common'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import { useUserStore } from '@pulse/common/stores'
import { type UserInfo } from '@pulse/common/types'
import { BackEndErrors } from '@pulse/common/constants'
import { CurrentUserManager } from '@pulse/common/managers'
import { RouteName } from '@pulse/common/enums'
import {
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
} from '@pulse/styleguide/components'
import PopoverPasswordStrength from './PopoverPasswordStrength'
import {
  PASSWORD_STRENGTH,
  levelPasswordStrength,
} from './PopoverPasswordStrength/passwordStrength'
import { getLatestTerms, updateTermsByCurrentUser } from '@pulse/common/services/cgu'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const route = useRoute()
const router = useRouter()
const { contactId, accountNumber, token, email: emailQuery } = route.query as {
  contactId: string
  accountNumber: string
  token: string
  email: string
}

const userStore = useUserStore()

const email = emailQuery?.toString().trim().replace(' ', '+')
const formRef = ref<FormInstance>()
const urlTerms = ref('')
const isLoading = ref(false)
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

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.validate((valid) => {
    (async () => {
      if (valid) {
        const data = {
          token,
          newPassword: formValue.password,
        }
        try {
          isLoading.value = true
          await createNewPassword(data)
          const loginPayload = {
            email: email ?? '',
            password: formValue.password,
          }

          const {
            userId: id,
            webToken: token,
          } = await login(loginPayload) as any // this is temporary, we need to fix the type when refact userStore

          CurrentUserManager.persistToken(token)
          await updateTermsByCurrentUser(termsId.value as number)
          AmplitudeService.track('Onboarding Completed', {
            onboarding_result: 'succeeded',
          })
          const user: UserInfo = {
            id,
            firstName: '',
            lastName: '',
            occupation: '',
            email: '',
            entities: {
              default: undefined,
            },
            isCollab: false,
            gigyaUserId: '',
          }
          userStore.setUser(user)
          router.push({ name: RouteName.WALLET })
        } catch (error: any) {
          AmplitudeService.track('Onboarding Completed', {
            onboarding_result: 'failed',
          })
          const { data } = error?.response ?? {}

          if (data.errorCode === BackEndErrors.TOKEN_EXPIRED) {
            router.push({ name: RouteName.EXPIRE_TOKEN, query: { contactId, accountNumber } })
          }
        } finally {
          isLoading.value = false
        }
      } else {
        return false
      }
    })()
  })
}

onMounted(async () => {
  AmplitudeService.reset()
  AmplitudeService.track('Onboarding Email Accepted', {
    onboarding_email_click: '',
  })
  try {
    urlTerms.value = await fetchUrlTerms()
    const data = await getLatestTerms()
    termsId.value = data.termsId
  } catch (error) {
    logger.error(error)
  }
})

defineExpose({ submitForm })
</script>

<style lang="scss" scoped>
.page-content {
  $self: &;
  text-align: start;
  &.center {
    height: calc(100% - 180px);
    justify-content: center;
  }
  .txt-create-account {
    font-size: 21px;
    font-weight: 600;
    line-height: 25px;
    .purple-text {
      color: var(--p-jungle-400);
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
    cguMessagePartTwo: 'of RYDGE Conseil.'
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
    cguMessagePartTwo: 'de RYDGE Conseil.'
    alertConfirmPass: 'Veuillez confirmer votre mot de passe'
    alertPasswordNotMatch: 'Mot de passe ne correspondent pas!'
    alertCgu: "Veuillez accepter les conditions générales d'utilisation"
    alertPasswordRequired: 'Veuillez rentrer votre mot de passe'
    alertPasswordLevelLow: "Votre mot de passe n'est pas valide"
    btnSubmit: 'Activer mon compte'
</i18n>
