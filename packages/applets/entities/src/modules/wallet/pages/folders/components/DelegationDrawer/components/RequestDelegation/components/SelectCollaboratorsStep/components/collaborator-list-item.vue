<template>
  <div
    class="
      collaborator-list-item
      flex
      flex--align-items-center
      padding-x--4
    "
    :class="{ 'bg--jungle-75': isSelected }"
    :data-testid="`collaborator-item-${collaborator.contactId}`"
  >
    <PTooltip
      v-if="isDisabled"
      :pContent="maxReachedMessage"
      pPlacement="top"
    >
      <PCheckbox
        :modelValue="isSelected"
        :disabled="isDisabled"
        class="margin-right--4"
        :data-testid="`collaborator-checkbox-${collaborator.contactId}`"
        @change="handleToggle"
      />
    </PTooltip>
    <PCheckbox
      v-else
      :modelValue="isSelected"
      :disabled="isDisabled"
      class="margin-right--4"
      :data-testid="`collaborator-checkbox-${collaborator.contactId}`"
      @change="handleToggle"
    />
    <div class="width--100 flex flex--justify-content-space-between">
      <PDoubleText
        pType="primary"
        :pTitle="fullName"
        :pContent="collaborator.email"
        :pAvatarRole="AvatarRoles.COLLAB"
        :pProfile="initials"
      />
      <div
        class="
          collaborator-list-item__roles
          flex
          flex--align-items-center
          margin-left--4
        "
        :data-testid="`collaborator-item-roles-${collaborator.contactId}`"
      >
        <CollaboratorRolesLabelDisplay
          v-if="collaborator.labels?.length"
          :roleLabels="roleLabelGroups"
        />
        <PDivider
          v-if="collaborator.personaName && collaborator.labels?.length"
          pDirection="vertical"
          class="margin-x--2"
        />
        <span
          v-if="collaborator.personaName"
          class="font-small text-color--gray-400"
        >
          {{ collaborator.personaName }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { PCheckbox, PDivider, PDoubleText, PTooltip } from '@pulse/styleguide/components'
import { AvatarRoles } from '@pulse/styleguide'
import { getFullNameWithUppercaseLastName } from '@pulse/common/utils'
import CollaboratorRolesLabelDisplay from '@entities/modules/entity/shared/collaborators/components/CollaboratorRolesLabelDisplay/CollaboratorRolesLabelDisplay.vue'
import { splitRoleLabelsIntoGroups } from '@entities/modules/entity/shared/collaborators/utils/collaborators.utils'
import { getInitials } from '@entities/helpers/entity.helper'
import type { CollaboratorListItemProps } from './collaborator-list-item.types'

const props = defineProps<CollaboratorListItemProps>()

const emit = defineEmits<{
  toggle: []
}>()

const { t } = useI18n()

const fullName = computed(() =>
  getFullNameWithUppercaseLastName(props.collaborator.firstName, props.collaborator.lastName),
)
const initials = computed(() => getInitials(props.collaborator.firstName, props.collaborator.lastName))
const roleLabelGroups = computed(() => splitRoleLabelsIntoGroups(props.collaborator.labels))
const maxReachedMessage = computed(() => t('entities.requestDelegation.maxCollaboratorsReached'))

function handleToggle() {
  emit('toggle')
}
</script>
