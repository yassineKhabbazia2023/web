import type { AccessibleMenuItem } from '@entities/types'
import type { PToolboxItemProps } from '@pulse/styleguide/types'
import { ProspectProgressStatus } from '@entities/modules/wallet/enums'
import { filterAccessibleMenuItems } from '@entities/utils'
import { i18n } from '@pulse/common/i18n'
import { isNullOrEmpty } from '@pulse/toolbox/utils/validator'
import type { ProspectProgressStatusConfig } from './prospect-entity.list.types'
import { PROSPECT_PROGRESS_STATUS_CONFIG, FALLBACK_PROSPECT_PROGRESS_STATUS_CONFIG } from './prospect-entity.list.consts'
import { ProspectAction } from './prospect-entity.list.enums'

const I18N_KEY = 'entities.wallet.entitiesListProspects'

export class ProspectEntityListManager {
  static getProgressStatusConfig(progressStatus: ProspectProgressStatus | null): ProspectProgressStatusConfig {
    if (isNullOrEmpty(progressStatus)) {
      return FALLBACK_PROSPECT_PROGRESS_STATUS_CONFIG
    }

    return PROSPECT_PROGRESS_STATUS_CONFIG[progressStatus]
  }

  static buildMenu(): AccessibleMenuItem[] {
    return [
      {
        pIconName: 'send',
        pValue: i18n.global.t(`${I18N_KEY}.inviteProspectToTheirSpace`),
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
