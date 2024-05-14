<template>
  <PDrawer
    class="delegation-drawer"
    v-model="isAddCollaboratorsDrawerOpened"
    @close-drawer-button="handleCloseDrawer"
    @close="handleCloseDrawer"
  >
    <template #header-prefix>
      <h3 class="delegation-drawer__header">
        {{ t('addCollaborators') }}
      </h3>
    </template>

    <div class="margin-bottom--6">
      <AddCollaboratorsCard @collaborator-selection="handleCollaboratorSelection" />
    </div>

    <template #footer>
      <NextPreviousButtons
        :previousLabel="t('previousLabel')"
        :nextLabel="t('nextLabel')"
        :isNextButtonDisabled="!selectedCollaborators.length"
        @click-previous="handleCloseDrawer"
        @click-next="handleSubmit"
      />
    </template>
  </PDrawer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { PDrawer, PNotification, PICheck, PIX } from '@kpmg/styleguide'
import NextPreviousButtons from '@/common/components/NextPreviousButtons'
import type { AddCollaboratorsDrawerProps } from './AddCollaboratorsDrawerTypes'
import AddCollaboratorsCard from './components/AddCollaboratorsCard'
import type { Contact } from '@/services/contact/contactTypes'
import { addContactToEntity } from '@/services/account'
import { getFullName } from '@/common/utils/helpers/helpers'

const props = defineProps<AddCollaboratorsDrawerProps>()
const emit = defineEmits<{
  'update:modelValue': [boolean]
}>()

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const isAddCollaboratorsDrawerOpened = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

const handleCloseDrawer = () => {
  isAddCollaboratorsDrawerOpened.value = false
}

const handleSubmit = async () => {
  // This endpoint in its current state does not allow us to send a list
  const addContactPromises: Promise<any>[] = selectedCollaborators.value
    .map(({ id }) => addContactToEntity(props.entityId, id))

  const results = await Promise.allSettled(addContactPromises)
  const successfulResults: Promise<any>[] = []
  const failedResults: Promise<any>[] = []

  results.forEach(result => {
    if (result.status === 'fulfilled') {
      successfulResults.push(result.value)
    } else if (result.status === 'rejected') {
      failedResults.push(result.reason)
    }
  })

  displayAddCollaboratorSuccessNotifications(successfulResults)
  displayAddCollaboratorErrorNotifications(failedResults)

  isAddCollaboratorsDrawerOpened.value = false
}

// PromiseSettledResult type isn't availaible in typescript, it doens't know about it
function displayAddCollaboratorSuccessNotifications(successfulResponses: any[]) {
  if (!successfulResponses.length) return
  const amountOfAddedPeople = successfulResponses.length
  PNotification({
    message: t('addCollaboratorsSuccess', { amountOfAddedPeople }, amountOfAddedPeople),
    icon: PICheck,
    showClose: true,
    customClass: 'success',
    position: 'bottom-right',
    duration: 5000,
  })
}

function displayAddCollaboratorErrorNotifications(failedResponses: any[]) {
  failedResponses.forEach((failedResponse) => {
    const contactId: number = JSON.parse(failedResponse.config.data).contactId
    const concernedUser = selectedCollaborators.value
      .find((collaborator) => collaborator.id === contactId)

    const collaboratorFullName = getFullName(concernedUser?.firstName, concernedUser?.lastName, true)

    // Without that, notifications stack on each other and nextTick does not resolve that
    setTimeout(() => {
      PNotification({
        message: t('addCollaboratorsError', { collaboratorFullName }),
        icon: PIX,
        showClose: true,
        customClass: 'error',
        position: 'bottom-right',
        duration: 5000,
      })
    }, 1)
  })
}

const selectedCollaborators = ref<Contact[]>([])

function handleCollaboratorSelection(event: Contact[]) {
  selectedCollaborators.value = event
}

</script>

<i18n lang="yaml">
  en-US:
    addCollaborators: "Add collaborators"
    previousLabel: 'Close'
    nextLabel: 'Submit'
    addCollaboratorsSuccess: >
      The collaborator has been added to folder successfuly |
      {amountOfAddedPeople} collaborators have been added to folder successfuly
    addCollaboratorsError: >
      The collaborator {collaboratorFullName} has not been added to the folder due to a technical problem.
  fr-FR:
    addCollaborators: 'Ajouter des collaborateurs'
    previousLabel: 'Fermer'
    nextLabel: 'Valider'
    addCollaboratorsSuccess: >
      Le collaborateur a été ajouté au dossier avec succès |
      {amountOfAddedPeople} ont été ajoutés au dossier avec succès
    addCollaboratorsError: >
      Le collaborateur {collaboratorFullName} n'a pas pas pu être ajouté au dossier suite à un problème technique.
</i18n>
