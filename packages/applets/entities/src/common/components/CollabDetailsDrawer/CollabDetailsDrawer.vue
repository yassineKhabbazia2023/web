<template>
  <PDrawer
    v-model="isCollabDetailsDrawerVisible"
    :pTitle="t('informationsAboutCollaborator')"
    pSize="50%"
    @close-drawer-button="handleCloseDrawer"
  >
    <PUserCard
      :pTitle="collabDetails.fullName"
      :pSubtitle="collabDetails.email"
      pImageName="user-duotone"
      class="margin-bottom--6"
    >
      <PTag
        :pContent="collabDetails.role"
        pColor="gray-500"
        pSize="default"
        pIconLeftName="person"
        pEffect="light"
      />
    </PUserCard>
    <i18n-t
      tag="p"
      keypath="youCanModify"
      class="margin-bottom--6"
    >
      <template #administrator>
        <strong>{{ t('administrator') }}</strong>
      </template>
    </i18n-t>
    <div
      v-if="isLoading"
      class="flex flex--justify-content-center margin-y--4"
    >
      <PLoader pType="primary" pSize="50" />
    </div>
    <PForm
      v-else
      ref="formRef"
      :pModel="formValues"
      :pRules="formRules"
      pLabelPosition="top"
      @submit.prevent="handleCollaboratorUpdate"
    >
      <PFormItem prop="lastName" :pLabel="t('lastName')">
        <PInput
          :value="collabDetails.lastName?.toUpperCase()"
          disabled
          pName="lastName"
        />
      </PFormItem>
      <PFormItem prop="firstName" :pLabel="t('firstName')">
        <PInput
          :value="collabDetails.firstName"
          disabled
          pName="firstName"
        />
      </PFormItem>
      <PFormItem prop="email" :pLabel="t('email')">
        <PInput
          :value="collabDetails.email"
          disabled
          pName="email"
        />
      </PFormItem>
      <PFormItem prop="mobilePhone" :pLabel="t('mobilePhone')">
        <PInput
          v-model="formValues.mobilePhone"
          :pPlaceholder="t('mobilePhone')"
          pName="mobilePhone"
        />
      </PFormItem>
      <PFormItem prop="landPhone" :pLabel="t('landPhone')">
        <PInput
          v-model="formValues.landPhone"
          :pPlaceholder="t('landPhone')"
          pName="landPhone"
        />
      </PFormItem>
    </PForm>
    <template #footer>
      <div class="margin-left--auto">
        <PButton
          class="margin-right--4"
          pType="secondary"
          pPlain
          data-testid="collab-form-cancel-button"
          @click="handleCloseDrawer"
        >
          {{ t('cancel') }}
        </PButton>
        <PButton
          :pDisabled="isSubmitButtonDisabled"
          pType="primary"
          data-testid="collab-form-submit-button"
          @click="handleCollaboratorUpdate"
        >
          {{ t('submit') }}
        </PButton>
      </div>
    </template>
  </PDrawer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, reactive, ref, watch } from 'vue'
import {
  PButton,
  PDrawer,
  PForm,
  PFormItem,
  PInput,
  PTag,
  PUserCard,
  PLoader,
} from '@pulse/styleguide/components'
import type { FormInstance, FormRules } from '@pulse/styleguide/types'
import { debounce } from '@pulse/common'
import type CollabDetailsDrawerProps from './CollabDetailsDrawerTypes'
import type { Contact } from '@entities/services/contact/contactTypes'
import { validPhoneNumberPattern } from '@entities/common/utils/helpers/forms'
import { updateCollaborator } from '@entities/services/wallet'
import { displayNotification } from '@entities/common/utils'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<CollabDetailsDrawerProps>()

const emit = defineEmits<{
  'update:modelValue': [boolean]
  'update-collaborator-details': [Contact]
}>()

const isCollabDetailsDrawerVisible = computed({
  get: () => props.modelValue,
  set: (isOpened: boolean) => emit('update:modelValue', isOpened),
})

// Form part
const isLoading = ref(false)
const formRef = ref<FormInstance>()
const isSubmitButtonDisabled = ref(false)
const formValues = reactive({
  mobilePhone: props.collabDetails.mobilePhone,
  landPhone: props.collabDetails.landPhone,
})
const formRules = reactive<FormRules>({
  mobilePhone: [
    {
      trigger: 'blur',
      pattern: validPhoneNumberPattern,
      message: t('incorrectPhoneNumberFormat'),
    },
  ],
  landPhone: [
    {
      trigger: 'blur',
      pattern: validPhoneNumberPattern,
      message: t('incorrectPhoneNumberFormat'),
    },
  ],
})

const handleCloseDrawer = () => {
  isCollabDetailsDrawerVisible.value = false
}
const handleCollaboratorUpdate = async () => {
  isLoading.value = true
  try {
    await formRef?.value?.validate()

    const updates = {
      landphone: formValues.landPhone,
      mobilephone: formValues.mobilePhone,
    }
    const contact = await updateCollaborator(props.collabDetails.id, updates)
    isCollabDetailsDrawerVisible.value = false
    displayNotification('success', t('notificationSuccess', { fullName: props.collabDetails.fullName }))
    emit('update-collaborator-details', contact)
  } catch {
    displayNotification('error', t('notificationError', { fullName: props.collabDetails.fullName }))
  } finally {
    isLoading.value = false
  }
}
async function shouldSubmitButtonBeDisabled() {
  try {
    await formRef?.value?.validate()
    isSubmitButtonDisabled.value = false
  } catch {
    isSubmitButtonDisabled.value = true
  }
}
function debouncedShouldSubmitButtonBeDisabled() {
  return debounce(() => shouldSubmitButtonBeDisabled(), 600)
}

watch(formValues, debouncedShouldSubmitButtonBeDisabled())
</script>

<i18n lang="yaml">
en-US:
  informationsAboutCollaborator: 'Collaborator information'
  youCanModify: >
    As an {administrator}, you can modify the name,
    first name and email of your colleague directly in Akuiteo.
  administrator: 'administrator'
  lastName: 'Last name'
  firstName: 'First name'
  email: 'Email'
  mobilePhone: 'Mobile phone'
  landPhone: 'Land phone'
  cancel: 'Cancel'
  submit: 'Submit'
  notificationSuccess: "{fullName}'s information has been successfully updated."
  notificationError: "{fullName}'s information was not been successfully updated due to a technical error."
  incorrectPhoneNumberFormat: 'Phone number format is incorrect'
fr-FR:
  informationsAboutCollaborator: 'Informations du collaborateur'
  youCanModify: >
    En tant qu'{administrator}, vous pouvez modifier le nom,
    le prénom et le mail de votre collaborateur directement dans Akuiteo.
  administrator: 'administrateur'
  lastName: 'Nom'
  firstName: 'Prénom'
  email: 'Mail'
  mobilePhone: 'Téléphone mobile'
  landPhone: 'Téléphone fixe'
  cancel: 'Annuler'
  submit: 'Valider'
  notificationSuccess: 'Les informations de {fullName} ont bien été mises à jour.'
  notificationError: "Les informations de {fullName} n'ont pas bien été mises à jour a cause d'une erreur technique."
  incorrectPhoneNumberFormat: 'Le format du numéro est incorrect'
</i18n>
