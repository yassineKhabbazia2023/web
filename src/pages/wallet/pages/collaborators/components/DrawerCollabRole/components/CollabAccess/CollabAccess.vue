<template>
  <div class="collab-access">
    <i18n-t
      keypath="setOfRights"
      tag="p"
    >
      <template #role>
        <span class="font-bold">{{ selectedCollabRole }}</span>
      </template>
    </i18n-t>

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
      v-if="!state.isLoading && state.accesses?.length"
      @submit.prevent="handleSubmit(formRef)"
      ref="formRef"
    >
      <PFormItem
        v-for="({ id, name }, index) in state.accesses"
        :key="id"
        class="collab-access__switch-wrapper"
      >
        <PSwitch
          @update:model-value="(val) => handleModelUpdate({ val, index })"
          :modelValue="state.accesses[index].selected"
          :pActiveText="name"
          class="margin-right--4"
        />
      </PFormItem>
    </PForm>

    <Teleport to=".el-drawer__footer">
      <div class="margin-left--auto">
        <PButton
          @click="handleGoToPreviousStep"
          class="margin-right--4"
          pType="primary"
          pPlain
        >
          {{ t('previous') }}
        </PButton>

        <PButton
          @click="handleSubmit(formRef)"
          pType="primary"
        >
          {{ t('submit') }}
        </PButton>
      </div>
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { onMounted, reactive, ref } from 'vue'
import {
  PButton,
  PForm,
  PFormItem,
  PSwitch,
  PLoader
} from '@kpmg/styleguide'
import type { FormInstance } from '@kpmg/styleguide'
import type { Props, State } from './types'
import mock from './mock.json'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const emit = defineEmits(['goToPreviousStep', 'setAccesses'])

defineProps<Props>()

const state: State = reactive({
  isLoading: undefined,
  accesses: undefined
})

const fetchAccesses = async () => {
  state.isLoading = true

  try {
    // mock = API GET /wallet/collabs/{collab-id}/personas/{persona-id}/permissions
    const { data } = await Promise.resolve(JSON.parse(JSON.stringify(mock)))
    state.accesses = data
  } catch (err) {
    console.error(err)
  }

  state.isLoading = false
}

const formRef = ref<FormInstance>()

const handleGoToPreviousStep = () => {
  emit('goToPreviousStep')
}

const handleSubmit = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  if (state.accesses) {
    const formValues = state.accesses
      .map(({ id, selected }: { id: number, selected: boolean }) => ({ [id]: selected }))
    const formValuesFormatted = Object.assign({}, ...formValues)

    emit('setAccesses', formValuesFormatted)
  }
}

const handleModelUpdate = ({ val, index }: { val: boolean, index: number }) => {
  if (state.accesses) {
    state.accesses[index].selected = val
  }
}

onMounted(async () => {
  await fetchAccesses()
})
</script>

<style lang="scss" scoped>
.collab-access__switch-wrapper {
  padding: 12px 10px;

  &:not(:last-child) {
    border-bottom: 1px solid var(--el-border-color);
    margin-bottom: 20px;
  }
}
</style>

<i18n lang="yaml">
en-US:
  setOfRights: 'Here is the set of rights corresponding to the {role} role.'
  youCanModify: "As {administrator}, you can modify your collaborator's permissions."
  administrator: 'administrator'
  previous: 'Previous'
  submit: 'Submit'
fr-FR:
  setOfRights: 'Voici le set de droits correspondant au rôle {role}.'
  youCanModify: "En tant qu'{administrator}, vous pouvez modifier les permissions de votre collaborateur."
  administrator: 'administrateur'
  previous: 'Précédent'
  submit: 'Valider'
</i18n>
