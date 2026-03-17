<template>
  <div
    class="position--relative"
  >
    <POverlay
      v-if="apiCallStatus === APICallStatus.SUCCESS"
      pHasOverEffect
      pBackgroundColor="neutral-gray-500"
      class="position--absolute"
    >
      <div
        class="margin-y--12"
      >
        <PButton
          pType="primary"
          data-testid="open-pdf-button"
          @click="onClickOpenPdf"
        >
          {{ t('openPdf') }}
        </PButton>
      </div>
    </POverlay>

    <POverlay
      v-if="apiCallStatus === APICallStatus.LOADING"
      class="position--absolute"
    >
      <div
        class="margin-y--12"
      >
        <PLoader
          pType="primary"
          pSize="50"
        />
      </div>
    </POverlay>

    <CatalogStatusError
      v-if="apiCallStatus === APICallStatus.ERROR"
      class="margin-y--12"
    />

    <PDocumentDisplay
      v-if="apiCallStatus !== APICallStatus.ERROR"
      :pSrc="offerPdf"
      :pIsLoading="apiCallStatus === APICallStatus.LOADING"
      class="height--100vh"
      pDocumentExtension="pdf"
      :errorMsgTitle="t('errorMsgTitle')"
      :errorMsgText="t('errorMsgText')"
    />
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { CatalogDrawerContentPdfProps } from './catalog-drawer-content-pdf.types'
import { PButton, PDocumentDisplay, PLoader, POverlay } from '@pulse/styleguide/components'
import { APICallStatus } from '@pulse/common/enums'
import CatalogStatusError from '../catalog-status-error/catalog-status-error.vue'
import { onMounted } from 'vue'
import { AmplitudeService } from '@pulse/common/services/amplitude'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      openPdf: 'Show',
      errorMsgTitle: 'Preview unavailable',
      errorMsgText: 'The document format is not supported',
    },
    'fr-FR': {
      openPdf: 'Agrandir',
      errorMsgTitle: 'Aperçu indisponible',
      errorMsgText: 'Le format de document n\'est pas supporté',
    },
  },
})

defineProps<CatalogDrawerContentPdfProps>()
const emit = defineEmits<{
  'open-pdf': []
}>()

function onClickOpenPdf() {
  emit('open-pdf')
}

onMounted(() => {
  AmplitudeService.track('Offer Detail Consulted', {
    offer_detail_consulted_tab: "Fiche de l'offre",
  })
})
</script>

