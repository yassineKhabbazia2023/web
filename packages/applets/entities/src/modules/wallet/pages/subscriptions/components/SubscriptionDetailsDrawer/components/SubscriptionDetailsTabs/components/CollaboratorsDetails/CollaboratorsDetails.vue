<template>
  <div>
    <p class="font-semibold margin-y--6">
      {{ t('collaboratorsSubscription') }}
    </p>
    <ul class="list-style-none">
      <li
        v-for="{ contactId, firstName, lastName, email, functionIds } in formattedCollaborators"
        :key="contactId"
        class="collaborator-details"
      >
        <PUserAction
          :pProfile="getInitials(firstName, lastName)"
          :pTitle="getFullNameWithUppercaseLastName(firstName, lastName)"
          :pDescription="email"
          :data-testid="`subscription-details-collaborator-${email}`"
          :pAvatarRole="AvatarRoles.COLLAB"
          :pShowOptions="hasCollaboratorRole && functionIds.length > 0"
          :pOptions="formattedCollaboratorRoles"
          :pOptionsValue="functionIds"
          pOptionsMultiple
          pOptionsDisabled
        />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { PUserAction } from '@pulse/styleguide/components'
import { AvatarRoles } from '@pulse/styleguide'
import { getInitials } from '@pulse/common'
import { getFullNameWithUppercaseLastName } from '@entities/utils'
import type { CollaboratorsDetailsProps } from './CollaboratorsDetailsTypes'
import { getFormattedCollaborators, getFormattedCollaboratorRoles } from './CollaboratorsDetails.utils'

const props = defineProps<CollaboratorsDetailsProps>()

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const hasCollaboratorRole = computed(() => props.collaboratorRoles.length > 0)
const formattedCollaboratorRoles = computed(() => getFormattedCollaboratorRoles(props.collaboratorRoles))
const formattedCollaborators = computed(() => getFormattedCollaborators(props.collaborators))
</script>

<style scoped lang="scss">
.collaborator-details + .collaborator-details {
  border-top: 1px solid var(--p-gray-100);
}
</style>

<i18n lang="yaml">
en-US:
  collaboratorsSubscription: 'The collaborators added to the offer :'
fr-FR:
  collaboratorsSubscription: "Les collaborateurs ajoutés sur l'offre :"
</i18n>
