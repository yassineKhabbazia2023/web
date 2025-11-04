<template>
  <div
    class="
      flex
      flex--direction-column
      flex--justify-content-space-between
      height--100
    "
  >
    <PennylaneDocumentsHeader
      :lastSynchroDate="pennylaneLastSynchroDate"
      class="margin-bottom--2"
    />
    <PennylaneDocumentsWrapper
      data-testid="pennylane-documents-widget"
      class="flex--grow-1"
      :accountId
      :accountName
      :accountNumber
      :apiCallStatus
      :displayMode="PennylaneDocumentWrapperDisplayMode.IN_LIST"
      :pennylaneDocuments
      :pennylaneLastSynchroDate
      amplitudeLocalisation="homepage"
    />
    <div
      class="
        flex
        flex--justify-content-flex-end
      "
    >
      <PButton
        v-if="showSeeAllDocumentsButton"
        pType="tertiary"
        @click="onClickSeeAllDocuments"
      >
        <span class="margin-right--2">{{ t('see-all-documents') }}</span>
        <PIcon
          pName="arrowRight"
        />
      </PButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { APP_ROUTES } from '@pulse/common/constants'
import { PButton, PIcon } from '@pulse/styleguide/components'
import { PennylanePermissionsManager } from '@pulse/common/managers'
import PennylaneDocumentsHeader from '@pennylane/components/pennylane-documents-header/pennylane-documents-header.vue'
import PennylaneDocumentsWrapper from '@pennylane/components/pennylane-documents-wrapper/pennylane-documents-wrapper.vue'
import { PennylaneService } from '@pulse/common/services/pennylane'
import { useCurrentEntityStore } from '@pulse/common/stores'
import type { FormattedPennylaneDocument } from '@pennylane/types/pennylane-documents.type'
import { APICallStatus } from '@pulse/common/enums'
import { logger } from '@pulse/toolbox'
import { getFormattedPennylaneDocuments } from '@pennylane/helpers/pennylane-documents.helper'
import { PennylaneDocumentWrapperDisplayMode } from '@pennylane/enums/pennylane-documents-wrapper.enum'

const router = useRouter()

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const currentEntityStore = useCurrentEntityStore()

const pennylaneDocuments = ref<FormattedPennylaneDocument[]>([])
const pennylaneLastSynchroDate = ref<Date>()
const apiCallStatus = ref<APICallStatus>(APICallStatus.IDLE)

const accountId = computed(() => currentEntityStore.currentEntityId ?? 0)
const accountName = computed(() => currentEntityStore.currentEntity?.legalName ?? '')
const accountNumber = computed(() => currentEntityStore.currentEntityAccountNumber)
const showSeeAllDocumentsButton = computed(() =>
  PennylanePermissionsManager.hasPennylaneAccountingGedV2Permission() === true &&
  pennylaneDocuments.value.length > 0 &&
  pennylaneDocuments.value.length < 5,
)

onMounted(async () => {
  const pathPrefix = 'Pennylane'
  try {
    apiCallStatus.value = APICallStatus.LOADING
    const documentQueryResult = await PennylaneService.getDocuments(accountNumber.value, accountId.value)

    pennylaneDocuments.value = getFormattedPennylaneDocuments(documentQueryResult.items, pathPrefix)
    const lastSynchroDate = new Date(documentQueryResult.lastSynchroDate)
    if (lastSynchroDate.toString() !== 'Invalid Date') {
      // avoid invalid date (if lastSynchroDate is undefined for example)
      pennylaneLastSynchroDate.value = lastSynchroDate
    }
    apiCallStatus.value = APICallStatus.SUCCESS
  } catch (e) {
    logger.error('Error while loading pennylane documents', e)
    apiCallStatus.value = APICallStatus.ERROR
  }
})

function onClickSeeAllDocuments() {
  router.push({
    name: APP_ROUTES.entity.pennylaneAccounting.gedV2.name,
  })
}
</script>


<i18n lang="yaml">
  en-US:
    see-all-documents: 'See all documents'
  fr-FR:
    see-all-documents: 'Voir tous les documents'
</i18n>
