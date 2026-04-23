<template>
  <PDrawer
    v-model="isAddCollaboratorsDrawerOpened"
    data-testid="add-collaborator-drawer"
    pSize="50%"
    :pTitle="t('addCollaborators')"
    @close-drawer-button="handleCloseDrawer"
    @close="handleCloseDrawer"
  >
    <div class="margin-bottom--6">
      <AddCollaboratorsCard @collaborator-selection="handleCollaboratorSelection" />
    </div>

    <template #footer>
      <PDrawerActions
        :pBackCTA="backCTA"
        :pPrimaryCTA="primaryCTA"
        @click-back-cta="handleCloseDrawer"
        @click-primary-cta="handleSubmit"
      />
    </template>
  </PDrawer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { PDrawer, PDrawerActions } from '@pulse/styleguide/components'
import { PNotification } from '@pulse/styleguide'
import type { AddCollaboratorsDrawerProps } from './AddCollaboratorsDrawerTypes'
import AddCollaboratorsCard from './components/AddCollaboratorsCard'
import type { Contact } from '@entities/services/contact/contactTypes'
import { addContactToEntity } from '@entities/services/account'
import { getFullNameWithUppercaseLastName } from '@entities/utils/helpers/helpers'

const props = defineProps<AddCollaboratorsDrawerProps>()
const emit = defineEmits<{
  'update:modelValue': [boolean]
  'refresh-collaborators-list': []
}>()

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      addCollaborators: 'Add collaborators',
      previousLabel: 'Close',
      nextLabel: 'Submit',
      addCollaboratorsSuccess: 'The collaborator has been added to folder successfuly | {amountOfAddedPeople} collaborators have been added to folder successfuly\n',
      addCollaboratorsError: 'The collaborator {collaboratorFullName} has not been added to the folder due to a technical problem.\n',
    },
    'fr-FR': {
      addCollaborators: 'Ajouter des collaborateurs',
      previousLabel: 'Fermer',
      nextLabel: 'Valider',
      addCollaboratorsSuccess: 'Le collaborateur a été ajouté au dossier avec succès | {amountOfAddedPeople} collaborateurs ont été ajoutés au dossier avec succès\n',
      addCollaboratorsError: 'Le collaborateur {collaboratorFullName} n\'a pas pas pu être ajouté au dossier suite à un problème technique.\n',
    },
  },
})

const isNextButtonLoading = ref(false)
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
  isNextButtonLoading.value = true
  // This endpoint in its current state does not allow us to send a list
  const addContactPromises: Promise<any>[] = selectedCollaborators.value
    .map(({ email }) => addContactToEntity(props.entityId, email))

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

  isNextButtonLoading.value = false
  isAddCollaboratorsDrawerOpened.value = false
  emit('refresh-collaborators-list')
}

// PromiseSettledResult type isn't availaible in typescript, it doens't know about it
function displayAddCollaboratorSuccessNotifications(successfulResponses: any[]) {
  if (!successfulResponses.length) {
    return
  }
  const amountOfAddedPeople = successfulResponses.length
  PNotification({
    message: t('addCollaboratorsSuccess', { amountOfAddedPeople }, amountOfAddedPeople),
    iconName: 'check',
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

    const collaboratorFullName = getFullNameWithUppercaseLastName(concernedUser?.firstName, concernedUser?.lastName)

    // Without that, notifications stack on each other and nextTick does not resolve that
    setTimeout(() => {
      PNotification({
        message: t('addCollaboratorsError', { collaboratorFullName }),
        iconName: 'x',
        showClose: true,
        customClass: 'error',
        position: 'bottom-right',
        duration: 5000,
      })
    }, 1)
  })
}

const selectedCollaborators = ref<Contact[]>([])

const backCTA = computed(() => ({ pLabel: t('previousLabel'), pTestId: 'previousButton' }))
const primaryCTA = computed(() => ({
  pLabel: t('nextLabel'),
  pDisabled: selectedCollaborators.value.length === 0,
  pLoading: isNextButtonLoading.value,
  pTestId: 'nextButton',
}))

function handleCollaboratorSelection(event: Contact[]) {
  selectedCollaborators.value = event
}

</script>

