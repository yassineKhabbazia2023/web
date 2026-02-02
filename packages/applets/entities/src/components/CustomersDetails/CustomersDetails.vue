<template>
  <div>
    <PAlert
      v-if="principalContacts.length === 0"
      pType="danger"
      class="margin-bottom--2"
    >
      <template #bold-text>
        <p>{{ t('noSignatory') }}</p>
      </template>
      <span> {{ t('atLeastOneSignatory') }} </span>
      <p class="font-italic">
        {{ t('assignSignatory') }}
      </p>
    </PAlert>
    <ul class="list-style-none">
      <li
        v-for="principalContact in principalContacts"
        :key="principalContact.contactId"
        class="margin-bottom--6"
      >
        <PrincipalContact
          :principalContact="principalContact"
          :currentSubscriptionOffer
          data-testid="subscription-details-principal-contact"
        />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PAlert } from '@pulse/styleguide/components'
import PrincipalContact from '@entities/components/PrincipalContact'
import type { CustomersDetailsProps } from './CustomersDetailsTypes'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

defineProps<CustomersDetailsProps>()
</script>
<i18n lang="yaml">
  en-US:
    noSignatory: 'You have no signatory on this file!'
    atLeastOneSignatory: 'You must have at least one signatory to activate the offer.'
    assignSignatory: 'In the folder (users tab), you can designate a user as a signatory.'
  fr-FR:
    noSignatory: "Vous n'avez aucun signataire sur ce dossier !"
    atLeastOneSignatory: "Vous devez obligatoirement avoir au moins un signataire pour activer l'offre."
    assignSignatory: >
      Dans le dossier (onglet utilisateurs), vous pouvez désigner un utilisateur en tant que signataire.
</i18n>
