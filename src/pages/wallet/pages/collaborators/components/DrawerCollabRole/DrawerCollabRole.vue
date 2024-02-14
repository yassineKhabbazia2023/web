<template>
<PDrawer
  v-model="isDrawerVisible"
  :pTitle="t('manageAccessRights')"
  @close-drawer-button="isDrawerVisible = false"
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

  <PLoader v-if="state.isLoading" />

  <PForm
    v-if="!state.isLoading && state.roles.length"
    @submit.prevent="handleSubmit(formRef)"
    ref="formRef"
    :pModel="state.formValue"
  >
    <PRadioGroup v-model="state.formValue.roleIdSelected">
      <PRadioCard
        v-for="({ description, id, name }) in state.roles"
        :key="id"
        :pLabel="id"
        :pTitle="name"
        :pDescription="description"
      >
        <PButton pType="white">
          {{ t('personalize') }}
          <PIcon class="el-button__icon--right">
            <PIArrowRight />
          </PIcon>
        </PButton>
      </PRadioCard>
    </PRadioGroup>
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
import { computed, onMounted, reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'
import {
  PButton,
  PDrawer,
  PForm,
  PIArrowRight,
  PIcon,
  PICheck,
  PLoader,
  PNotification,
  PRadioCard,
  PRadioGroup,
  PTag,
  PUserCard
} from '@kpmg/styleguide'
import type { State, Props } from './types'
import mock from './mock.json'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const emit = defineEmits(['update:modelValue'])

const props = defineProps<Props>()

const isDrawerVisible = computed({
  get: () => props.hasDrawerOpened,
  set: value => emit('update:modelValue', value)
})

const state: State = reactive({
  formValue: {
    roleIdSelected: undefined
  },
  isLoading: undefined,
  roles: []
})

const fetchRoles = async () => {
  state.isLoading = true

  try {
    const { data } = await Promise.resolve(mock)
    state.roles = data
    state.formValue.roleIdSelected = data.find(({ selected }) => selected)?.id
  } catch (err) {
    console.error(err)
  }

  state.isLoading = false
}

const formRef = ref<FormInstance>()

const handleReset = () => {
  isDrawerVisible.value = false
}

const handleSubmit = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  isDrawerVisible.value = false

  PNotification({
    message: t('notificationSuccess', { fullName: props.rowData.fullName }),
    icon: PICheck,
    showClose: true,
    customClass: 'success',
    position: 'bottom-right'
  })
}

onMounted(async () => {
  await fetchRoles()
})
</script>

<i18n lang="yaml">
en-US:
  manageAccessRights: 'Manage access rights'
  youCanModify: 'As an {administrator}, you can modify the role of your colleague.'
  administrator: 'administrator'
  personalize: 'Personalize'
  cancel: 'Cancel'
  submit: 'Submit'
  notificationSuccess: 'The role of {fullName} has been successfully updated.'
fr-FR:
  manageAccessRights: "Gérer les droits d’accès"
  youCanModify: "En tant qu'{administrator}, vous pouvez modifier le rôle de votre collaborateur."
  administrator: 'administrateur'
  personalize: 'Personnaliser'
  cancel: 'Annuler'
  submit: 'Valider'
  notificationSuccess: 'Le rôle de {fullName} a bien été mis à jour.'
</i18n>
