<template>
  <div class="error padding-bottom--1">
    <PNotificationCard
      :pTime="reformeDate(detectionDate)"
    >
      <template #text>
        <div class="error__name font-base font-semibold text-color--persian-600">
          {{ reportName }}
        </div>
        <div class="error__embedId font-base text-color--persian-400 margin-y--1">
          {{ embedReportId }}
        </div>
        <div class="error__description font-large font-normal text-color--neutral-gray-900">
          {{ messages.join('\n') }}
        </div>
      </template>
      <template #tag>
        <PTag
          data-testid="report-error-tag"
          pColor="amethyste"
          pEffect="light"
          pRound
          :pContent="reportTypeTag.text"
          :pIconLeftName="reportTypeTag.iconName"
          class="error__type font-xsmall text-color--persian-400"
        />
      </template>
    </PNotificationCard>
  </div>
</template>

<script setup lang="ts">
import { PNotificationCard, PTag } from '@pulse/styleguide/components'
import { DATE_TIME_FORMATS as datetimeFormats } from '@entities/constants'
import type { ReportErrorCardProps, ReportTypeTag } from './types/report-error-card.type.ts'
import { ReportTypeEnum , ReportTypeText } from '@entities/common/types/BIReports.enums.ts'
import { useI18n } from 'vue-i18n'
import { getReportTypeTag } from './utils/index.ts'

const props = defineProps<ReportErrorCardProps>()

const REPORT_TYPES: Record<string, ReportTypeTag> = {
  [ReportTypeEnum.LOOP]: { text: ReportTypeText.LOOP, iconName: 'loopColor' },
  [ReportTypeEnum.SILAE]: { text: ReportTypeText.SILAE, iconName: 'silaeColor' },
  [ReportTypeEnum.FORMS]: { text: ReportTypeText.FORMS, iconName: 'clipboardData' },
  [ReportTypeEnum.PAYFIT]: { text: ReportTypeText.PAYFIT, iconName: 'payfit' },
  [ReportTypeEnum.PENNYLANE]: { text: ReportTypeText.PENNYLANE, iconName: 'pennylaneColor' },
  [ReportTypeEnum.ESC]: { text: ReportTypeText.ESC, iconName: 'clipboardData' },
  [ReportTypeEnum.RH]: { text: ReportTypeText.RH, iconName: 'clipboardData' },
  [ReportTypeEnum.AUT]: { text: ReportTypeText.AUT, iconName: 'clipboardData' },
  [ReportTypeEnum.UNKNOWN]: { text: ReportTypeText.UNKNOWN, iconName: 'clipboardData' },
}

const reportTypeTag = getReportTypeTag(REPORT_TYPES, props.reportType)

const { d } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  datetimeFormats,
})

const reformeDate = (date: string): string => {
  return d(date, 'long')
}
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

  .error__description {
    white-space: pre-line
  }
</style>
