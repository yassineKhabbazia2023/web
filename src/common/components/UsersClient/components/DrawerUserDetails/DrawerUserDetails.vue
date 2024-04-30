<template>
  <PDrawer
    v-model="drawerModel"
    :pTitle="t('informationsAboutUser')"
    @close-drawer-button="closeDrawer"
  >
    <PUserCard
      class="margin-bottom--6 user-card"
      pAssetLeft="Image"
      pAssetContent="collab-male"
      :pTitle="fullName"
      :pSubtitle="userInfo?.email ?? ''"
      pColor="gray"
    >
      <PTag
        pColor="gray-900"
        pSize="default"
        pIconLeft="PIPerson"
        :pContent="userInfo?.persona?.name ?? ''"
        pEffect="light"
        data-testid="persona"
      />
    </PUserCard>
    <p
      class="margin-bottom--6"
    >
      {{ t('youCanModify') }}
    </p>
    <PForm
      ref="formRef"
      :pModel="formValues"
      :rules="editMode ? rules : null"
      pLabelPosition="top"
      requireAsteriskPosition = "right"
      @submit.prevent="handleSubmit(formRef)"
    >
      <PFormItem
        prop="firstName"
        :pLabel="t('firstName')"
      >
        <PInput
          v-model="formValues.firstName"
          :readonly="!editMode"
          pName="firstName"
        />
      </PFormItem>

      <PFormItem
        prop="lastName"
        :pLabel="t('lastName')"
      >
        <PInput
          v-model="formValues.lastName"
          :readonly="!editMode"
          pName="lastName"
        />
      </PFormItem>

      <PFormItem
        prop="landPhone"
        :pLabel="t('landPhone')"
      >
        <PInput
          v-model="formValues.landPhone"
          :readonly="!editMode"
          pName="landPhone"
        />
      </PFormItem>

      <PFormItem
        prop="mobilePhone"
        :pLabel="t('mobilePhone')"
      >
        <PInput
          v-model="formValues.mobilePhone"
          :readonly="!editMode"
          pName="mobilePhone"
        />
      </PFormItem>
    </PForm>

    <template #footer>
      <div class="margin-left--auto">
        <template v-if="editMode">
          <PButton
            @click="resetForm"
            class="margin-right--4"
            pType="primary"
            pPlain
            data-testid="cancel-btn"
          >
            {{ t('cancel') }}
          </PButton>

          <PButton
            @click="handleSubmit(formRef)"
            pType="primary"
            data-testid="submit-btn"
          >
            {{ t('submit') }}
          </PButton>
        </template>
        <template v-else>
          <PButton
            @click="closeDrawer"
            pPlain
            pType="primary"
            data-testid="close-btn"
          >
            {{ t('close') }}
          </PButton>
        </template>
      </div>
    </template>
  </PDrawer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, reactive, ref, defineProps, defineEmits, onMounted } from 'vue'
import {
  PButton,
  PDrawer,
  PForm,
  PFormItem,
  PInput,
  PNotification,
  PUserCard,
  PTag,
  PICheck,
  PIX,
} from '@kpmg/styleguide'
import type { FormInstance, FormRules } from '@kpmg/styleguide'
import type { Props } from './types'
import { getContactById, patchContact } from '@/services/contact'
import type { Contact, PatchContactPayload } from '@/services/contact/contactTypes'
import { handleRequestError } from '@/helper'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const emits = defineEmits<{
  'update:modelValue': [boolean]
  'contact-patched': [Contact]
}>()

const props = defineProps<Props>()

const drawerModel = computed({
  get: () => props.hasDrawerOpened,
  set: value => emits('update:modelValue', value),
})

const userInfo = ref<Contact>()
const fullName = computed(() => `${userInfo.value?.firstName ?? ''} ${userInfo.value?.lastName ?? ''}`)
// Form part
const formRef = ref<FormInstance>()
const formValues = reactive<PatchContactPayload>({
  firstName: undefined,
  lastName: undefined,
  landPhone: undefined as string | undefined,
  mobilePhone: undefined as string | undefined,
})

const resetForm = () => {
  initialiseForms()
}

const handleSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  const isValid = await formEl.validate()
  if (isValid) {
    try {
      const pachedContact = await patchContact(props.userId, formValues)
      PNotification({
        message: t('patchSuccess', { fullName: fullName.value }),
        icon: PICheck,
        showClose: true,
        customClass: 'success',
        position: 'bottom-right',
      })
      emits('contact-patched', pachedContact)
    } catch (error) {
      PNotification({
        message: t('patchFailed', { fullName: fullName.value }),
        icon: PIX,
        showClose: true,
        customClass: 'error',
        position: 'bottom-right',
      })
      handleRequestError('fetching contacts', error)
    } finally {
      closeDrawer()
    }
  }
}

const initialiseForms = () => {
  formValues.firstName = userInfo.value?.firstName
  formValues.lastName = userInfo.value?.lastName
  formValues.landPhone = userInfo.value?.landPhone
  formValues.mobilePhone = userInfo.value?.mobilePhone
}

const closeDrawer = () => {
  drawerModel.value = false
}
const rules = reactive<FormRules<PatchContactPayload>>({
  firstName: [{ required: true, message: t('requiredField', { field: t('firstName') }), trigger: 'blur' }],
  lastName: [{ required: true, message: t('requiredField', { field: t('lastName') }), trigger: 'blur' }],
})

onMounted(async () => {
  const response = await getContactById(props.userId)
  userInfo.value = response
  initialiseForms()
})
</script>

<i18n lang="yaml">
  en-US:
    informationsAboutUser: 'User information'
    youCanModify: 'You can modify the following information:'
    lastName: 'Last name'
    firstName: 'First name'
    mobilePhone: 'Mobile phone'
    landPhone: 'Land phone'
    cancel: 'Cancel'
    submit: 'Submit'
    patchSuccess: "{fullName}'s information has been successfully updated."
    close: 'Close'
    requiredField: 'mandatory field'
    patchFailed: "{fullName}'s information was not updated due to a technical error."
  fr-FR:
    informationsAboutUser: "Information de l'utilisateur"
    youCanModify: "Vous pouvez modifier les informations suivantes:"
    lastName: 'Nom'
    firstName: "Prénom"
    mobilePhone: "Téléphone portable"
    landPhone: "Téléphone fixe"
    cancel: 'Annuler'
    submit: 'Valider'
    patchSuccess: 'Les informations de {fullName} ont bien été mises à jour.'
    close: 'Fermer'
    requiredField: 'Champ obligatoire'
    patchFailed: "Les informations de {fullName} n'ont pas été mises à jour suite à une erreur technique."
  </i18n>
