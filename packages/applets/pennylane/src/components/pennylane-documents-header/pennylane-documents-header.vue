<template>
  <div
    data-testid="pennylane-documents-header"
  >
    <PTitle
      pIconName="pulse"
      pIconSize="30"
      :pIconColor="AppColors.JUNGLE_400"
      :pTitle="title"
    />

    <div
      v-if="lastSynchroDate !== undefined"
      class="
        pennylane-documents-header__last-synchro
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
import { AppColors, useResponsive } from '@pulse/styleguide'
import { PIcon, PTitle } from '@pulse/styleguide/components'
import { DATE_TIME_FORMATS as datetimeFormats } from '@pulse/common/constants'
import { PennylaneDocumentsHeaderProps } from './pennylane-documents-header.type'
import { getDayLabel } from './pennylane-documents-header.helper'

const { t, d } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  datetimeFormats,
  messages: {
    'en-US': {
      title: 'Last RYDGE Conseil documents',
      titleMobile: 'Last documents',
      lastSynchroDate: 'Last synchronization',
      at: 'at',
      today: 'Today',
      on: 'On',
    },
    'fr-FR': {
      title: 'Derniers documents RYDGE Conseil',
      titleMobile: 'Derniers documents',
      lastSynchroDate: 'Dernière synchronisation',
      at: 'à',
      today: 'Aujourd\'hui',
      on: 'Le',
    },
  },
})

const props = defineProps<PennylaneDocumentsHeaderProps>()

const { isMobile } = useResponsive()

const title = computed(() => isMobile.value ? t('titleMobile') : t('title'))

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


<style scoped lang="scss">
@use '@pulse/styleguide/scss/breakpoints' as breakpoints;

.pennylane-documents-header__last-synchro {
  @include breakpoints.media(xs) {
    margin-left: 0;
    font-size: 1.2rem;
  }
}
</style>
