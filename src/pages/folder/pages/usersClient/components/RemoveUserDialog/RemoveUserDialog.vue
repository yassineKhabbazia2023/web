<template>
  <PDialog
    v-model="dialogModel"
    :pTitle="t('removeUser')"
  >
    <p class="p-dialog__text margin-bottom--6">
      {{ t('confirmation') }}
    </p>

    <PUserCard
      class="margin-bottom--2"
      pAssetLeft="Avatar"
      :pAssetContent="userToRemove.initials"
      :pTitle="userToRemove.fullName"
      :pSubtitle="userToRemove.email"
    />

    <template #footer>
      <div class="p-dialog__footer">
        <PButton
          pType="white"
          @click="closeDrawer"
        >
          {{ t('cancel') }}
        </PButton>

        <PButton
          pType="primary"
          @click="handleRemoveUser"
          data-testid="removeUserButton"
        >
          <PIcon class="el-button__icon--left">
            <PIPersonRemove />
          </PIcon>
          {{ t('removeUser') }}
        </PButton>
      </div>
    </template>
  </PDialog>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  PButton,
  PDialog,
  PICheck,
  PIcon,
  PIPersonRemove,
  PIExclamationTriangle,
  PNotification,
  PUserCard,
} from '@kpmg/styleguide'
import { deleteContactFromAccount } from '@/services/account'
import type { RemoveUserDialogProps } from './RemoveUserDialogTypes'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const route = useRoute()
const currentEntityId = Number(route.params.id)

const emits = defineEmits<{
  'update:modelValue': [boolean]
  'userRemoved': [boolean]
}>()

const props = defineProps<RemoveUserDialogProps>()

const dialogModel = computed({
  get: () => props.modelValue,
  set: value => emits('update:modelValue', value),
})

const closeDrawer = () => {
  dialogModel.value = false
}

const displaySuccessNotificationRemovedCollaborator = () => {
  PNotification({
    message: t('userHasBeenRemoved', { fullName: props.userToRemove.fullName }),
    icon: PICheck,
    showClose: true,
    customClass: 'success',
    position: 'bottom-right',
  })
}

const displayErrorNotificationRemovedCollaborator = () => {
  PNotification({
    message: t('userWasNotRemoved', { fullName: props.userToRemove.fullName }),
    icon: PIExclamationTriangle,
    showClose: true,
    customClass: 'error',
    position: 'bottom-right',
  })
}

const handleRemoveUser = async () => {
  try {
    await deleteContactFromAccount(currentEntityId, props.userToRemove.contactId)
    displaySuccessNotificationRemovedCollaborator()
    emits('userRemoved', true)
  } catch (error) {
    displayErrorNotificationRemovedCollaborator()
    console.error(error)
  }
  dialogModel.value = false
}
</script>

<i18n lang="yaml">
  en-US:
    removeUser: 'Remove user'
    confirmation: >-
      You are about to remove the user from this entity,
       he will no longer be able to access it. Are you sure you want to continue?
    cancel: 'Cancel'
    userHasBeenRemoved: 'The user {fullName} has been removed.'
    userWasNotRemoved: 'User {fullName} was not removed from the site due to a technical error.'
  fr-FR:
    removeUser: "Retirer l'utilisateur"
    confirmation: >-
      Vous êtes sur le point de retirer l’utilisateur de cette entité,
       il ne pourra plus y accéder. Êtes-vous sûr de vouloir continuer ?
    cancel: 'Annuler'
    userHasBeenRemoved: "L’utilisateur {fullName} a bien été retiré."
    userWasNotRemoved: "L'utilisateur {fullName} n'a pas été retiré de l’entité suite à une erreur technique."
</i18n>
