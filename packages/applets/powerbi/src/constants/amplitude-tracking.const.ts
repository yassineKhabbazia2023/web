import { ReportTypeEnum } from '@powerbi/enums/bi-reports.enum'
import { AmplitudePowerBIDepositType } from '@powerbi/enums/amplitude-tracking.enum'

export const AMPLITUDE_DEPOSIT_TYPE_MAPPING: Record<ReportTypeEnum, AmplitudePowerBIDepositType> = {
  [ReportTypeEnum.LOOP]: AmplitudePowerBIDepositType.FINANCIER,
  [ReportTypeEnum.PENNYLANE]: AmplitudePowerBIDepositType.PENNYLANE,
  [ReportTypeEnum.SILAE]: AmplitudePowerBIDepositType.SILAE,
  [ReportTypeEnum.PAYFIT]: AmplitudePowerBIDepositType.PAYFIT,
  [ReportTypeEnum.FORMS]: AmplitudePowerBIDepositType.FORMS,
  [ReportTypeEnum.RH]: AmplitudePowerBIDepositType.PERSONNALISE,
  [ReportTypeEnum.ESC]: AmplitudePowerBIDepositType.PERSONNALISE,
  [ReportTypeEnum.AUT]: AmplitudePowerBIDepositType.PERSONNALISE,
  [ReportTypeEnum.UNKNOWN]: AmplitudePowerBIDepositType.PERSONNALISE,
}
