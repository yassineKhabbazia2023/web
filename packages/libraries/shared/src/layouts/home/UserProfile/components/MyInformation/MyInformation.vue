<template>
  <div>
    <PLoader v-if="isLoading" />
    <div v-if="!isLoading">
      <p class="h4 margin-bottom--6">
        {{ user.firstName }} <span class="text-uppercase">{{ user.lastName }}</span>
      </p>
      <PForm
        ref="formRef"
        :pModel="formValues"
        :pRules="rules"
        pLabelPosition="top"
        pRequireAsteriskPosition="right"
        @submit.prevent="handleFormSubmit(formRef)"
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
          <LegalLinks
            :hasCgu="isCollab === false"
            class="margin-top--4 font-small"
          />
        </div>

        <Teleport to="#my-information__footer-drawer">
          <div class="flex flex--justify-content-space-between">
            <LogoutButton />

            <PButton
              pType="primary"
              :pDisabled="!formValues.mobilePhone"
              :pLoading="isUpdateInProgress"
              @click="handleFormSubmit(formRef)"
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
import { reactive, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { logger } from '@pulse/toolbox'
import { commonApi } from '@pulse/common'
import { CurrentUserService } from '@pulse/common/services/current-user'
import { PNotification } from '@pulse/styleguide'
import type { FormInstance } from '@pulse/styleguide/types'
import { PButton, PForm, PFormItem, PInput, PLoader } from '@pulse/styleguide/components'
import { LegalLinks } from '@pulse/shared/components'
import type { FormValues, User } from './MyInformationTypes'
import LogoutButton from '@shared/layouts/home/UserProfile/components/LogoutButton'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const isLoading = ref(false)
const isUpdateInProgress = ref(false)
const formRef = ref<FormInstance>()
const isCollab = ref(false)

const user = reactive<User>({
  firstName: '',
  lastName: '',
})

const formValues = reactive<FormValues>({
  email: '',
  personaName: '',
  mobilePhone: '',
})

const rules = reactive({
  mobilePhone: [
    {
      required: true,
      trigger: 'blur',
      message: t('mobilePhoneError'),
    },
  ],
})

const CONTACT_API_ENDPOINT = 'contact/api/contacts/currentuser'

const handleFormSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }

  if (formEl.validate) {
    isUpdateInProgress.value = true
    try {
      await formEl.validate()
      await commonApi().gateway.patch(
        CONTACT_API_ENDPOINT,
        [
          {
            op: 'replace',
            path: '/MobilePhone',
            value: formValues.mobilePhone,
          },
        ],
        {
          headers: {
            'Content-Type': 'application/json-patch+json',
          },
        },
      )

      PNotification({
        message: t('notificationSuccess'),
        iconName: 'check',
        showClose: true,
        customClass: 'success',
        position: 'bottom-right',
      })
    } catch (error) {
      logger.error(error)
      PNotification({
        message: t('notificationError'),
        iconName: 'exclamationTriangle',
        showClose: true,
        customClass: 'error',
        position: 'bottom-right',
      })

      return false
    } finally {
      isUpdateInProgress.value = false
    }
  }
}

onMounted(async () => {
  const me = await CurrentUserService.getCurrentUser()
  if (me) {
    user.lastName = me.lastName
    user.firstName = me.firstName
    isCollab.value = me.isCollab === true
    formValues.email = me.email
    formValues.personaName = me.persona?.name
    formValues.mobilePhone = me.officeMobile
  }
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
  mobilePhone: 'Téléphone mobile'
  saveChanges: 'Enregistrer les modifications'
  mobilePhoneError: 'Le téléphone mobile est requis'
  requiredFields: '* Champs obligatoires'
  notificationSuccess: 'Vos informations ont bien été mises à jour.'
  notificationError: 'Un problème est survenu'
</i18n>
