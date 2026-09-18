<template>
  <!-- Kept on the canvas with its tools: a widget the editor hides is one its author cannot reach -->
  <article
    class="
      key-moments-editor-placeholder
      flex
      flex--direction-column
      flex-gap--2
      padding--4
    "
    :data-testid="`key-moments-settings-widget-${widgetId}-placeholder`"
  >
    <header
      class="
        flex
        flex--align-items-center
        flex--justify-content-space-between
        flex-gap--2
      "
    >
      <h3
        class="
          key-moments-editor-placeholder__title
          margin--0
          font-size--14
          font-semibold
        "
      >
        {{ title }}
      </h3>

      <slot name="toolbar" />
    </header>

    <p
      class="
        key-moments-editor-placeholder__text
        margin--0
        font-size--12
      "
    >
      {{ t('keyMoments.settings.editor.widgetUnrendered') }}
    </p>
  </article>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

defineProps<{
  widgetId: string
  title: string
}>()

const { t } = useI18n()
</script>

<style scoped lang="scss">
.key-moments-editor-placeholder {
  border: 1px dashed var(--p-text-neutral);
  border-radius: 4px;

  &__title {
    color: var(--p-text-heading);
  }

  &__text {
    color: var(--p-text-neutral);
  }
}
</style>
