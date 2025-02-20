<template>
  <PDialog
    v-model="isModalOpenedInternal"
    :pTitle="t('sendDocumentsFromMailInbox')"
    @close="closeModal"
  >
    <p class="margin-bottom--3">
      {{ t('sendToExpertsWithEmail') }}
    </p>
    <template
      v-for="(information, index) in mailToGedInformation"
      :key="index"
    >
      <ServiceEmailInformationLine
        :depositPath="information.label"
        :email="information.emailAddress"
      />
    </template>
    <p class="margin-top--5">
      {{ t('informationText') }}
    </p>
  </PDialog>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { PDialog } from '@pulse/styleguide/components'
import { EmailByServiceProps } from './email-by-service-modal.type'
import ServiceEmailInformationLine from '../service-email-information-line'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<EmailByServiceProps>()
const emit = defineEmits<{
  'update:isOpened': [boolean]
}>()

const isModalOpenedInternal = computed({
  get: () => props.isOpened,
  set: (value: boolean) => emit('update:isOpened', value),
})

function closeModal() {
  isModalOpenedInternal.value = false
}
</script>

<i18n lang="yaml">
en-US:
  sendDocumentsFromMailInbox: 'Upload your documents from your email inbox'
  sendToExpertsWithEmail: 'Send your documents directly by email to your experts at the following addresses:'
  informationText: "The Mail2GED addresses in the {'@kpmg'} format will be maintained until 03/31/2025. After this date, the {'@conseilescgs'} addresses will take over and will be available in this same section."
fr-FR:
  sendDocumentsFromMailInbox: 'Déposez vos documents depuis votre boite mail'
  sendToExpertsWithEmail: 'Envoyez directement vos documents par e-mail à vos experts aux adresses suivantes :'
  informationText: "Les adresses Mail2GED sous le format {'@kpmg'} sont maintenues jusqu'au 31/03/2025. Passée cette date, les adresses {'@conseilescgs'} prendront le relais et seront disponibles sur ce même encart."
</i18n>
