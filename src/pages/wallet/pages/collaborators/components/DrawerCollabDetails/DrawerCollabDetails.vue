<template>
  <PDrawer
    v-model="drawerModel"
    :pTitle="t('informationsAboutCollaborator')"
    @close-drawer-button="drawerModel = false"
  >
    <PUserCard
      class="margin-bottom--6"
      pAssetLeft="Image"
      pAssetContent="user-male"
      :pTitle="rowData.fullName"
      :pSubtitle="rowData.email"
    >
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
      @submit.prevent="handleSubmit(formRef)"
      ref="formRef"
      :pModel="formValues"
      pLabelPosition="top"
    >
      <PFormItem
        prop="lastName"
        :pLabel="t('lastName')"
      >
        <PInput
          :value="rowData.lastName"
          disabled
          pName="lastName"
        />
      </PFormItem>

      <PFormItem
        prop="firstName"
        :pLabel="t('firstName')"
      >
        <PInput
          :value="rowData.firstName"
          disabled
          pName="firstName"
        />
      </PFormItem>

      <PFormItem
        prop="email"
        :pLabel="t('email')"
      >
        <PInput
          :value="rowData.email"
          disabled
          pName="email"
        />
      </PFormItem>

      <PFormItem
        prop="mobilePhone"
        :pLabel="t('mobilePhone')"
      >
        <PInput
          v-model="formValues.mobilePhone"
          :pPlaceholder="t('mobilePhone')"
          pName="mobilePhone"
        />
      </PFormItem>

      <PFormItem
        prop="landPhone"
        :pLabel="t('landPhone')"
      >
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
          pPlain
        >
          {{ t('cancel') }}
        </PButton>

        <PButton
          @click="handleSubmit(formRef)"
          pType="primary"
        >
          {{ t('submit') }}
        </PButton>
      </div>
    </template>
  </PDrawer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, reactive, ref } from 'vue'
import {
  PButton,
  PDrawer,
  PForm,
  PFormItem,
  PICheck,
  PInput,
  PNotification,
  PTag,
  PUserCard
} from '@kpmg/styleguide'
import type { FormInstance } from '@kpmg/styleguide'
import type Props from './types'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const emit = defineEmits(['update:modelValue'])

const props = defineProps<Props>()

const drawerModel = computed({
  get: () => props.hasDrawerOpened,
  set: value => emit('update:modelValue', value)
})

// Form part
const formRef = ref<FormInstance>()
const formValues = reactive({
  mobilePhone: props.rowData.mobilePhone,
  landPhone: props.rowData.landPhone
})

const handleReset = () => {
  drawerModel.value = false
}

const handleSubmit = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  drawerModel.value = false

  PNotification({
    message: t('notificationSuccess', { fullName: props.rowData.fullName }),
    icon: PICheck,
    showClose: true,
    customClass: 'success',
    position: 'bottom-right'
  })
}
</script>

<!-- eslint-disable-->
<i18n lang="yaml">
en-US:
  informationsAboutCollaborator: 'Collaborator information'
  youCanModify: 'As an {administrator}, you can modify the name, first name and email of your colleague directly in IBS.'
  administrator: 'administrator'
  lastName: 'Last name'
  firstName: 'First name'
  email: 'Email'
  mobilePhone: 'Mobile phone'
  landPhone: 'Land phone'
  cancel: 'Cancel'
  submit: 'Submit'
  notificationSuccess: "{fullName}'s information has been successfully updated."
fr-FR:
  informationsAboutCollaborator: 'Informations du collaborateur'
  youCanModify: "En tant qu'{administrator}, vous pouvez modifier le nom, le prénom et le mail de votre collaborateur directement dans IBS."
  administrator: 'administrateur'
  lastName: 'Nom'
  firstName: "Prénom"
  email: 'Mail'
  mobilePhone: "Téléphone mobile"
  landPhone: "Téléphone fixe"
  cancel: 'Annuler'
  submit: 'Valider'
  notificationSuccess: 'Les informations de {fullName} ont bien été mises à jour.'
</i18n>
<!-- eslint-enable-->
