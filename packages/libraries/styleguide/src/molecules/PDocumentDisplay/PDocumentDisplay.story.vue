<template>
  <Story
    title="3. Molecules/Document Display"
    :layout="{
      type: 'single',
      iframe: true
    }"
  >
    <Variant title="Document Viewer image ">
      <PDocumentDisplay
        style="height: 100vh;"
        pSrc="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
        :pIsLoading="false"
        pDocumentExtension="jpeg"
        errorMsgTitle="Aperçu indisponible"
        errorMsgText="Le format de document n'est pas supporté"
      />
    </Variant>
    <Variant title="Document Viewer loading ">
      <PDocumentDisplay
        style="height: 100vh;"
        pSrc="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
        pIsLoading
        pDocumentExtension="jpeg"
        errorMsgTitle="Aperçu indisponible"
        errorMsgText="Le format de document n'est pas supporté"
      />
    </Variant>
    <Variant title="Document Viewer not allowed ">
      <PDocumentDisplay
        style="height: 100vh;"
        pSrc="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
        :pIsLoading="false"
        pDocumentExtension="jpEEeg"
        errorMsgTitle="Aperçu indisponible"
        errorMsgText="Le format de document n'est pas supporté"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import PDocumentDisplay from '@styleguide/molecules/PDocumentDisplay'
</script>
<docs lang="md">
  ## Document Viewer
  This component is used as Document Display.

  <div class="responsive-iframe-container">
    <iframe class="responsive-iframe" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D2527%253A9324%26mode%3Ddev" allowfullscreen></iframe>
  </div>
</docs>

