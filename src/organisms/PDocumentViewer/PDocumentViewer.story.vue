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
            :pSrc="url"
            :pIsLoading="false"
            :pDocumentExtension="extension"
            errorMsgTitle="Aperçu indisponible"
            errorMsgText="Le format de document n'est pas supporté"
           />
        </template>
        <template #content>
          <div> You can find here for exp Document details such as owner email ...,
             please upload only a pdf file to visualize the pdf </div>
          <PUpload
            pMultiple
            :pDisabled="false"
            :pDrag="false"
            @files-selected="handleFilesSelected"
          >
            <PButton
              type="primary"
              size="small"
              :plain="false"
              :round="false"
              :disabled="false"
              :loading="false"
              :circle="false"
            >
              <PIcon class="el-button__icon--left">
                <PIUpload />
              </PIcon>
              Déposer un document pdf
            </PButton>
      </PUpload>
        </template>
      </PDocumentViewer>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import PButton from '@/atoms/PButton'
import PUpload from '@/atoms/PUpload'
import PDocumentViewer from './'
import PDocumentDisplay from '@/molecules/PDocumentDisplay'
import type { PDocumentViewerProps } from './PDocumentViewerTypes'
import { PIFiletypePdf } from '@/atoms/PIcon/components'

const isDrawerOpened = ref(false)

const documentViewerBasicData = reactive({
  pShowClose: false,
  pSize: '100%',
  pDestroyOnClose: true,
  pTitleDocument: 'Facture-achat_20643228.jpeg',
  pActiveDocument: 5,
  pTotalDocuments: 25,
  pHasIcon: true,
  pHasPagination: true,
  pShowPreviousDocument: true,
  pShowNextDocument: true,
  pShowCloseButton: true,
  pDirection: ref<PDocumentViewerProps['pDirection']>('rtl')
})
const url = ref('https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg')
const extension = ref('jpeg')
const handleFilesSelected = (data:File[]) => {
  url.value = URL.createObjectURL(data[0])
  extension.value = 'pdf'
}
</script>

<docs lang="md">
  ## Document Viewer
  This component is used as Document Viewer.

  <div class="responsive-iframe-container">
    <iframe class="responsive-iframe" src="https://www.figma.com/file/YPTVJIaxGaxnmuYHPkkZvi/GED---WIP?node-id=4309%3A31746&mode=dev" allowfullscreen></iframe>
  </div>
</docs>
