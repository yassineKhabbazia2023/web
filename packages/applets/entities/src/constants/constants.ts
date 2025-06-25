import { EntityStatus } from '@entities/pages/wallet/components/Filters/FiltersTypes'
import type { DefineDateTimeFormat } from 'vue-i18n'
import { IconName, PFilterOptionProps } from '@pulse/styleguide/types'
import { ReportTypeEnum, ReportTypeLabelEnum } from '@entities/common/types/BIReports.enums'
import { ReportTypeTag } from '@entities/pages/wallet/pages/biReportsList/components/ReportErrorDrawer/components/ReportErrorCard/report-error-card.type'

export const DATE_TIME_FORMATS = {
  'en-US': {
    short: {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    },
    long: {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    },
  },
  'fr-FR': {
    short: {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    },
    long: {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    },
  },
} as Record<string, DefineDateTimeFormat>

export const PAGE_SIZES = [15, 30, 45, 60]

export const ENTITY_STATUS_COLOR: Record<EntityStatus, PFilterOptionProps['pColor']> = {
  [EntityStatus.TO_DEPLOY]: 'warning',
  [EntityStatus.IN_PROGRESS]: 'fuschia',
  [EntityStatus.CONNECTED]: 'success',
}

export const ENTITY_STATUS_ICON_NAME: Record<EntityStatus, IconName> = {
  [EntityStatus.TO_DEPLOY]: 'arrowUpCircle',
  [EntityStatus.IN_PROGRESS]: 'arrowRepeat',
  [EntityStatus.CONNECTED]: 'checkCircle',
}

export const REPORT_TYPES: Record<ReportTypeEnum, ReportTypeTag> = {
  [ReportTypeEnum.LOOP]: { text: ReportTypeLabelEnum.LOOP, iconName: 'loopColor' },
  [ReportTypeEnum.SILAE]: { text: ReportTypeLabelEnum.SILAE, iconName: 'silaeColor' },
  [ReportTypeEnum.FORMS]: { text: ReportTypeLabelEnum.FORMS, iconName: 'clipboardData' },
  [ReportTypeEnum.PAYFIT]: { text: ReportTypeLabelEnum.PAYFIT, iconName: 'payfit' },
  [ReportTypeEnum.PENNYLANE]: { text: ReportTypeLabelEnum.PENNYLANE, iconName: 'pennylaneColor' },
  [ReportTypeEnum.ESC]: { text: ReportTypeLabelEnum.ESC, iconName: 'clipboardData' },
  [ReportTypeEnum.RH]: { text: ReportTypeLabelEnum.RH, iconName: 'clipboardData' },
  [ReportTypeEnum.AUT]: { text: ReportTypeLabelEnum.AUT, iconName: 'clipboardData' },
  [ReportTypeEnum.UNKNOWN]: { text: ReportTypeLabelEnum.UNKNOWN, iconName: 'clipboardData' },
}
