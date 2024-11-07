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
        pDescription="Nous sommes désolés, mais la page que vous recherchez est introuvable."
        pButtonText="Retour à la page d'accueil"
        pErrorName="404"
        pErrorText="Page introuvable"
        pIllustrationName="error-generic"
      >
        <template #title>
          Oups... Cette page n’existe pas.
        </template>
      </PError>
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import PError from '.'
</script>

<docs lang="md">
  ## Error page
  This component is the layout of error pages.

  <div class="responsive-iframe-container">
    <iframe class="responsive-iframe" rc="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fdesign%2FMhjmCFckjneTs2OxrxzZzT%2F%25F0%259F%25A6%2584-UI-Pages-Bibliotheca%3Fm%3Ddev%26node-id%3D536-10199" allowfullscreen></iframe>
  </div>
</docs>
