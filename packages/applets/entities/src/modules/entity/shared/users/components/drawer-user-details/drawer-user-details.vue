<template>
  <PDrawer
    v-model="drawerModel"
    :pTitle="t('informationsAboutUser')"
    @close-drawer-button="closeDrawer"
  >
    <PUserCard
      class="margin-bottom--6 user-card"
      pImageName="user-duotone"
      :pTitle="fullName"
      :pSubtitle="userInfo?.email ?? ''"
      pColor="gray"
    >
      <PTag
        pColor="gray"
        pSize="default"
        pIconLeftName="person"
        :pContent="userInfo?.persona?.name ?? ''"
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
      requireAsteriskPosition="right"
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
          :value="mobilePhone"
          pName="mobilePhone"
          pDisabled
        />
      </PFormItem>
    </PForm>

    <template #footer>
      <PDrawerActions
        :pBackCTA="backCTA"
        :pPrimaryCTA="primaryCTA"
        @click-back-cta="closeDrawer"
        @click-primary-cta="handleSubmit(formRef)"
      />
    </template>
  </PDrawer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, reactive, ref, onMounted } from 'vue'
import {
  PDrawer,
  PDrawerActions,
  PForm,
  PFormItem,
  PInput,
  PUserCard,
  PTag,
} from '@pulse/styleguide/components'
import { PNotification } from '@pulse/styleguide'
import type { FormInstance, FormRules, PDrawerActionButton } from '@pulse/styleguide/types'
import type { Props } from './drawer-user-details.types'
import { getContactById, patchContact } from '@entities/services/contact'
import type { Contact, PatchContactPayload } from '@entities/services/contact/contactTypes'
import { handleRequestError } from '@entities/helpers'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      informationsAboutUser: 'User information',
      youCanModify: 'You can modify the following information:',
      lastName: 'Last name',
      firstName: 'First name',
      mobilePhone: 'Mobile phone',
      landPhone: 'Land phone',
      cancel: 'Cancel',
      submit: 'Submit',
      patchSuccess: '{fullName}\'s information has been successfully updated.',
      requiredField: 'mandatory field',
      patchFailed: '{fullName}\'s information was not updated due to a technical error.',
    },
    'fr-FR': {
      informationsAboutUser: 'Informations de l\'utilisateur',
      youCanModify: 'Vous pouvez modifier les informations suivantes :',
      lastName: 'Nom',
      firstName: 'Prénom',
      mobilePhone: 'Téléphone mobile',
      landPhone: 'Téléphone fixe',
      cancel: 'Annuler',
      submit: 'Valider',
      patchSuccess: 'Les informations de {fullName} ont bien été mises à jour.',
      requiredField: 'Champ obligatoire',
      patchFailed: 'Les informations de {fullName} n\'ont pas été mises à jour suite à une erreur technique.',
    },
  },
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

const backCTA = computed<PDrawerActionButton>(() => ({
  pLabel: t('cancel'),
  pTestId: 'cancel-btn',
}))
const primaryCTA = computed<PDrawerActionButton | undefined>(() =>
  props.editMode ? { pLabel: t('submit'), pTestId: 'submit-btn' } : undefined,
)

const userInfo = ref<Contact>()
const mobilePhone = ref<string | undefined>()
const fullName = computed(() => `${userInfo.value?.firstName ?? ''} ${userInfo.value?.lastName ?? ''}`)
// Form part
const formRef = ref<FormInstance>()
const formValues = reactive<PatchContactPayload>({
  firstName: undefined,
  lastName: undefined,
  landPhone: undefined as string | undefined,
})

const handleSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  const isValid = await formEl.validate()
  if (isValid) {
    try {
      const updatedUserDetails = await patchContact(props.userId, props.entityId, formValues)
      PNotification({
        message: t('patchSuccess', { fullName: fullName.value }),
        iconName: 'check',
        showClose: true,
        customClass: 'success',
        position: 'bottom-right',
      })
      emits('contact-patched', updatedUserDetails)
    } catch (error) {
      PNotification({
        message: t('patchFailed', { fullName: fullName.value }),
        iconName: 'x',
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
  mobilePhone.value = userInfo.value?.mobilePhone
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

