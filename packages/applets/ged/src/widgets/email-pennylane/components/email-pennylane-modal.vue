<template>
  <PDialog
    v-model="isVisible"
    pModal
    pWidth="572"
    class="email-pennylane-dialog"
    :pTitle="t('title')"
    data-testid="email-pennylane-dialog"
    @close="handleClosePopup"
  >
    <p class="margin-bottom--3">
      {{ t('description') }}
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
import { computed, ref, onMounted } from 'vue'
import { PDialog } from '@pulse/styleguide/components'
import { EmailPennylaneModalProps } from '../types/email-pennylane-modal-props'
import { useI18n } from 'vue-i18n'
import { fetchServicesMailToGedInformation } from '@ged/services/Services'
import ServiceEmailInformationLine from './service-email-information-line.vue'
import type { ServiceMailToGedInformation } from '@ged/models/Service'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const mailModalProps = defineProps<EmailPennylaneModalProps>()

const mailToGedInformation = ref<ServiceMailToGedInformation[]>([])

onMounted(async () => {
  mailToGedInformation.value = await fetchServicesMailToGedInformation(
    mailModalProps.accountNumber,
    mailModalProps.entityServices,
    mailModalProps.accountId,
  )
})

const emit = defineEmits([
  'update:isVisible',
  'on-close-popup',
])

const isVisible = computed({
  get(){
    return mailModalProps.isVisible
  },
  set(value){
    emit('update:isVisible', value)
  },
})

const handleClosePopup = ()=>{
  emit('on-close-popup')
}
</script>
<i18n lang="yaml">
en-US:
  title: "Upload document using email address"
  description: |
    Copy the email address and add it as an email recipient
    to drop off a document.
fr-FR:
  title: "Déposer un document par e-mail"
  description: |
    Copiez l'adresse e-mail et ajoutez-la en destinataire d'un email
    afin de déposer un document.
</i18n>
