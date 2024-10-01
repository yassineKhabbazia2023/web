<template>
  <div>
    <p class="font-semibold margin-y--6">
      {{ t('collaboratorsSubscription') }}
    </p>
    <ul class="list-style-none">
      <li
        v-for="{ contactId, firstName, lastName, email } in collaborators"
        :key="contactId"
        class="collaborator-details"
      >
        <PUserAction
          :pProfile="getInitials(firstName, lastName)"
          :pTitle="getFullName(firstName, lastName, true)"
          :pDescription="email"
          :data-testid="`subscription-details-collaborator-${email}`"
        />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PUserAction } from '@pulse/styleguide'
import { getInitials } from '@pulse/common'
import { getFullName } from '@entities/common/utils'
import type { CollaboratorsDetailsProps } from './CollaboratorsDetailsTypes'

defineProps<CollaboratorsDetailsProps>()

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})
</script>

<style scoped lang="scss">
.collaborator-details + .collaborator-details {
  border-top: 1px solid var(--el-color-neutral-gray-100);
}
</style>

<i18n lang="yaml">
en-US:
  collaboratorsSubscription: 'The collaborators added to the offer :'
fr-FR:
  collaboratorsSubscription: "Les collaborateurs ajoutés sur l'offre :"
</i18n>
