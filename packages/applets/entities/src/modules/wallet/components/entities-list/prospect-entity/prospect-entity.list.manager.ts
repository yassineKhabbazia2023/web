import type { AccessibleMenuItem } from '@entities/types'
import type { PToolboxItemProps } from '@pulse/styleguide/types'
import { ProspectOnboardingStep } from '@entities/modules/wallet/enums'
import { filterAccessibleMenuItems } from '@entities/utils'
import { i18n } from '@pulse/common/i18n'
import type { StepConfig } from './prospect-entity.list.types'
import { PROSPECT_STEP_CONFIG, FALLBACK_STEP_CONFIG } from './prospect-entity.list.consts'
import { ProspectAction } from './prospect-entity.list.enums'

const I18N_KEY = 'entities.wallet.entitiesListProspects'

export class ProspectEntityListManager {
  static getStepConfig(stepCode: ProspectOnboardingStep | null): StepConfig {
    if (stepCode === null) {
      return FALLBACK_STEP_CONFIG
    }

    return PROSPECT_STEP_CONFIG[stepCode]
  }

  static buildMenu(): AccessibleMenuItem[] {
    return [
      {
        pIconName: 'send',
        pValue: i18n.global.t(`${I18N_KEY}.resendActivationEmail`),
        pActionName: ProspectAction.RETRY_MASS_ACTIVATION_EMAIL,
        pState: 'default',
        display: true,
      },
      {
        pIconName: 'trash',
        pValue: i18n.global.t(`${I18N_KEY}.archiveThisProspectAccount`),
        pActionName: ProspectAction.ARCHIVE_PROSPECT,
        pState: 'default',
        display: true,
      },
    ]
  }

  static getMenuElements(): PToolboxItemProps[] {
    return filterAccessibleMenuItems(ProspectEntityListManager.buildMenu())
  }
}
