<template>
  <Story
    title="4. Organisms/Maintenance"
    icon="fluent:document-error-16-filled"
    :layout="{
      type: 'single',
      iframe: true
    }"
  >
    <Variant title="Default">
      <PMaintenance
        pIllustrationName="error-page-1"
      >
        <template #title>
          <span>
            La plateforme est en
          </span>
          <span class="text-color--secondary-amethyste">maintenance</span>
        </template>

        <template #subtitle>
          La plateforme est actuellement en maintenance.
          Nous faisons le nécessaire pour rétablir l’accès dans les plus brefs délais.
          Merci de votre patience.
        </template>

        <template #footer>
          <ul class="list-style-none">
            <li>Mentions légales</li>
            <li>Politique de confidentialité</li>
            <li>Contact Support : 09 73 73 3000</li>
            <li>© 2025 RYDGE Conseil</li>
          </ul>
        </template>
      </PMaintenance>
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import PMaintenance from '.'
</script>
