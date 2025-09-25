<template>
  <div
    v-if="mailToGedInformation.length > 0"
    class="
      mail-to-ged
      flex
      flex--align-items-center
      margin-x--4
      padding-x--4
      padding-y--3
      radius--2
      cursor-pointer
    "
    @click="openMailToGedModal"
  >
    <PIcon
      :pColor="AppColors.PERSIAN_400"
      pName="envelope"
      pSize="16"
    />
    <div class="mail-to-ged__text margin-left--3">
      {{ t('sendDocumentsByMail') }}
    </div>
  </div>

  <EmailByServiceModal
    v-if="mailToGedInformation.length > 0"
    v-model:isOpened="isMailToGedModalOpened"
    :mailToGedInformation="mailToGedInformation"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { AppColors } from '@pulse/styleguide'
import { PIcon } from '@pulse/styleguide/components'
import EmailByServiceModal from './email-by-service-modal'
import { fetchServicesMailToGedInformation } from '@ged/services/Services'
import { ServiceMailToGedInformation } from '@ged/models/Service'
import type { MailToGedProps } from './mail-to-ged-card.types'
import { logger } from '@pulse/core'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<MailToGedProps>()

const isMailToGedModalOpened = ref(false)
function openMailToGedModal() {
  isMailToGedModalOpened.value = true
}

const mailToGedInformation = ref<ServiceMailToGedInformation[]>([])
onMounted(async () => {
  try {
    mailToGedInformation.value = await fetchServicesMailToGedInformation(
      props.selectedEntity,
      props.entityServices,
      props.accountId,
    )
  } catch (error) {
    logger.error('Failed to retrieves services information', error)
  }

})
</script>

<style lang="scss">
.mail-to-ged {
  background-color: var(--p-jungle-75);

  &__text {
    width: 70%;
  }
}
</style>


<i18n lang="yaml">
en-US:
  sendDocumentsByMail: 'Would you like to send your documents by email?'
fr-FR:
  sendDocumentsByMail: 'Vous souhaitez envoyer vos documents par e‑mail ?'
</i18n>
