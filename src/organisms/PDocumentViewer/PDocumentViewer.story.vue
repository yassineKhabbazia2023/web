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
        plain
        @click="isDrawerOpened = !isDrawerOpened"
      >
        Open / close
      </PButton>
      <PDocumentViewer
        v-model="isDrawerOpened"
        :titleDocument="documentViewerBasicData.titleDocument"
        :activeDocument="documentViewerBasicData.activeDocument"
        :totalDocuments="documentViewerBasicData.totalDocuments"
        :hasIcon="documentViewerBasicData.hasIcon"
        :hasPagination="documentViewerBasicData.hasPagination"
        :showPreviousDocument="documentViewerBasicData.showPreviousDocument"
        :showNextDocument="documentViewerBasicData.showNextDocument">
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
import PDocumentViewer from './'
import { reactive, ref } from 'vue'
import PButton from '@/atoms/PButton'

const isDrawerOpened = ref(false)

const documentViewerBasicData = reactive({
  titleDocument: 'Facture-achat_20643228.pdf',
  activeDocument: 5,
  totalDocuments: 25,
  hasIcon: true,
  hasPagination: true,
  showPreviousDocument: true,
  showNextDocument: true,
  showCloseButton: true
})
</script>

<docs lang="md">
  ## Document Viewer
  This component is used as Document Viewer.

  <div class="responsive-iframe-container">
    <iframe class="responsive-iframe" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D2527%253A9324%26mode%3Ddev" allowfullscreen></iframe>
  </div>
</docs>
