<template>
  <PAlert
    pType="error"
    data-testid="key-moments-settings-editor-server-error"
  >
    <p class="font-semibold">
      {{ title }}
    </p>

    <ul
      v-if="error.entries.length > 0"
      class="margin-top--2"
    >
      <li
        v-for="(entry, index) in error.entries"
        :key="`${entry.pointer ?? ''}-${index}`"
      >
        <span
          v-if="entry.pointer !== undefined && entry.pointer !== ''"
          class="font-semibold"
        >{{ entry.pointer }} — </span>{{ entry.detail }}
      </li>
    </ul>

    <!--
      A version a publication pins never changes: the only way out is to carry
      the changes to a version of their own, so the way out is offered here.
    -->
    <PButton
      v-if="isVersionLocked"
      class="margin-top--3"
      pSize="small"
      pType="secondary"
      pTestId="key-moments-settings-editor-locked-new-version-button"
      @click="emit('new-version')"
    >
      {{ t('keyMoments.settings.editor.newVersion') }}
    </PButton>
  </PAlert>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { PAlert, PButton } from '@pulse/styleguide/components'
import type { ApiError } from '../../utils/api-error.utils'

const props = defineProps<{
  /** The refusal the last write came back with */
  error: ApiError
  /** Whether that refusal was a publication pinning the version on screen */
  isVersionLocked: boolean
}>()

const emit = defineEmits<{
  'new-version': []
}>()

const { t } = useI18n()

/**
 * Worded on the code the microservice names its own refusals by, and on its own
 * title for everything it has no code for.
 */
const title = computed(() => {
  if (props.isVersionLocked) {
    return t('keyMoments.settings.editor.refusals.locked')
  }

  if (props.error.code === 'schema-invalid') {
    return t('keyMoments.settings.editor.refusals.schemaInvalid')
  }

  if (props.error.code === 'unknown-citations') {
    return t('keyMoments.settings.editor.refusals.unknownCitations')
  }

  return props.error.detail ?? props.error.title ?? t('keyMoments.settings.editor.saveError')
})
</script>
