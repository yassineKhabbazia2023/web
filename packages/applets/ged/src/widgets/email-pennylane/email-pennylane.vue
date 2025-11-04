<template>
  <template v-if="shouldDisplayEmailPennylane === true">
    <div class="widget-sso" data-testid="widget-upload-mail-button">
      <PButton pTag="a" @click="onClickEmailModalButton">
        <PIcon pName="envelope" />

        <div class="margin-x--2">
          {{ t('uploadDocumentByEmail') }}
        </div>

        <PIcon pName="arrowRight" />
      </PButton>
    </div>
    <EmailPennylaneModal
      v-if="currentEntityId !== undefined"
      v-model:isVisible="isModalOpen"
      :accountNumber="currentEntityAccountNumber"
      :entityServices="entityServices"
      :accountId="currentEntityId"
      @on-close-popup="handleClose"
    />
  </template>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PButton, PIcon } from '@pulse/styleguide/components'
import { computed, ref, watch, onMounted } from 'vue'
import EmailPennylaneModal from './components/email-pennylane-modal.vue'
import { useCurrentEntityStore } from '@pulse/common/stores'
import { fetchUserEntityServices } from '@ged/services/Services'
import type { Service } from '@ged/models/Service'
import type { Folder } from '@ged/models/Folder'
import { fetchServicesFolders } from '@ged/services/Folder'
import { storeToRefs } from 'pinia'
import { GedContext } from '@pulse/common/enums'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const isModalOpen = ref(false)

const currentEntityStore = useCurrentEntityStore()
const { currentEntity, currentEntityId, currentEntityAccountNumber } = storeToRefs(currentEntityStore)

const entityServices = ref<Service[]>([])
const servicesFolders = ref<Folder[][]>([])

const shouldDisplayEmailPennylane = computed(() => {
  return currentEntity.value !== null && entityServices.value.length > 0 && currentEntityAccountNumber.value !== ''
})

const handleClose = () => {
  isModalOpen.value = false
}

const onClickEmailModalButton = () => {
  isModalOpen.value = true
}

const fetchGedFoldersAndServices = async () => {
  if (currentEntityId.value == null || currentEntityAccountNumber.value == '' || currentEntityAccountNumber.value === undefined) {
    return
  }

  entityServices.value = await fetchUserEntityServices(
    currentEntityAccountNumber.value,
    currentEntityId.value,
    GedContext.LEGACY,
  )

  // Using services guids to get root folders
  const { foldersByService } = await fetchServicesFolders(
    entityServices.value,
    currentEntityAccountNumber.value,
    currentEntityId.value,
  )

  servicesFolders.value = foldersByService
}

onMounted(async () => {
  await fetchGedFoldersAndServices()
})

watch(currentEntityAccountNumber, async () => {
  // Fetching folders and services when account number changes
  await fetchGedFoldersAndServices()
})
</script>

<i18n lang="yaml">
en-US:
  uploadDocumentByEmail: 'Upload document using email address'
fr-FR:
  uploadDocumentByEmail: 'Déposer un document par e-mail'
</i18n>
