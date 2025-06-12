<template>
  <PDrawer
    v-model:modelValue="internalIsOpened"
    @close-drawer-button="closeDrawer"
  >
    <template #header-prefix>
      <div
        class="font-large"
      >
        {{ offer.title }}
      </div>
    </template>
    <div
      class="position--relative"
    >
      <POverlay
        v-if="loadingStatus === APICallStatus.SUCCESS"
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
        v-if="loadingStatus === APICallStatus.LOADING"
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
        v-if="loadingStatus === APICallStatus.ERROR"
        class="margin-y--12"
      />

      <PDocumentDisplay
        v-if="loadingStatus !== APICallStatus.ERROR"
        :pSrc="offerPdf"
        :pIsLoading="loadingStatus === APICallStatus.LOADING"
        class="height--100vh"
        pDocumentExtension="pdf"
        :errorMsgTitle="t('errorMsgTitle')"
        :errorMsgText="t('errorMsgText')"
      />
    </div>

    <template #footer>
      <div class="flex flex--justify-content-flex-end">
        <PButton
          pType="primary"
          pPlain
          data-testid="catalog-drawer-close-button"
          @click="closeDrawer"
        >
          {{ t('close') }}
        </PButton>
      </div>
    </template>
  </PDrawer>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { CatalogDrawerProps } from './catalog-drawer.types'
import { PDrawer, PButton, PDocumentDisplay, PLoader, POverlay } from '@pulse/styleguide/components'
import { APICallStatus } from '@pulse/common/enums'
import CatalogStatusError from '../catalog-status-error/catalog-status-error.vue'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<CatalogDrawerProps>()
const emit = defineEmits<{
  'update:is-opened': [boolean]
  'open-pdf': []
}>()

function closeDrawer() {
  internalIsOpened.value = false
}

const internalIsOpened = computed({
  get() {
    return props.isOpened
  },
  set(value: boolean) {
    emit('update:is-opened', value)
  },
})

function onClickOpenPdf() {
  emit('open-pdf')
}
</script>

<i18n lang="yaml">
  en-US:
    close: 'Close'
    openPdf: 'Show'
    errorMsgTitle: 'Preview unavailable'
    errorMsgText: "The document format is not supported"
    loadingStatusError: 'Something went wrong'
  fr-FR:
    close: 'Fermer'
    openPdf: 'Agrandir'
    errorMsgTitle: 'Aperçu indisponible'
    errorMsgText: "Le format de document n'est pas supporté"
    loadingStatusError: 'Une erreur est survenue'
</i18n>
