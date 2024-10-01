<template>
  <div>
    <div
      class="
        radius--1
        bg--persian-50
        padding-y--6
        margin-bottom--6
      "
    >
      <PImage
        pType="portrait"
        pName="user-male"
        class="my-information__image-portrait"
      />
    </div>

    <PLoader v-if="isLoading" />

    <div v-if="!isLoading">
      <p class="h4 margin-bottom--6">
        {{ user.firstName }} <span class="text-uppercase">{{ user.lastName }}</span>
      </p>

      <PForm
        @submit.prevent="handleFormSubmit(formRef)"
        :pModel="formValues"
        :pRules="rules"
        ref="formRef"
        pLabelPosition="top"
        pRequireAsteriskPosition="right"
      >
        <div class="flex flex--justify-content-space-between">
          <div class="half-width">
            <PFormItem
              :pLabel="t('role')"
              prop="personaName"
              pRequired
            >
              <PInput
                v-model="formValues.personaName"
                pName="personaName"
                pDisabled
              />
            </PFormItem>
          </div>

          <div class="half-width">
            <PFormItem
              :pLabel="t('mobilePhone')"
              prop="mobilePhone"
              pRequired
            >
              <PInput
                v-model="formValues.mobilePhone"
                pName="mobilePhone"
              />
            </PFormItem>
          </div>
        </div>

        <PFormItem
          :pLabel="t('email')"
          prop="email"
          pRequired
        >
          <PInput
            v-model="formValues.email"
            pName="email"
            pDisabled
          />
        </PFormItem>

        <p
          class="
            padding-top--2
            text-color--neutral-gray-300
            font-small
          "
        >
          {{ t('requiredFields') }}
        </p>
        <div class="margin-top--6">
          <LegalLinks />
        </div>

        <Teleport to=".el-drawer__footer">
          <div class="flex flex--justify-content-space-between">
            <LogoutButton />

            <PButton
              pType="primary"
              @click="handleFormSubmit(formRef)"
              :pDisabled="!formValues.mobilePhone"
            >
              {{ t('saveChanges') }}
            </PButton>
          </div>
        </Teleport>
      </PForm>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { onMounted, reactive, ref } from 'vue'
import { commonApi } from '@pulse/common'
import {
  PButton,
  PForm,
  PFormItem,
  PICheck,
  PIExclamationTriangle,
  PImage,
  PInput,
  PLoader,
  PNotification,
} from '@kpmg/styleguide'
import type { FormInstance } from '@kpmg/styleguide'
import LegalLinks from '@app/components/LegalLinks'
import type { FormValues, User } from './MyInformationTypes'
import LogoutButton from '../LogoutButton'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const user: User = reactive({
  firstName: undefined,
  lastName: undefined,
})

const isLoading = ref(false)

const formRef = ref<FormInstance>()
const formValues: FormValues = reactive({
  personaName: undefined,
  email: undefined,
  mobilePhone: undefined,
})

const rules = reactive({
  mobilePhone: [{
    required: true,
    trigger: 'blur',
    message: t('mobilePhoneError'),
  }],
})

const CONTACT_API_ENDPOINT = 'contact/api/contacts/currentuser'

const handleFormSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return

  if (formEl.validate) {
    try {
      await formEl.validate()
      await commonApi().gateway.patch(CONTACT_API_ENDPOINT, [{
        op: 'replace',
        path: '/MobilePhone',
        value: formValues.mobilePhone,
      }],
      {
        headers: {
          'Content-Type': 'application/json-patch+json',
        },
      })

      PNotification({
        message: t('notificationSuccess'),
        icon: PICheck,
        showClose: true,
        customClass: 'success',
        position: 'bottom-right',
      })
    } catch (error) {
      PNotification({
        message: t('notificationError'),
        icon: PIExclamationTriangle,
        showClose: true,
        customClass: 'error',
        position: 'bottom-right',
      })

      return false
    }
  }
}

const fetchUserInfo = async () => {
  isLoading.value = true

  try {
    const {
      data: {
        firstName,
        lastName,
        persona,
        email,
        mobilePhone,
      },
    } = await commonApi().gateway.get(CONTACT_API_ENDPOINT)
    user.firstName = firstName
    user.lastName = lastName
    formValues.personaName = persona?.name
    formValues.email = email
    formValues.mobilePhone = mobilePhone
  } catch (error) {
    console.error(error)
  }

  isLoading.value = false
}

onMounted(async () => {
  await fetchUserInfo()
})
</script>

<style lang="scss" scoped>
$gap: 12px;

.my-information {
  &__image-portrait {
    height: 95px;
  }
}

.half-width {
  width: calc(50% - $gap/2);
}
</style>

<i18n lang="yaml">
en-US:
  role: 'Role'
  email: 'Email'
  mobilePhone: 'Mobile phone'
  saveChanges: 'Save changes'
  mobilePhoneError: 'The mobile phone is required'
  requiredFields: '* Champs obligatoires'
  notificationSuccess: 'Your information has been successfully updated'
  notificationError: 'A problem occurred'
fr-FR:
  role: 'Rôle'
  email: 'Adresse mail'
  mobilePhone: "Téléphone mobile"
  saveChanges: 'Enregistrer les modifications'
  mobilePhoneError: "Le téléphone mobile est requis"
  requiredFields: '* Champs obligatoires'
  notificationSuccess: 'Vos informations ont bien été mises à jour.'
  notificationError: "Un problème est survenu"
</i18n>
