<template>
  <PDrawer
    v-model="isDrawerOpened"
    :pTitle="t('title')"
    :pShowPreviousStep="false"
    pSize="33%"
    pDirection="rtl"
    @close-drawer-button="isDrawerOpened = false"
    @open="onOpen"
  >
    <PForm pLabelPosition="top" :pModel="formData">
      <PFieldNumberMultiple
        v-model="formData.targets"
        pFieldType="dropdown"
        pFieldKey="targets"
        pMultiple
        pCollapseTags
        pCollapseTagsTooltip
        :pLabel="t('targets.label')"
        :pPlaceholder="t('targets.placeholder')"
        :pCheckAllLabel="t('checkAll')"
        :pDropdownOptions="targetOptions"
        data-testid="filter-drawer-field-targets"
      />
      <PFieldStringMultiple
        v-model="formData.templates"
        pFieldType="dropdown"
        pFieldKey="templates"
        pMultiple
        pCollapseTags
        pCollapseTagsTooltip
        :pLabel="t('templates.label')"
        :pPlaceholder="t('templates.placeholder')"
        :pCheckAllLabel="t('checkAll')"
        :pDropdownOptions="templateOptions"
        data-testid="filter-drawer-field-templates"
      />
      <PFieldStatusMultiple
        v-model="formData.status"
        pFieldType="radio"
        pFieldKey="status"
        pMultiple
        :pLabel="t('status.label')"
        :pCheckAllLabel="t('checkAll')"
        :pOptions="statusOptions"
        pFlexColumn
        data-testid="filter-drawer-field-status"
      />
      <PFieldBoolean
        v-if="isCollab"
        v-model="formData.mineOnly"
        pFieldType="radio"
        pFieldKey="mineOnly"
        :pLabel="t('mineOnly.label')"
        :pOptions="mineOnlyOptions"
        pFlexColumn
        data-testid="filter-drawer-field-mineOnly"
      />
    </PForm>
    <template #footer>
      <div class="flex flex--justify-content-flex-end flex-gap--4">
        <PButton
          pPlain
          pType="primary"
          @click="onClickReset">
          {{ t('reset') }}
        </PButton>
        <PButton pType="primary" @click="onClickApply">
          {{ t('apply') }}
        </PButton>
      </div>
    </template>
  </PDrawer>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { PDrawer, PForm, PField, PButton } from '@pulse/styleguide/components'
import { useI18n } from 'vue-i18n'
import type { Filters, FilterDrawerProps } from './FilterDrawerTypes'
import { getAccountsCollection, getScheduleModels } from '@app/schedule/services'
import type { PDropdownOption, PFieldRadioOptions } from '@pulse/styleguide/types'
import type { Status } from '@app/schedule/models/Deadline'
import { getDefaultFilters } from '@app/schedule/helpers/utils'
import { amplitudeService } from '@pulse/common'

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
  'update:model-value': [value: boolean]
  apply: [Filters]
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
const statusOptions = ref<PFieldRadioOptions[]>([
  {
    pValue: 'Done',
    pLabel: t('status.Done'),
  },
  {
    pValue: 'Todo',
    pLabel: t('status.Todo'),
  },
])

const mineOnlyOptions = ref<PFieldRadioOptions[]>([
  {
    pValue: true,
    pLabel: t('mineOnly.true'),
  },
  {
    pValue: false,
    pLabel: t('mineOnly.false'),
  },
])

onMounted(async () => {
  const accounts = await getAccountsCollection()
  const scheduleModels = getScheduleModels('both', true)

  targetOptions.value = accounts.map(({ id: pValue, name: pLabel }) => ({
    pValue,
    pLabel,
  }))

  templateOptions.value = scheduleModels.map(
    ({ key: pValue, label: pLabel }) => ({
      pValue,
      pLabel,
    }),
  )
  initializeFilters()
})

function onClickReset() {
  formData.value = getDefaultFilters(props.isCollab)
}

function onClickApply() {
  const statuses = formData.value.status?.map((s) => s.toString()) || []
  const targets = formData.value.targets?.map((t) => t.toString()) || []
  const templates = formData.value.templates?.map((t) => t.toString()) || []

  const filters = [
    formData.value.mineOnly ? 'mineOnly' : '',
    ...statuses,
    ...targets,
    ...templates,
  ].filter((s) => s !== '')

  amplitudeService.track('Reminder Filtered', {
    reminder_filter: filters,
  })

  emit('apply', formData.value)
  isDrawerOpened.value = false
}
</script>

<i18n lang="yaml">
en-US:
  title: 'Filters'
  reset: 'Re-initialize'
  apply: 'Apply'
  targets:
    label: 'Targets(s)'
    placeholder: 'Select one or more folders'
  templates:
    label: 'Templates'
    placeholder: 'Select one or more deadline types'
  status:
    label: 'Status'
    Done: 'Done'
    Todo: 'To do'
  mineOnly:
    label: 'Creator'
    true: 'You (by default)'
    false: 'Anyone'
  checkAll: 'Check all'
fr-FR:
  title: 'Filtres'
  reset: 'Réinitialiser'
  apply: 'Appliquer'
  targets:
    label: 'Destinataire(s)'
    placeholder: 'Sélectionner un ou plusieurs dossiers'
  templates:
    label: 'Modèle'
    placeholder: 'Sélectionner un ou plusieurs types de rappel'
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
