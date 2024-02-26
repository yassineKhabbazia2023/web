<template>
<div>
  <i18n-t
    class="margin-bottom--6"
    keypath="youCanModify"
    tag="p"
  >
    <template #administrator>
      <span class="font-bold">{{ t('administrator') }}</span>
    </template>
  </i18n-t>

  <PLoader v-if="state.isLoading" />

  <PForm
    v-if="!state.isLoading && state.roles.length"
    @submit.prevent="handleSubmit(formRef)"
    ref="formRef"
    :pModel="state.formValue"
  >
    <PRadioGroup v-model="state.formValue.selectedRoleId">
      <PRadioCard
        v-for="({ description, id, name }) in state.roles"
        :key="id"
        :pLabel="id"
        :pTitle="name"
        :pDescription="description"
      />
    </PRadioGroup>
  </PForm>

  <Teleport to=".el-drawer__footer">
    <div class="margin-left--auto">
      <PButton
        @click="handleCancel"
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
        {{ t('next') }}
      </PButton>
    </div>
  </Teleport>
</div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { onMounted, reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'
import {
  PButton,
  PForm,
  PLoader,
  PRadioCard,
  PRadioGroup
} from '@kpmg/styleguide'
import type { State } from './types'
import mock from './mock.json'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const emit = defineEmits(['setDrawerNotVisible', 'setSelectedRoleId'])

const state: State = reactive({
  formValue: {
    selectedRoleId: undefined
  },
  isLoading: undefined,
  roles: []
})

const fetchRoles = async () => {
  state.isLoading = true

  try {
    const { data } = await Promise.resolve(mock)
    state.roles = data
    state.formValue.selectedRoleId = data.find(({ selected }) => selected)?.id
  } catch (err) {
    console.error(err)
  }

  state.isLoading = false
}

const formRef = ref<FormInstance>()

const handleCancel = () => {
  emit('setDrawerNotVisible')
}

const handleSubmit = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  emit('setSelectedRoleId', state.formValue.selectedRoleId)
}

onMounted(async () => {
  await fetchRoles()
})
</script>

<i18n lang="yaml">
en-US:
  youCanModify: 'As an {administrator}, you can modify the role of your colleague.'
  administrator: 'administrator'
  cancel: 'Cancel'
  next: 'Next'
fr-FR:
  youCanModify: "En tant qu'{administrator}, vous pouvez modifier le rôle de votre collaborateur."
  administrator: 'administrateur'
  cancel: 'Annuler'
  next: 'Suivant'
</i18n>
