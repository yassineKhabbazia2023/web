<template>
  <PDrawer
    v-model="isDrawerOpened"
    :pTitle="shortLabel"
    :pShowPreviousStep="false"
    pSize="33%"
    pDirection="rtl"
    @close-drawer-button="isDrawerOpened = false"
  >
    <template
      v-if="occurrence"
      #header-prefix
    >
      <Tag :status="occurrence?.globalStatus" />
    </template>

    <template
      v-if="longLabel"
      #header-suffix
    >
      <p
        class="padding-left--2 text-color--neutral-gray-700"
        data-testid="occurrence-drawer-long-label"
      >
        {{ longLabel }}
      </p>
    </template>

    <div v-if="isLoading" class="flex flex--justify-content-center">
      <PLoader pType="primary" pSize="32" />
    </div>
    <PForm
      v-if="occurrence"
      pLabelPosition="top"
    >
      <p class="flex flex--align-items-center">
        <PIcon>
          <PICalendarEvent />
        </PIcon>
        <span
          class="
            padding-left--2
            text-color--neutral-gray-900
            occurrence-drawer__occurrence-date
          "
          data-testid="occurrence-drawer-occurrence-date"
        >
          {{ occurrenceDate }}
        </span>

        <span
          v-if="frequencyLabel"
          class="
            padding-left--2
            text-color--neutral-gray-500
          "
          data-testid="occurrence-drawer-frequency-label"
        >
          {{ frequencyLabel }}
        </span>
      </p>
      <DeadlineAccounts
        :title="t('deadlineAccounts')"
        :deadlineAccounts="occurrence.accountList"
        class="margin-top--4"
      />
      <StringField
        v-if="occurrence?.schedule?.description"
        :modelValue="occurrence.schedule.description"
        pFieldKey="description"
        pFieldType="input"
        pType="textarea"
        :pLabel="t('description')"
        pDisabled
        pAutosize
        class="margin-top--4"
        data-testid="occurrence-drawer-description"
      />
      <p
        class="
          margin-top--4
          margin-bottom--2
          font-semibold
          font-small
        "
        data-testid="occurrence-drawer-created-by"
      >
        <span class="text-color--neutral-gray-900">
          {{ t('createdBy') }}
        </span>
        <span class="margin-left--1 text-color--persian-500">
          {{ createdByLabel }}
        </span>
      </p>
    </PForm>

    <template
      v-if="occurrence"
      #footer
    >
      <div
        class="flex flex-align--start"
      >
        <PButton
          pType="danger"
          pPlain
          pSize="default"
          :pLoading="isLoading"
        >
          {{ t('delete') }}
        </PButton>
      </div>
    </template>
  </PDrawer>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getOccurrence, getScheduleModelsByKey } from '@/schedule/services'
import {
  PButton,
  PDrawer,
  PLoader,
  PIcon,
  PICalendarEvent,
  PForm,
  PField,
} from '@kpmg/styleguide'
import { useI18n } from 'vue-i18n'
import type { OccurrenceDrawerProps } from './OccurrenceDrawerTypes'
import type { Occurrence } from '@/schedule/models/Deadline'
import Tag from '@/schedule/components/Common/Tag'
import DeadlineAccounts from '@/schedule/components/DeadlineAccounts'
import {
  getFrequencyLabel,
  getCreatedByLabel,
  getShortLabel,
  getLongLabel,
} from './OccurrenceDrawerHelper'
import { datetimeFormats } from '@/schedule/helpers/datetimeFormatsConsts'

const StringField = PField<string>

const { t, d } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  datetimeFormats,
})

const shortScheduleModelsByKey = ref<Record<string, string>>()
const longScheduleModelsByKey = ref<Record<string, string>>()

const emit = defineEmits<{ 'update:model-value' : [value: boolean] }>()

const props = defineProps<OccurrenceDrawerProps>()

const isLoading = ref(false)
const occurrence = ref<Occurrence>()

const frequencyLabels: Record<string, string> = {
  Monthly: t('frequency.Monthly'),
}

const frequencyLabel = computed(() => getFrequencyLabel(frequencyLabels, occurrence.value))
const createdByLabel = computed(() => getCreatedByLabel(occurrence.value))
const shortLabel = computed(() => getShortLabel(shortScheduleModelsByKey.value, occurrence.value))
const longLabel = computed(() => getLongLabel(longScheduleModelsByKey.value, shortLabel.value, occurrence.value))

const occurrenceDate = computed(() => {
  return occurrence.value
    ? d(new Date(occurrence.value.occurrenceDate), 'longDate')
    : ''
})

const isDrawerOpened = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:model-value', value)
  },
})

onMounted(async () => {
  try {
    isLoading.value = true
    shortScheduleModelsByKey.value = getScheduleModelsByKey('short')
    longScheduleModelsByKey.value = getScheduleModelsByKey('long')
    occurrence.value = await getOccurrence(props.occurrenceId)
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
})
</script>

<style lang="scss" scoped>
.occurrence-drawer {
  &__occurrence-date {
    &::first-letter {
      text-transform: capitalize;
    }
  }
}
</style>

<i18n lang="yaml">
  en-US:
    description: 'Description'
    createdBy: 'Created by'
    deadlineAccounts: 'Accounts'
    delete: 'Delete'
    frequency:
      Monthly: 'Monthly'
  fr-FR:
    description: 'Description'
    createdBy: 'Créé par'
    deadlineAccounts: 'Destinataires'
    delete: 'Supprimer le rappel'
    frequency:
      Monthly: 'Tous les mois'
</i18n>
