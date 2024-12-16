<template>
  <Story
    title="4. Organisms/Error Page"
    icon="fluent:document-error-16-filled"
    :layout="{
      type: 'single',
      iframe: true
    }"
  >
    <Variant title="Default">
      <PError
        pTitle="Cette page n’existe pas."
        pDescription="Nous sommes désolés, mais la page que vous recherchez est introuvable."
        pButtonText="Retour à la page d'accueil"
        pErrorName="404"
        pErrorText="Page introuvable"
        pIllustrationName="error-page-1"
        @handle-click="logEvent('handle-click', $event)"
      >
        <template #title>
          Cette page n’existe pas.
        </template>
        <template #footer-middle-content>
          <div>
            Contact support : <span class="no-wrap">01 23 45 67 89</span>
          </div>
          <div>
            &#169; Awesome Brand
          </div>
        </template>
      </PError>
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import { logEvent } from 'histoire/client'
import PError from '.'
</script>

<docs lang="md">
  ## Error page
  This component is the layout of error pages.

  <div class="responsive-iframe-container">
    <iframe class="responsive-iframe" rc="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fdesign%2FMhjmCFckjneTs2OxrxzZzT%2F%25F0%259F%25A6%2584-UI-Pages-Bibliotheca%3Fm%3Ddev%26node-id%3D536-10199" allowfullscreen></iframe>
  </div>
</docs>
