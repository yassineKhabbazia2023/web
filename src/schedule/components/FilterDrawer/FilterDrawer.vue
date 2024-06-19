<template>
  <PDrawer
    v-model="isDrawerOpened"
    :pTitle="t('title')"
    :pShowPreviousStep="false"
    pSize="33%"
    pDirection="rtl"
    @close-drawer-button="onClickClose"
    @open="onOpen"
  >
    <PForm
      pLabelPosition="top"
      :pModel="formData"
    >
      <PFieldNumberMultiple
        v-model="formData.targets"
        pFieldType="dropdown"
        pFieldKey="targets"
        pMultiple
        :pLabel="t('targets')"
        :pCheckAllLabel="t('checkAll')"
        :pDropdownOptions="targetOptions"
      />
      <PFieldStringMultiple
        v-model="formData.templates"
        pFieldType="dropdown"
        pFieldKey="templates"
        pMultiple
        :pLabel="t('templates')"
        :pCheckAllLabel="t('checkAll')"
        :pDropdownOptions="templateOptions"
      />
      <PFieldStatusMultiple
        v-model="formData.status"
        pFieldType="dropdown"
        pFieldKey="status"
        pMultiple
        :pLabel="t('status.label')"
        :pCheckAllLabel="t('checkAll')"
        :pDropdownOptions="statusOptions"
      />
      <PFieldBoolean
        v-model="formData.mineOnly"
        pFieldType="dropdown"
        pFieldKey="mineOnly"
        :pLabel="t('mineOnly.label')"
        :pDropdownOptions="mineOnlyOptions"
      />
    </PForm>
    <template #footer>
      <div
        class="
          flex
          flex--justify-content-flex-end
          flex-gap--4
        "
      >
        <PButton
          pPlain
          pType="default"
          @click="onClickClose"
        >
          {{ t('close') }}
        </PButton>
        <PButton
          pType="primary"
          @click="onClickApply"
        >
          {{ t('apply') }}
        </PButton>
      </div>
    </template>
  </PDrawer>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import {
  PDrawer,
  PForm,
  PField,
  PButton,
} from '@kpmg/styleguide'
import { useI18n } from 'vue-i18n'
import type { Filters, FilterDrawerProps } from './FilterDrawerTypes'
import { getAccountsCollection, getScheduleModels } from '@/schedule/services'
import type { PDropdownOption } from '@kpmg/styleguide'
import type { Status } from '@/schedule/models/Deadline'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const PFieldStringMultiple = PField<string[]>
const PFieldNumberMultiple = PField<number[]>
const PFieldStatusMultiple = PField<Status[] | undefined>
const PFieldBoolean = PField<boolean>

const formData = ref<Filters>({
  targets: [],
  templates: [],
  status: [],
  mineOnly: true,
})

const emit = defineEmits<{
  'update:model-value' : [value: boolean]
  'apply': [Filters]
}>()

const props = defineProps<FilterDrawerProps>()

const isDrawerOpened = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:model-value', value)
  },
})

function initializeFilters() {
  formData.value.targets = props.targets
  formData.value.templates = props.templates
  formData.value.status = props.status
  formData.value.mineOnly = props.mineOnly
}

function onOpen() {
  initializeFilters()
}

const targetOptions = ref<PDropdownOption[]>([])
const templateOptions = ref<PDropdownOption[]>([])
const statusOptions = ref<PDropdownOption[]>([{
  pValue: 'Done',
  pLabel: t('status.Done'),
}, {
  pValue: 'Todo',
  pLabel: t('status.Todo'),
}])

const mineOnlyOptions = ref<PDropdownOption[]>([{
  pValue: true,
  pLabel: t('mineOnly.true'),
}, {
  pValue: false,
  pLabel: t('mineOnly.false'),
}])

onMounted(async () => {
  const accounts = await getAccountsCollection()
  const scheduleModels = getScheduleModels('both')

  targetOptions.value = accounts
    .map(({ id: pValue, name: pLabel }) => ({
      pValue,
      pLabel,
    }))

  templateOptions.value = scheduleModels
    .map(({ key: pValue, label: pLabel }) => ({
      pValue,
      pLabel,
    }))
  initializeFilters()
})

function onClickClose() {
  isDrawerOpened.value = false
}

function onClickApply() {
  emit('apply', formData.value)
  isDrawerOpened.value = false
}
</script>

<i18n lang="yaml">
  en-US:
    title: 'Filters'
    close: 'Close'
    apply: 'Apply'
    targets: 'Targets(s)'
    status:
      label: 'Status'
      Done: 'Done'
      Todo: 'To do'
    mineOnly:
      label: 'Creator'
      true: 'You (by default)'
      false: 'Anyone'
    templates: 'Template'
    checkAll: 'Check all'
  fr-FR:
    title: 'Filtres'
    close: 'Fermer'
    apply: 'Appliquer'
    targets: 'Destinataire(s)'
    templates: 'Modèle'
    status:
      label: 'Statut'
      Done: 'Fait'
      Todo: 'En attente'
    mineOnly:
      label: 'Créateur'
      true: 'Vous (par défaut)'
      false: 'Tout le monde'
    checkAll: 'Tout sélectionner'
</i18n>
