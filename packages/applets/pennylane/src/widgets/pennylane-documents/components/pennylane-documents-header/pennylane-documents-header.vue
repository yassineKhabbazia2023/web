<template>
  <div
    data-testid="pennylane-documents-header"
  >
    <div
      class="
        flex
      "
    >
      <PIcon
        pName="pulse"
        :pColor="AppColors.PRIMARY"
        pSize="30"
      />
      <span class="h3 margin-left--1 font-semibold">
        {{ t('title') }}
      </span>
    </div>

    <div
      v-if="lastSynchroDate !== undefined"
      class="
        margin-left--8
        margin-top--1
        flex
        flex--align-items-center
        text-color--neutral-gray-500
      "
    >
      <PIcon
        pName="arrowRepeat"
        pSize="16"
      />
      <span class="margin-left--1">
        {{ t('lastSynchroDate') }} :
        <span>
          {{ dayLabel }}
          {{ t('at') }}
          {{ d(lastSynchroDate, 'time') }}
        </span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { AppColors } from '@pulse/styleguide'
import { PIcon } from '@pulse/styleguide/components'
import { DATE_TIME_FORMATS as datetimeFormats } from '@pulse/common/constants'
import { PennylaneDocumentsHeaderProps } from './pennylane-documents-header.types'
import { getDayLabel } from './pennylane-documents-header.utils'

const { t, d } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  datetimeFormats,
})

const props = defineProps<PennylaneDocumentsHeaderProps>()

const dayLabel = computed(() => {
  const lastSynchroDate = props.lastSynchroDate
  const formattedLastSynchroDate = lastSynchroDate === undefined
    ? ''
    : d(lastSynchroDate, 'shortDate')

  return getDayLabel({
    lastSynchroDate,
    formattedLastSynchroDate,
    onLabel: t('on'),
    todayLabel: t('today'),
  })
})
</script>

<i18n lang="yaml">
  en-US:
    title: 'Last RYDGE Conseil documents'
    lastSynchroDate: 'Last synchrozation'
    at: 'at'
    today: 'Today'
    on: 'On'
  fr-FR:
    title: 'Derniers documents RYDGE Conseil'
    lastSynchroDate: 'Dernière synchronisation'
    at: 'à'
    today: 'Aujourd’hui'
    on: 'Le'
</i18n>
