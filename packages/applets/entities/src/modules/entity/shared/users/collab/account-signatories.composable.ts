import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { logger } from '@pulse/toolbox'
import { isNullOrEmpty } from '@pulse/toolbox/utils/validator'
import { displayNotification } from '@pulse/styleguide'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import { useCurrentEntityStore } from '@pulse/common/stores'
import { getAccountSignatories, updateSignatoryStatus } from '@entities/services/account'
import { UserActions } from '@entities/enums'
import type { PToolboxItemProps } from '@pulse/styleguide/types'
import type { AccountSignatories } from '@entities/services/account/account.type'
import type { User } from '@entities/types'
import type { UseAccountSignatoriesOptions } from './account-signatories.types'

const I18N_KEY = 'entities.users.signatory'

export function useAccountSignatories({ refreshUsers }: UseAccountSignatoriesOptions) {
  const { t } = useI18n({ useScope: 'global' })

  const currentEntityStore = useCurrentEntityStore()
  const { currentEntityId } = storeToRefs(currentEntityStore)

  const accountSignatories = ref<AccountSignatories[]>([])

  function hasMultipleSignatories() {
    return accountSignatories.value.length > 1
  }

  async function loadAccountSignatories() {
    if (isNullOrEmpty(currentEntityId.value)) {
      return
    }
    try {
      const signatories = await getAccountSignatories(currentEntityId.value)
      accountSignatories.value.length = 0
      accountSignatories.value.push(...signatories)
    } catch (error) {
      logger.error(error)
    }
  }

  function getSignatoryToolboxItems(userRow: User): PToolboxItemProps[] {
    if (userRow.isSignatory) {
      const tooltipContent = hasMultipleSignatories() === false ? t(`${I18N_KEY}.deleteTooltip`) : undefined
      return [
        {
          pIconName: 'patchCheck',
          pValue: t(`${I18N_KEY}.remove`),
          pActionName: UserActions.UNASSIGN_SIGNATORY,
          pState: 'default',
          disabled: hasMultipleSignatories() === false,
          pContentTooltip: tooltipContent,
        },
      ]
    }

    return [
      {
        pIconName: 'patchCheck',
        pValue: t(`${I18N_KEY}.assign`),
        pActionName: UserActions.ASSIGN_SIGNATORY,
        pState: 'default',
      },
    ]
  }

  async function updateSignatory(userRow: User, isSignatory: boolean) {
    if (isNullOrEmpty(currentEntityId.value)) {
      return
    }

    try {
      await updateSignatoryStatus(currentEntityId.value, userRow.contactId, isSignatory)
      await refreshUsers()
      await loadAccountSignatories()

      const messageKey = isSignatory ? 'added' : 'removed'
      displayNotification('success', t(`${I18N_KEY}.${messageKey}`, { userFullName: userRow.fullName }), 'bottom-right')

      AmplitudeService.track('Signatory Updated', {
        signatory_status_after_update: isSignatory ? 'On' : 'Off',
        signatory_target_mail: userRow.email,
      })
    } catch (error) {
      logger.error(error)
      displayNotification('error', t(`${I18N_KEY}.technicalError`), 'bottom-right')
    }
  }

  function handleSignatoryAction(action: string, userRow: User): boolean {
    if (action === UserActions.ASSIGN_SIGNATORY) {
      updateSignatory(userRow, true)
      return true
    }

    if (action === UserActions.UNASSIGN_SIGNATORY) {
      updateSignatory(userRow, false)
      return true
    }

    return false
  }

  return {
    loadAccountSignatories,
    getSignatoryToolboxItems,
    handleSignatoryAction,
  }
}
