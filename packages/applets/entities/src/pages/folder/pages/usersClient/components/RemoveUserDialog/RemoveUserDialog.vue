<template>
  <PDialog
    v-model="dialogModel"
    :pTitle="t('removeUser')"
  >
    <p
      class="margin-bottom--6"
      data-testid="remove-user-dialog-confirmation-message"
    >
      {{ confirmationMessage }}
    </p>

    <PUserCard
      v-if="userToRemove"
      class="margin-bottom--2"
      :pAvatarContent="userToRemove.initials"
      :pTitle="userToRemove.fullName"
      :pSubtitle="userToRemove.email"
    />

    <template #footer>
      <div class="p-dialog__footer">
        <PButton
          pType="secondary"
          pSize="small"
          data-testid="dialog-close-button"
          @click="handleCloseDrawer"
        >
          {{ t('cancel') }}
        </PButton>

        <PButton
          pType="primary"
          pSize="small"
          data-testid="remove-user-button"
          @click="handleRemoveUser"
        >
          <PIcon class="el-button__icon--left" pName="personRemove" />
          {{ t('removeUser') }}
        </PButton>
      </div>
    </template>
  </PDialog>
</template>

<script lang="ts" setup>
import { logger } from '@pulse/core'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  PButton,
  PDialog,
  PIcon,
  PUserCard,
} from '@pulse/styleguide/components'
import { PNotification } from '@pulse/styleguide'
import { deleteContactFromAccount } from '@entities/services/account'
import type { RemoveUserDialogProps } from './RemoveUserDialogTypes'
import { RouteParam } from '@pulse/common/enums'
import { RouterHelpers } from '@pulse/common/helpers'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const route = useRoute()
const currentEntityId = RouterHelpers.getRouteParamAsInt(route, RouteParam.ENTITY_ID)

const emits = defineEmits<{
  'update:modelValue': [boolean]
  'user-removed': []
}>()

const props = defineProps<RemoveUserDialogProps>()

const dialogModel = computed({
  get: () => props.modelValue,
  set: value => emits('update:modelValue', value),
})

const confirmationMessage = computed(() => {
  const messageKey = props.isCollab
    ? 'thisAccount.collab'
    : 'thisAccount.client'
  const thisAccount = t(messageKey)

  return t('confirmation', { thisAccount })
})

const handleCloseDrawer = () => {
  dialogModel.value = false
}

const displaySuccessNotificationRemovedCollaborator = () => {
  PNotification({
    message: t('userHasBeenRemoved', { fullName: props.userToRemove?.fullName ?? '' }),
    iconName: 'check',
    showClose: true,
    customClass: 'success',
    position: 'bottom-right',
  })
}

const displayErrorNotificationRemovedCollaborator = () => {
  PNotification({
    message: t('userWasNotRemoved', { fullName: props.userToRemove?.fullName ?? '' }),
    iconName: 'exclamationTriangle',
    showClose: true,
    customClass: 'error',
    position: 'bottom-right',
  })
}

const handleRemoveUser = async () => {
  try {
    // currentEntityId can't be null here, so we use non-null assertion
    await deleteContactFromAccount(currentEntityId!, props.userToRemove?.contactId ?? 0)
    displaySuccessNotificationRemovedCollaborator()
    emits('user-removed')
  } catch (error) {
    displayErrorNotificationRemovedCollaborator()
    logger.error(error)
  }
  dialogModel.value = false
}
</script>

<i18n lang="yaml">
  en-US:
    removeUser: 'Remove user'
    confirmation: >-
      You are about to remove the user from {thisAccount},
       he will no longer be able to access it. Are you sure you want to continue?
    thisAccount:
      collab: 'this folder'
      client: 'this entity'
    cancel: 'Cancel'
    userHasBeenRemoved: 'The user {fullName} has been removed.'
    userWasNotRemoved: 'User {fullName} was not removed from the site due to a technical error.'
  fr-FR:
    removeUser: "Retirer l'utilisateur"
    confirmation: >-
      Vous êtes sur le point de retirer l'utilisateur de {thisAccount},
       il ne pourra plus y accéder. Êtes-vous sûr de vouloir continuer ?
    cancel: 'Annuler'
    thisAccount:
      collab: 'ce dossier'
      client: 'cette entité'
    userHasBeenRemoved: "L'utilisateur {fullName} a bien été retiré."
    userWasNotRemoved: "L'utilisateur {fullName} n'a pas été retiré de l'entité suite à une erreur technique."
</i18n>
