<template>
  <div data-testid="request-delegation-recap">
    <section
      class="
        bg--jungle-75
        margin-bottom--4
        padding--6
      "
      data-testid="recap-folder"
    >
      <p
        class="
          font-large
          font-bold
          margin-bottom--4
        "
      >
        {{ t('entities.requestDelegation.recapFolderTitle') }}
      </p>
      <div
        class="
          flex
          flex--align-items-center
          flex-gap--4
        "
      >
        <PAvatar
          pType="large"
          pColor="green"
        >
          {{ folderInitials }}
        </PAvatar>
        <span class="font-bold font-size--16">
          {{ selectedAccount.legalName }} {{ selectedAccount.accountNumber }}
        </span>
      </div>
    </section>

    <section
      class="
        bg--black-rock-100
        margin-bottom--4
        padding--6
      "
      data-testid="recap-collaborators"
    >
      <p
        class="
          font-large
          font-bold
          margin-bottom--4
        "
      >
        {{ t('entities.requestDelegation.recapCollaboratorsTitle') }}
      </p>
      <div class="flex flex--direction-column">
        <template
          v-for="(collaborator, index) in selectedCollaborators"
          :key="collaborator.contactId"
        >
          <PDivider
            v-if="index > 0"
            class="margin-y--0"
          />
          <PDoubleText
            pType="primary"
            :pTitle="getFullName(collaborator)"
            :pContent="collaborator.email"
            :pAvatarRole="AvatarRoles.COLLAB"
            :pProfile="getCollaboratorInitials(collaborator)"
            :data-testid="`recap-collaborator-${collaborator.contactId}`"
          />
        </template>
      </div>
    </section>

    <PAlert
      pType="information"
      data-testid="recap-info"
    >
      {{ t('entities.requestDelegation.recapInfo') }}
    </PAlert>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { PAlert, PAvatar, PDivider, PDoubleText } from '@pulse/styleguide/components'
import { AvatarRoles } from '@pulse/styleguide'
import { getFullNameWithUppercaseLastName } from '@pulse/common/utils'
import { getStringInitials } from '@pulse/toolbox/utils/string'
import type { Collab } from '@entities/types'
import { getInitials } from '@entities/helpers/entity.helper'
import type { RecapStepProps } from './recap-step.types'

const props = defineProps<RecapStepProps>()

const { t } = useI18n()

const folderInitials = computed(() => getStringInitials(props.selectedAccount.legalName))

const getFullName = (collaborator: Collab) =>
  getFullNameWithUppercaseLastName(collaborator.firstName, collaborator.lastName)

const getCollaboratorInitials = (collaborator: Collab) =>
  getInitials(collaborator.firstName, collaborator.lastName)
</script>
