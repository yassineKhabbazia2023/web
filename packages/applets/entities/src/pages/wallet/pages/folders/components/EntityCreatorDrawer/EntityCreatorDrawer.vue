<template>
  <PDrawer
    v-model="isEntityCreatorDrawerVisible"
    :pTitle="t('newTestAccount')"
    destroyOnClose
    pSize="50%"
    @close-drawer-button="onCloseDrawer"
  >
    <PUserCard
      id="entity-creator-user-card"
      pColor="gray"
      pImageName="building-duotone"
      :pTitle="t('createTestAccount')"
      :pSubtitle="t('fillInInformationForDemoSpace')"
      class="margin-bottom--6"
      data-testid="entity-creator-user-card"
    />
    <div
      v-if="isLoading"
      class="flex flex--justify-content-center margin-y--4"
      data-testid="entity-creator-loader"
    >
      <PLoader
        pType="primary"
        pSize="50"
      />
    </div>
    <PForm
      v-else
      ref="entityCreatorForm"
      :pModel="newTestAccount"
      pLabelPosition="top"
      class="entity-creator__form margin-top--6"
      aria-describedby="entity-creator-user-card"
      data-testid="entity-creator-form"
    >
      <section
        v-for="(section, index) in entityCreatorFormStructure"
        :key="`section-${index}`"
        class="entity-creator__form-section padding-bottom--1"
      >
        <p class="entity-creator__form-section-title font-bold padding-top--4 margin-bottom--3">
          <span class="flex flex--align-items-center">
            {{ section.title }}
            <PLoader
              v-if="section.sectionKey === 'contactInfo' && isLookingForExistingUser"
              class="margin-left--1"
              pType="primary"
              pSize="12"
            />
          </span>
        </p>
        <PFieldSet
          ref="entityCreatorFormFieldSet"
          :pModel="newTestAccount"
          :pFields="section.fields"
          class="entity-creator__form-section-fields"
          @update:p-model="onInputAccount"
        />
      </section>
      <section class="entity-creator__form-section padding-bottom--1 margin-bottom--4">
        <p class="entity-creator__form-section-title font-bold padding-top--4 margin-bottom--3">
          <span>
            {{ t('userCollaborator') }}
          </span>
        </p>
        <PFormItem
          :pLabel="t('searchCollaborator')"
          class="margin-bottom--0"
        >
          <CollaboratorAutocomplete
            :selectedCollaboratorIds="selectedCollaboratorIds"
            @add-contact="onAddCollaborator"
          />
        </PFormItem>
      </section>
      <div class="margin-bottom--6">
        <PUserAction
          v-for="(selectedCollaborator, index) in selectedCollaborators"
          :key="index"
          :pProfile="getInitials(selectedCollaborator?.firstName, selectedCollaborator?.lastName)"
          :pTitle="getFullName(selectedCollaborator?.firstName, selectedCollaborator?.lastName)"
          :pDescription="selectedCollaborator.email"
          :pRole="selectedCollaborator?.persona?.name"
          :pShowDelete="canDelete"
          :data-testid="`entity-collaborator-selected-collaborator-${selectedCollaborator.email}`"
          :pAvatarRole="AvatarRoles.COLLAB"
          @click-delete="onClickDelete(index)"
        />
      </div>
      <div class="flex flex--justify-content-flex-end">
        <PButton
          class="margin-right--4"
          pType="secondary"
          pSize="default"
          data-testid="entity-creator-cancel-button"
          @click="onCloseDrawer"
        >
          {{ t('cancel') }}
        </PButton>
        <PButton
          pType="primary"
          pSize="default"
          :pLoading="isTestAccountCreating"
          :pDisabled="!canDelete"
          data-testid="entity-creator-create-button"
          @click="onCreateClick"
        >
          {{ t('create') }}
        </PButton>
      </div>
    </PForm>
  </PDrawer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { setWith } from 'lodash-es'
import { logger } from '@pulse/core'
import { getInitials, debounce } from '@pulse/common'
import type { FormInstance } from '@pulse/styleguide/types'
import { AvatarRoles } from '@pulse/styleguide'
import {
  PDrawer,
  PUserCard,
  PForm,
  PFieldSet,
  PButton,
  PFormItem,
  PUserAction,
  PLoader,
} from '@pulse/styleguide/components'
import { displayNotification, getFormStructure, getFullName } from '@entities/common/utils'
import { createTestAccount, generateAccountNumber } from '@entities/services/entity-creator'
import type { Contact } from '@entities/services/contact/contactTypes'
import CollaboratorAutocomplete from '@entities/pages/entities/components/CollaboratorAutocomplete'
import type { FormSection } from '@entities/pages/entities/components/CompanyInformation/CompanyInformationTypes'
import type { EntityCreatorDrawerProps, OnboardingDetails } from './entity-creator-drawer.types'
import { getAccountUserByEmail } from '@entities/services/account'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<EntityCreatorDrawerProps>()
const emit = defineEmits<{
  'update:modelValue': [boolean]
}>()

const isLoading = ref(false)
const isTestAccountCreating = ref(false)
const isLookingForExistingUser = ref(false)

const entityCreatorForm = ref<FormInstance>()
const entityCreatorFormFieldSet = ref()
const selectedCollaborators = ref<Contact[]>([])
const entityCreatorFormStructure = ref<FormSection[]>()
const newTestAccount = ref<OnboardingDetails>({ isSignatory: true } as OnboardingDetails)

const canDelete = computed(() => selectedCollaborators.value.length >= 1)
const isEntityCreatorDrawerVisible = computed({
  get() {
    return props.modelValue
  },
  set(val: boolean) {
    emit('update:modelValue', val)
  },
})
const selectedCollaboratorIds = computed(() => selectedCollaborators.value.map(({ id }) => id))

const onCloseDrawer = () => {
  isEntityCreatorDrawerVisible.value = false
}
const onClickDelete = (index: number) => {
  if (!canDelete.value) {
    logger.warn('Can not delete collaborator')
    return
  }
  selectedCollaborators.value.splice(index, 1)
}
const onInputAccount = (fieldKey: string, value: any) => {
  setWith(newTestAccount.value, fieldKey, value, Object)
  if (fieldKey === 'email') {
    if (newTestAccount.value.existingContactGuid){
      validateContactFields()
      clearContactFields()
      enableContactFields()
    }
    searchContactByEmail(value)
  }
}
const onAddCollaborator = (contact: Contact) => {
  selectedCollaborators.value.push(contact)
}
const onCreateClick = async () => {
  // Validate the form, return early if validation fails
  try {
    await entityCreatorForm.value?.validate()
  } catch {
    return
  }

  try {
    newTestAccount.value.collaboratorGuids = selectedCollaborators.value.map((collab) => collab.oldId ?? '')
    isTestAccountCreating.value = true
    await createTestAccount(newTestAccount.value)
    displayNotification('success', t('testAccountCreated'))
    // I added a setTimeout to enhance the user experience (UX)
    setTimeout(() => {
      isEntityCreatorDrawerVisible.value = false
    }, 600)
  } catch {
    displayNotification('error', t('testAccountCreationFailed'))
  } finally {
    isTestAccountCreating.value = false
  }
}

const disableContactFields = () => {
  entityCreatorFormFieldSet.value[1].disableField('contactLastName')
  entityCreatorFormFieldSet.value[1].disableField('contactFirstName')
}

const enableContactFields = () => {
  entityCreatorFormFieldSet.value[1].enableField('contactLastName')
  entityCreatorFormFieldSet.value[1].enableField('contactFirstName')
}

const validateContactFields = () => {
  entityCreatorForm.value?.validateField('contactLastName')
  entityCreatorForm.value?.validateField('contactFirstName')
}

const clearContactFields = () => {
  newTestAccount.value.contactLastName = ''
  newTestAccount.value.contactFirstName = ''
  newTestAccount.value.existingContactGuid = ''
}

const searchContactByEmail = debounce(async (contactEmail: string) => {
  isLookingForExistingUser.value = true
  const contactSearchResult = await getAccountUserByEmail(contactEmail)
  if (contactSearchResult) {
    const { firstName, lastName, oldId } = contactSearchResult
    newTestAccount.value.contactFirstName = firstName
    newTestAccount.value.contactLastName = lastName
    newTestAccount.value.existingContactGuid = oldId
    validateContactFields()
    disableContactFields()
  }
  isLookingForExistingUser.value = false
}, 600)

onMounted(async () => {
  isLoading.value = true
  try {
    // Set the current user as the default collaborator
    const { id, firstName, lastName, email, oldId, persona, officeMobile } = props.currentUser
    selectedCollaborators.value.push({
      id,
      firstName,
      lastName,
      email,
      mobilePhone: officeMobile ?? '',
      oldId,
      persona,
    })
    entityCreatorFormStructure.value = await getFormStructure('EntityCreator')
    newTestAccount.value.accountNumber = await generateAccountNumber() ?? ''
  } catch (error) {
    logger.error('Error fetching form structure :', error)
  } finally {
    isLoading.value = false
  }
})

defineExpose({
  selectedCollaborators,
  entityCreatorForm,
  onClickDelete,
})
</script>

<style lang="scss" scoped>
.entity-creator {
  &__form-section-fields {
    gap: 0px 20px;
  }
}
</style>

<i18n lang="yaml">
en-US:
  newTestAccount: 'New test account'
  createTestAccount: 'Creation of a test entity'
  fillInInformationForDemoSpace: >
    Fill in the following information to generate a demo space. Never use real customer information.
  cancel: 'Cancel'
  create: 'Create test account'
  searchCollaborator: 'Collaborator(s) associated with the entity'
  setAsSignatory: 'Set as signatory'
  userCollaborator: 'User collaborator'
  testAccountCreated: 'The test account has been successfully created.'
  testAccountCreationFailed: 'Test account creation failed. Please try again.'
fr-FR:
  newTestAccount: 'Nouveau compte de test'
  createTestAccount: "Création d'une entité de test"
  fillInInformationForDemoSpace: >
    Remplissez les informations suivantes pour générer un espace de démo.
    Ne jamais utiliser des informations clients réelles.
  cancel: 'Annuler'
  create: 'Créer un compte de test'
  searchCollaborator: 'Collaborateur(s) associé(s) à l’entité'
  setAsSignatory: 'Définir comme signataire'
  userCollaborator: 'Utilisateur collaborateur'
  testAccountCreated: 'Le compte de test a été créé avec succès.'
  testAccountCreationFailed: 'La création du compte de test a échoué. Veuillez réessayer.'
</i18n>
