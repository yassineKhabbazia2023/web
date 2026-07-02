<template>
  <div
    class="
      prospect-creation-step-contact__section
      padding--4
      width--100
    "
  >
    <PBlockHeader
      :pTitle="t('entities.wallet.prospect.form.contact.interlocutorsTitle')"
      :pHasButton="false"
      pColor="persian"
      pSize="big"
      :pImage="headerImage"
    >
      <template #suffix>
        <p class="margin-bottom--2 font-xsmall">
          {{ t('entities.wallet.prospect.form.contact.interlocutorsSearchLabel') }}
        </p>
        <AddCollaboratorsAutocomplete
          :selectedCollaborators="model.interlocutors"
          :fetchCollaborators="ProspectsService.fetchCollaborators"
          :disabled="areAllRolesAssigned"
          @add-collaborator="onAddInterlocutor"
          @remove-collaborator="onRemoveInterlocutor"
        />
      </template>
    </PBlockHeader>
  </div>

  <ul
    v-auto-animate
    class="
        prospect-creation-step-contact__list
        margin-top--6
        list-style-none
        padding--0
      "
  >
    <li
      v-for="interlocutor in model.interlocutors"
      :key="interlocutor.id"
      class="margin-bottom--2"
    >
      <PUserActionCard
        :pAvatarProps="{ pRole: AvatarRoles.COLLAB, pType: 'small' }"
        :pTopLeftSectionText="getFullNameWithUppercaseLastName(interlocutor.firstName, interlocutor.lastName)"
        :pTopLeftSubText="interlocutor.email"
        :data-testid="`prospect-interlocutor-card-${interlocutor.id}`"
        @trash-clicked="onRemoveInterlocutor(interlocutor.id)"
      >
        <template #avatar>
          {{ getInitials(interlocutor.firstName, interlocutor.lastName) }}
        </template>
        <template #right-section>
          <PDropdown
            v-model="model.interlocutorRoles[interlocutor.id]"
            pMultiple
            class="prospect-creation-step-contact__dropdown"
            :pOptions="getRoleOptionsFor(interlocutor.id)"
            :pPlaceholder="t('entities.wallet.prospect.form.contact.rolePlaceholder')"
            :data-testid="`prospect-interlocutor-role-dropdown-${interlocutor.id}`"
          >
            <template #empty>
              <p
                class="
                  padding--3
                  text-center
                  text-color--gray-400
                "
              >
                — {{ t('entities.wallet.prospect.form.contact.noRolesAvailable') }} —
              </p>
            </template>
          </PDropdown>
        </template>
      </PUserActionCard>
    </li>
  </ul>

  <PAlert
    v-if="validationErrorMessageKey !== null"
    ref="alertRef"
    pType="danger"
    class="margin-y--4 font-bold"
  >
    {{ t(validationErrorMessageKey) }}
  </PAlert>
</template>

<script setup lang="ts">
import { computed, toRef, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { PAlert, PBlockHeader, PUserActionCard, PDropdown } from '@pulse/styleguide/components'
import { AvatarRoles, useResponsive } from '@pulse/styleguide'
import type { PImageProps } from '@pulse/styleguide/types'
import { getFullNameWithUppercaseLastName, getInitials } from '@pulse/common/utils'
import AddCollaboratorsAutocomplete from '@entities/modules/entity/shared/collaborators/components/AddCollaboratorDrawer/components/AddCollaboratorsAutocomplete'
import { ProspectsService } from '@entities/services/prospects/prospects.service'
import type { Contact } from '@entities/services/contact/contactTypes'
import type { ProspectFormData } from '@entities/modules/wallet/types'
import type { ProspectCreationStepContactProps } from './prospect-creation-step-contact.types'
import { useProspectCreationStepContactValidation } from './prospect-creation-step-contact.form.validation'
import { useScrollToAlert } from '../../use-scroll-to-alert.composable'

const props = defineProps<ProspectCreationStepContactProps>()

const { t } = useI18n()

const model = defineModel<ProspectFormData>({ required: true })

const { isMobile } = useResponsive()

// Hide the user icon on mobile: the header has too little room for it
const headerImage = computed<PImageProps | undefined>(() =>
  isMobile.value === true
    ? undefined
    : {
      pFit: 'fill',
      pName: 'user-add-duotone',
    },
)

const alertRef = useTemplateRef<HTMLElement>('alertRef')

const { validationErrorMessageKey, validate: baseValidate } = useProspectCreationStepContactValidation({
  prospectFormData: model,
  collaboratorTargetRoles: toRef(props, 'collaboratorTargetRoles'),
})

const { scrollToAlert } = useScrollToAlert(alertRef)

async function validate(): Promise<boolean> {
  const isValid = await baseValidate()
  if (isValid === false) {
    await scrollToAlert()
  }
  return isValid
}

function getRoleOptionsFor(interlocutorId: Contact['id']) {
  const takenByOthers = new Set<number>()
  for (const [collabId, roleIds] of Object.entries(model.value.interlocutorRoles)) {
    if (Number(collabId) !== interlocutorId) {
      roleIds.forEach((roleId) => takenByOthers.add(roleId))
    }
  }
  return props.collaboratorTargetRoles
    .filter((role) => takenByOthers.has(role.id) === false)
    .map((role) => ({ pValue: role.id, pLabel: role.label }))
}

const areAllRolesAssigned = computed(() => {
  if (props.collaboratorTargetRoles.length === 0) {
    return false
  }
  const assignedRoleIds = new Set(Object.values(model.value.interlocutorRoles).flat())
  return props.collaboratorTargetRoles.every((role) => assignedRoleIds.has(role.id))
})

function onAddInterlocutor(contact: Contact): void {
  model.value.interlocutors.push(contact)
  model.value.interlocutorRoles[contact.id] = []
}

function onRemoveInterlocutor(id: Contact['id']): void {
  const index = model.value.interlocutors.findIndex((interlocutor) => interlocutor.id === id)
  if (index !== -1) {
    model.value.interlocutors.splice(index, 1)
  }
  delete model.value.interlocutorRoles[id]
}

defineExpose({ validate })
</script>

<style lang="scss" scoped>
.prospect-creation-step-contact {
  &__dropdown {
    width: 280px;
  }
}
</style>
