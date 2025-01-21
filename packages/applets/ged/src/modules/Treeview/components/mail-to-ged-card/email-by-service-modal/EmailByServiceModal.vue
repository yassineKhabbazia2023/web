<template>
  <PDialog
    v-model="isModalOpened"
    :pTitle="t('sendDocumentsFromMailInbox')"
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
  'update:modelValue': []
}>()

const isModalOpened = computed({
  get: () => props.modelValue,
  set: () => emit('update:modelValue'),
})
</script>

<i18n lang="yaml">
en-US:
  sendDocumentsFromMailInbox: 'Upload your documents from your email inbox'
  sendToExpertsWithEmail: 'Send your documents directly by email to your experts at the following addresses:'
fr-FR:
  sendDocumentsFromMailInbox: 'Déposez vos documents depuis votre boite mail'
  sendToExpertsWithEmail: 'Envoyez directement vos documents par e-mail à vos experts aux adresses suivantes :'
</i18n>
