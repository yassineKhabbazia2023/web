<template>
  <PDrawer
    v-model="drawerModel"
    :pTitle="t('informationsAboutCollaborator')"
    @close-drawer-button="drawerModel = false"
    pSize="50%"
  >
    <PUserCard
      class="margin-bottom--6"
      pAssetLeft="Image"
      pAssetContent="user-male"
      :pTitle="rowData.fullName"
      :pSubtitle="rowData.email">
      <PTag
        pColor="gray-500"
        pSize="default"
        pIconLeft="PIPerson"
        :pContent="rowData.role"
        pEffect="light"
      />
    </PUserCard>

    <i18n-t
      class="margin-bottom--6"
      keypath="youCanModify"
      tag="p"
    >
      <template #administrator>
        <strong>{{ t('administrator') }}</strong>
      </template>
    </i18n-t>

    <PForm
      @submit.prevent="handleSubmit"
      ref="formRef"
      :pModel="formValues"
      :pRules="formRules"
      pLabelPosition="top"
    >
      <PFormItem prop="lastName" :pLabel="t('lastName')">
        <PInput
          :value="rowData.lastName?.toUpperCase()"
          disabled
          pName="lastName"
        />
      </PFormItem>

      <PFormItem prop="firstName" :pLabel="t('firstName')">
        <PInput
          :value="rowData.firstName"
          disabled
          pName="firstName" />
      </PFormItem>

      <PFormItem prop="email" :pLabel="t('email')">
        <PInput
          :value="rowData.email"
          disabled
          pName="email" />
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
          @click="handleReset"
          class="margin-right--4"
          pType="primary"
          data-testid="reset-btn"
          pPlain
        >
          {{ t('cancel') }}
        </PButton>

        <PButton
          @click="handleSubmit"
          :pDisabled="isSubmitButtonDisabled"
          pType="primary"
          data-testid="submit-btn"
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
  PICheck,
  PIExclamationTriangle,
  PInput,
  PNotification,
  PTag,
  PUserCard,
} from '@kpmg/styleguide'
import type { FormInstance, FormRules } from '@kpmg/styleguide'
import { debounce } from '@kpmg/common'
import type Props from './types'
import { updateCollaborator } from '@/services/wallet'
import { validPhoneNumberPattern } from '@/common/utils/helpers/forms'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const emit = defineEmits(['update:modelValue', 'update-collaborator-details'])

const props = defineProps<Props>()

const drawerModel = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

// Form part
const formRef = ref<FormInstance>()
const isSubmitButtonDisabled = ref(false)
const formValues = reactive({
  mobilePhone: props.rowData.mobilePhone,
  landPhone: props.rowData.landPhone,
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

const handleReset = () => {
  drawerModel.value = false
}

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()

    const updates = {
      landphone: formValues.landPhone,
      mobilephone: formValues.mobilePhone,
    }
    const contact = await updateCollaborator(props.rowData.id, updates)
    drawerModel.value = false
    PNotification({
      message: t('notificationSuccess', { fullName: props.rowData.fullName }),
      icon: PICheck,
      showClose: true,
      customClass: 'success',
      position: 'bottom-right',
    })
    emit('update-collaborator-details', contact)
  } catch {
    PNotification({
      message: t('notificationError', { fullName: props.rowData.fullName }),
      icon: PIExclamationTriangle,
      showClose: true,
      customClass: 'error',
      position: 'bottom-right',
    })
  }
}

async function shouldSubmitButtonBeDisabled() {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    isSubmitButtonDisabled.value = false
  } catch (_error) {
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
    first name and email of your colleague directly in IBS.
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
    le prénom et le mail de votre collaborateur directement dans IBS.
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
