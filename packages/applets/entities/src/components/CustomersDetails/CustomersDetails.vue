<template>
  <div>
    <PAlert
      v-if="principalContacts.length === 0"
      pType="danger"
      class="margin-bottom--2"
    >
      <template #bold-text>
        <p>{{ t('noMandateSignatoryTitle') }}</p>
      </template>
      <span> {{ t('mandateSignatoryRequired') }} </span>
      <p class="font-italic">
        {{ t('assignSignatoryInstructions') }}
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
  messages: {
    'en-US': {
      noMandateSignatoryTitle: 'No client contact is designated as a signatory for the engagement letter on this file',
      mandateSignatoryRequired: 'To activate the offer on this file, you must designate a client contact as a signatory for the engagement letter.',
      assignSignatoryInstructions: 'To do this, open the contact\'s profile in Akuiteo, then select the role "Engagement letter/mandate signatory" in the "Contact type" section.',
    },
    'fr-FR': {
      noMandateSignatoryTitle: 'Aucun contact client est désigné comme signataire de la lettre de mission sur le dossier',
      mandateSignatoryRequired: 'Pour activer l\'offre sur ce dossier, vous devez désigner un contact client comme signataire de la lettre de mission.',
      assignSignatoryInstructions: 'Pour cela, ouvrez la fiche du contact concerné dans Akuiteo, puis sélectionnez le rôle « Signataire lettre de mission / mandat » dans la rubrique « Type de contact ».',
    },
  },
})

defineProps<CustomersDetailsProps>()
</script>
