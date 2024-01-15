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
        Open
      </PButton>
      <tr/>
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
        <template #media>
           <PDocumentDisplay
            pSrc="src\organisms\PDocumentViewer\modele_de_facture.pdf#view=fit"
            :pIsLoading="false"
            pDocumentExtension="pdf"
            errorMsgTitle="Aperçu indisponible"
            errorMsgText="Le format de document n'est pas supporté"
           />
        </template>
        <template #content>
          <div> You can find here for exp Document details such as owner email ...</div>
        </template>
      </PDocumentViewer>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import PButton from '@/atoms/PButton'
import PDocumentViewer from './'
import PDocumentDisplay from '@/molecules/PDocumentDisplay'
import type { PDocumentViewerProps } from './PDocumentViewerTypes'
import { PIFiletypePdf } from '@/atoms/PIcon/components'

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
  pDirection: ref<PDocumentViewerProps['pDirection']>('rtl')
})
</script>

<docs lang="md">
  ## Document Viewer
  This component is used as Document Viewer.

  <div class="responsive-iframe-container">
    <iframe class="responsive-iframe" src="https://www.figma.com/file/YPTVJIaxGaxnmuYHPkkZvi/GED---WIP?node-id=4309%3A31746&mode=dev" allowfullscreen></iframe>
  </div>
</docs>
