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
        <PDynamicFields
          ref="entityCreatorFormDynamicFields"
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
        <PUserActionWithRoles
          v-for="selectedCollaborator in selectedCollaborators"
          :key="selectedCollaborator.id"
          :pProfile="getInitials(selectedCollaborator?.firstName, selectedCollaborator?.lastName)"
          :pTitle="getFullName(selectedCollaborator?.firstName, selectedCollaborator?.lastName)"
          :pDescription="selectedCollaborator.email"
          :pRole="selectedCollaborator?.persona?.name"
          :pShowDelete="canDelete"
          :data-testid="`entity-collaborator-selected-collaborator-${selectedCollaborator.email}`"
          :pAvatarRole="AvatarRoles.COLLAB"
          pShowOptions
          pOptionsMultiple
          :pOptions="getRoleOptionsForCollaborator(selectedCollaborator.id)"
          :pOptionsValue="collaboratorRoleAssignments.get(selectedCollaborator.id) ?? []"
          :pOptionsPlaceholder="t('selectRoles')"
          @click-delete="onClickDelete(selectedCollaborator.id)"
          @update:p-options-value="onUpdateCollaboratorRoles(selectedCollaborator.id, $event)"
        />
      </div>
    </PForm>
    <template #footer>
      <PDrawerActions
        :pBackCTA="backCTA"
        :pPrimaryCTA="primaryCTA"
        @click-back-cta="onCloseDrawer"
        @click-primary-cta="onCreateClick"
      />
    </template>
  </PDrawer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { setWith } from 'lodash-es'
import { logger, useDebounce } from '@pulse/toolbox'
import type { FormInstance, PDropdownOption, PDrawerActionButton } from '@pulse/styleguide/types'
import { getInitials, getFullName } from '@pulse/common/utils'
import { AvatarRoles, displayNotification } from '@pulse/styleguide'
import {
  PDrawer,
  PDrawerActions,
  PUserCard,
  PForm,
  PDynamicFields,
  PFormItem,
  PUserAction,
  PLoader,
} from '@pulse/styleguide/components'
import { getFormStructure } from '@entities/utils'
import { createTestAccount, generateAccountNumber } from '@entities/services/entity-creator'
import type { Contact } from '@entities/services/contact/contactTypes'
import CollaboratorAutocomplete from '@entities/components/CollaboratorAutocomplete'
import type { FormSection } from '@entities/types'
import type { EntityCreatorDrawerProps, OnboardingDetails } from '@entities/modules/wallet/types'
import { getAccountUserByEmail } from '@entities/services/account'
import { CollaboratorRole } from '@pulse/common/enums'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      newTestAccount: 'New test account',
      createTestAccount: 'Creation of a test entity',
      fillInInformationForDemoSpace: 'Fill in the following information to generate a demo space. Never use real customer information.\n',
      cancel: 'Cancel',
      create: 'Create test account',
      searchCollaborator: 'Collaborator(s) associated with the entity',
      setAsSignatory: 'Set as signatory',
      userCollaborator: 'User collaborator',
      testAccountCreated: 'The test account has been successfully created.',
      testAccountCreationFailed: 'Test account creation failed. Please try again.',
      accountManager: 'Account Manager',
      accountMaster: 'File Master',
      selectRoles: 'Select role(s)',
    },
    'fr-FR': {
      newTestAccount: 'Nouveau compte de test',
      createTestAccount: 'Création d\'une entité de test',
      fillInInformationForDemoSpace: 'Remplissez les informations suivantes pour générer un espace de démo. Ne jamais utiliser des informations clients réelles.\n',
      cancel: 'Annuler',
      create: 'Créer un compte de test',
      searchCollaborator: 'Collaborateur(s) associé(s) à l’entité',
      setAsSignatory: 'Définir comme signataire',
      userCollaborator: 'Utilisateur collaborateur',
      testAccountCreated: 'Le compte de test a été créé avec succès.',
      testAccountCreationFailed: 'La création du compte de test a échoué. Veuillez réessayer.',
      accountManager: 'Resp compte',
      accountMaster: 'Maître dossier',
      selectRoles: 'Choisir le(s) rôle(s)',
    },
  },
})

const props = defineProps<EntityCreatorDrawerProps>()
const emit = defineEmits<{
  'update:modelValue': [boolean]
}>()

const isLoading = ref(false)
const isTestAccountCreating = ref(false)
const isLookingForExistingUser = ref(false)

const PUserActionWithRoles = PUserAction<string[]>

const entityCreatorForm = ref<FormInstance>()
const entityCreatorFormDynamicFields = ref()
const selectedCollaborators = ref<Contact[]>([])
const entityCreatorFormStructure = ref<FormSection[]>()
const newTestAccount = ref<OnboardingDetails>({ isSignatory: true } as OnboardingDetails)
const collaboratorRoleAssignments = ref<Map<number, string[]>>(new Map())

const canDelete = computed(() => selectedCollaborators.value.length >= 1)

const backCTA = computed<PDrawerActionButton>(() => ({
  pLabel: t('cancel'),
  pTestId: 'entity-creator-cancel-button',
}))
const primaryCTA = computed<PDrawerActionButton>(() => ({
  pLabel: t('create'),
  pLoading: isTestAccountCreating.value,
  pDisabled: canDelete.value === false || isLoading.value,
  pTestId: 'entity-creator-create-button',
}))
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
const onClickDelete = (collaboratorId: number) => {
  if (canDelete.value === false) {
    logger.warn('Can not delete collaborator')
    return
  }
  const index = selectedCollaborators.value.findIndex((c) => c.id === collaboratorId)
  if (index !== -1) {
    selectedCollaborators.value.splice(index, 1)
  }
  collaboratorRoleAssignments.value.delete(collaboratorId)
}
const onInputAccount = (fieldKey: string, value: any) => {
  setWith(newTestAccount.value, fieldKey, value, Object)
  if (fieldKey === 'email') {
    if (newTestAccount.value.existingContactGuid) {
      validateContactFields()
      clearContactFields()
      enableContactFields()
    }
    searchContactByEmail(value)
  }
}
const onAddCollaborator = (contact: Contact) => {
  selectedCollaborators.value.push(contact)
  collaboratorRoleAssignments.value.set(contact.id, [])
}

const roleOptions: PDropdownOption[] = [
  { pValue: CollaboratorRole.CLP, pLabel: t('accountManager') },
  { pValue: CollaboratorRole.AM, pLabel: t('accountMaster') },
]

const findRoleHolder = (role: string): number | undefined => {
  for (const [collaboratorId, roles] of collaboratorRoleAssignments.value) {
    if (roles.includes(role)) {
      return collaboratorId
    }
  }
  return undefined
}

const getRoleOptionsForCollaborator = (collaboratorId: number): PDropdownOption[] => {
  return roleOptions.map((option) => {
    const holder = findRoleHolder(option.pValue as string)
    const isTakenByOther = holder !== undefined && holder !== collaboratorId
    return { ...option, pDisabled: isTakenByOther }
  })
}

const findCollaboratorByRole = (role: string): Contact | undefined => {
  const holderId = findRoleHolder(role)
  if (holderId === undefined) {
    return undefined
  }
  return selectedCollaborators.value.find((c) => c.id === holderId)
}

const onUpdateCollaboratorRoles = (collaboratorId: number, newRoles: string[]) => {
  collaboratorRoleAssignments.value.set(collaboratorId, newRoles)
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
    const accountLead = findCollaboratorByRole(CollaboratorRole.CLP)
    const master = findCollaboratorByRole(CollaboratorRole.AM)
    newTestAccount.value.accountLeadGuid = accountLead?.oldId
    newTestAccount.value.masterGuid = master?.oldId
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
  entityCreatorFormDynamicFields.value[1].disableField('contactLastName')
  entityCreatorFormDynamicFields.value[1].disableField('contactFirstName')
}

const enableContactFields = () => {
  entityCreatorFormDynamicFields.value[1].enableField('contactLastName')
  entityCreatorFormDynamicFields.value[1].enableField('contactFirstName')
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

const searchContactByEmail = useDebounce(async (contactEmail: string) => {
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
})

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
    collaboratorRoleAssignments.value.set(id, [])
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
  collaboratorRoleAssignments,
})
</script>

<style lang="scss" scoped>
.entity-creator {
  &__form-section-fields {
    gap: 0px 20px;
  }
}
</style>

