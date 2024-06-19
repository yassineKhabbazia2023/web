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
      <PDropdown
        v-model="formData.templates"
        pMultiple
        :pLabel="t('templates')"
        :pCheckAllLabel="t('checkAll')"
        :pOptions="templates"
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
  PDropdown,
  PButton,
} from '@kpmg/styleguide'
import { useI18n } from 'vue-i18n'
import type { Filters, FilterDrawerProps } from './FilterDrawerTypes'
import { getScheduleModels } from '@/schedule/services'
import type { PDropdownOption } from '@kpmg/styleguide'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

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

const templates = ref<PDropdownOption[]>([])

onMounted(() => {
  const scheduleModels = getScheduleModels('both')
  templates.value = scheduleModels
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
    templates: 'Template'
    checkAll: 'Check all'
  fr-FR:
    title: 'Filtres'
    close: 'Fermer'
    apply: 'Appliquer'
    templates: 'Modèle'
    checkAll: 'Tout sélectionner'
</i18n>
