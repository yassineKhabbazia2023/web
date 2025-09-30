<template>
  <div class="report-error-card padding-bottom--1">
    <PNotificationCard :pTime="formatDate(detectionDate)">
      <template #text>
        <p class="report-error-card__title font-base font-semibold text-color--jungle-600">
          {{ reportName }}
        </p>
        <p class="report-error-card__id font-base text-color--jungle-400 margin-y--1">
          {{ embedReportId }}
        </p>
        <ul class="report-error-card__message">
          <li
            v-for="(errorMessage, index) in messages"
            :key="index"
          >
            <span
              class="font-large font-normal text-color--neutral-gray-900"
              data-testid="report-error-message"
            >
              {{ errorMessage }}
            </span>
          </li>
        </ul>
      </template>

      <template #tag>
        <PTag
          class="report-error-card__type font-xsmall"
          :pContent="reportTypeTag.text"
          :pIconLeftName="reportTypeTag.iconName"
          pColor="light-blue"
          data-testid="report-error-tag"
        />
      </template>
    </PNotificationCard>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PNotificationCard, PTag } from '@pulse/styleguide/components'
import { REPORT_TYPES } from '@powerbi/constants/report-types.const'
import { DATE_TIME_FORMATS } from '@pulse/common/i18n'
import type { ReportErrorCardProps } from './report-error-card.types'
import { getReportTypeTag } from './report-error-card.utils'

const props = defineProps<ReportErrorCardProps>()

const { d } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  datetimeFormats: DATE_TIME_FORMATS,
})

// Get tag info based on report type
const reportTypeTag = getReportTypeTag(REPORT_TYPES, props.reportType)

const formatDate = (date: string): string => d(date, 'long')
</script>

<style lang="scss" scoped>
::v-deep .p-notification-card {
  pointer-events: none;

  &__time {
    width: auto !important;
  }

  &:hover {
    background: none;
  }
}

.report-error-card__message {
  list-style: none;
}
</style>
