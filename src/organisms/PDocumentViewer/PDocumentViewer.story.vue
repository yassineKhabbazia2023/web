<template>
  <Story
    title="4. Organisms/Document Viewer"
    :layout="{
      type: 'single',
      iframe: true
    }"
  >
    <Variant title="Document Viewer">
      <PButton
        pPlain
        @click="isDrawerOpened = !isDrawerOpened"
      >
        Open / close
      </PButton>
      <PDocumentViewer
        v-model="isDrawerOpened"
        :pDestroyOnClose="documentViewerBasicData.pDestroyOnClose"
        :pShowClose="documentViewerBasicData.pShowClose"
        :pSize="documentViewerBasicData.pSize"
        :pTitleDocument="documentViewerBasicData.pTitleDocument"
        :pActiveDocument="documentViewerBasicData.pActiveDocument"
        :pTotalDocuments="documentViewerBasicData.pTotalDocuments"
        :pHasIcon="documentViewerBasicData.pHasIcon"
        :pHasPagination="documentViewerBasicData.pHasPagination"
        :pShowPreviousDocument="documentViewerBasicData.pShowPreviousDocument"
        :pShowNextDocument="documentViewerBasicData.pShowNextDocument"
        :pShowCloseButton="documentViewerBasicData.pShowCloseButton"
        :pDirection="documentViewerBasicData.pDirection"
      >
        <template #iconDocument>
          <PIcon>
            <PIFiletypePdf />
          </PIcon>
        </template>
      </PDocumentViewer>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import PButton from '@/atoms/PButton'
import PDocumentViewer from './'
import type { PDocumentViewerProps } from './PDocumentViewerTypes'

const isDrawerOpened = ref(false)

const documentViewerBasicData = reactive({
  pShowClose: false,
  pSize: '100%',
  pDestroyOnClose: true,
  pTitleDocument: 'Facture-achat_20643228.pdf',
  pActiveDocument: 5,
  pTotalDocuments: 25,
  pHasIcon: true,
  pHasPagination: true,
  pShowPreviousDocument: true,
  pShowNextDocument: true,
  pShowCloseButton: true,
  pDirection: ref<PDocumentViewerProps['pDirection']>('ltr')
})
</script>

<docs lang="md">
  ## Document Viewer
  This component is used as Document Viewer.

  <div class="responsive-iframe-container">
    <iframe class="responsive-iframe" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D2527%253A9324%26mode%3Ddev" allowfullscreen></iframe>
  </div>
</docs>
