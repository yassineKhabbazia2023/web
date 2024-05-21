<template>
  <div
    class="widget-active-day flex flex--direction-column flex-gap--2"
    data-testid="widget-active-day"
  >
    <p
      class="
        widget-active-day__long-date
        font-small
        text-color--neutral-gray-500
        text-center
      "
      data-testid="widget-active-day-long-date"
    >
      {{ d(activeDate, 'longDate') }}
    </p>
    <div
      v-if="hasData"
    >
      <WidgetDeadlines
        :deadlines="deadlines"
        @select-deadline="$emit('select-deadline', $event)"
      />
    </div>
    <div
      v-if="!hasData"
      class="
        widget-active-day__no-data
        flex
        flex--direction-column
        flex-gap--2
        flex--align-self-center
      "
      data-testid="widget-active-day-no-data"
    >
      <PImage
        pType="paupulse"
        pName="empty"
        pFit="fill"
      />
      <p
        class="
          text-center
          font-semibold
          text-color--neutral-gray-900
        "
      >
        {{ t('no-data-title') }}
      </p>
      <p
        class="
          text-center
          font-small
          text-color--neutral-gray-500
        "
      >
        {{ t('no-data-subtitle') }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { WidgetActiveDayProps } from './WidgetActiveDayTypes'
import { useI18n, type DefineDateTimeFormat } from 'vue-i18n'
import { PImage } from '@kpmg/styleguide'
import WidgetDeadlines from '@/schedule/components/WidgetDeadlines'

const datetimeFormats = {
  'en-US': {
    longDate: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    },
  },
  'fr-FR': {
    longDate: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    },
  },
} as Record<string, DefineDateTimeFormat>

const { t, d } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  datetimeFormats,
})

defineEmits<{
  'select-deadline': [occurrenceId: number]
}>()

const props = defineProps<WidgetActiveDayProps>()

const hasData = computed(() => props.deadlines.length > 0)
</script>

<style lang="scss" scoped>
.widget-active-day {
  margin: 40px 0 0;

  &__long-date {
    &::first-letter {
      text-transform: capitalize;
    }
  }

  &__no-data {
    width: 220px;
  }
}
</style>

<i18n lang="yaml">
  en-US:
    no-data-title: 'No events planned'
    no-data-subtitle: 'Relax, you have nothing planned today!'
  fr-FR:
    no-data-title: 'Aucun évènement planifié'
    no-data-subtitle: 'Détendez-vous, vous n’avez rien de prévu ce jour !'
</i18n>
