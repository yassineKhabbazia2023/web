<template>
  <PAlert
    pType="warning"
    data-testid="key-moments-settings-editor-warnings"
  >
    <p class="font-semibold">
      {{ t('keyMoments.settings.editor.warnings.title', { count: warnings.length }) }}
    </p>
    <ul class="margin-top--2">
      <li
        v-for="(warning, index) in warnings"
        :key="`${warning.message}-${index}`"
      >
        {{ warning.message }}
      </li>
    </ul>
  </PAlert>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PAlert } from '@pulse/styleguide/components'
import type { EditorWarning } from '../../stores/template-editor.store.types'

defineProps<{
  /** Already said in the reader's language: the banner only lists them */
  warnings: EditorWarning[]
}>()

const { t } = useI18n()
</script>
