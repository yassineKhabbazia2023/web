import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { logger } from '@pulse/toolbox'
import { isNullOrEmpty } from '@pulse/toolbox/utils/validator'
import { displayNotification } from '@pulse/styleguide'
import { useCurrentEntityStore } from '@pulse/common/stores'
import { AccountType } from '@pulse/common/enums'
import { inviteCustomers } from '@entities/services/contact'
import { UserActions } from '@entities/enums'
import type { PToolboxItemProps } from '@pulse/styleguide/types'
import type { User } from '@entities/types'
import type { UseInviteUserOptions } from './invite-user.types'
import { InviteUserTracking } from '../services/invite-user.tracking.service'

const I18N_KEY = 'entities.users.inviteUser'
// The actions are worded exactly as the ones of the matching wallet lists
const I18N_PROSPECT_ACTION_KEY = 'entities.wallet.entitiesListProspects.inviteProspectToTheirSpace'
const I18N_REGULAR_ACTION_KEY = 'entities.wallet.entitiesListRegular.resendActivationEmail'

export function useInviteUser({ refreshUsers }: UseInviteUserOptions) {
  const { t } = useI18n({ useScope: 'global' })

  const currentEntityStore = useCurrentEntityStore()
  const { currentEntityId, currentAccountType } = storeToRefs(currentEntityStore)

  const inviteUserToolboxItems = computed<PToolboxItemProps[]>(() => {
    const isProspectEntity = currentAccountType.value === AccountType.PROSPECT

    return [
      {
        pIconName: 'send',
        pValue: isProspectEntity ? t(I18N_PROSPECT_ACTION_KEY) : t(I18N_REGULAR_ACTION_KEY),
        pActionName: UserActions.INVITE_USER,
        pState: 'default',
      },
    ]
  })

  async function inviteUser(userRow: User) {
    if (isNullOrEmpty(currentEntityId.value)) {
      return
    }

    try {
      await inviteCustomers([userRow.contactId], currentEntityId.value, currentAccountType.value)
      await refreshUsers()

      displayNotification('success', t(`${I18N_KEY}.success`))

      InviteUserTracking.trackOnboardingRelaunchedSuccess()
    } catch (error) {
      logger.error(error)
      displayNotification('error', t(`${I18N_KEY}.error`))

      InviteUserTracking.trackOnboardingRelaunchedFail()
    }
  }

  function handleInviteUserAction(action: string, userRow: User): boolean {
    if (action === UserActions.INVITE_USER) {
      inviteUser(userRow)

      return true
    }

    return false
  }

  return {
    inviteUserToolboxItems,
    handleInviteUserAction,
  }
}
