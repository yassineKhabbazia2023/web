<template>
  <Story
    title="2. Atoms/UploadFileLine"
    icon="material-symbols:file-save-outline"
    :layout="{ type: 'grid', width: '400px' }"
  >
    <Variant title="Default">
      <div class="padding--4 margin--4 shadow--3">
        <PUploadFileLine
          pIcon="PIFiletypePdf"
          :pFile="fileList[0]"
          :pStatus="fileList[0].status"
          pHasButton
          pButtonIcon="PITrash"
          pTitleButton="Supprimer le document"
        />
        <PUploadFileLine
          :pFile="fileList[1]"
          :pStatus="fileList[1].status"
          pIcon="PIFiletypePdf"
        />
        <PUploadFileLine
          :pFile="fileList[2]"
          :pStatus="fileList[2].status"
          pIcon="PIFiletypePdf"
          pHasButton
          pButtonIcon="PITrash"
          pTitleButton="Supprimer le document"
        />
      </div>
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import PUploadFileLine from '@/atoms/PUploadFileLine'
import { type UploadFile } from 'element-plus'

const fileList: UploadFile[] = [
  {
    name: 'Nom du document.pdf',
    status: 'success',
    uid: 1,
  },
  {
    name: 'Image.jpeg',
    status: 'uploading',
    uid: 2,
  },
  {
    name: 'Test.GIF',
    status: 'fail',
    uid: 3,
  },
]
</script>

<docs lang="md">
  # Upload File Line type properties
  | Property          | Type                | Description                                                                                   |                                                                                                                                                                         |
  |-------------------|---------------------|-----------------------------------------------------------------------------------------------|
  | pIcon             | Component | string  | Icon du type de fichier qui est uploadé                                                       |                                                                                                                                                                         |
  | pFile             | Interface PUploadFile | Props du fichier uploadé                                                                        |
  | pStatus           | 'uploading' | 'success' | 'ready' | 'fail' | Statut du téléchargement du fichier (vient de la doc Element Plus)     |
  | pHasButton        | boolean             | Si le statut est 'uploading' ou 'error', le bouton ne s'affichera pas.                        |
  | pButtonIcon       | Component | string  | Si le bouton est set à true, il faut set une icone car c'est un bouton icone                  |
  | pTitleButton      | string              | Si le bouton est set à true, étant un bouton icone, un tooltip a été rajouté pour mettre de connaître l'action qui sera effectuée |                                                                                                                  |

  <div class="responsive-iframe-container">
    <iframe class="responsive-iframe" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D11208%253A6069%26mode%3Ddev" allowfullscreen></iframe>
  </div>
</docs>
