<template>
  <div
    class="document-drag-ghost"
    :class="{'document-drag-ghost--multiple': isMultiple }"
  >
    <div class="document-drag-ghost__multiple-outline" />

    <div
      class="
        document-drag-ghost__content
        flex
        flex--align-items-center
        padding-y--4
        padding-x--4
      "
    >
      <PIcon :pName="iconName" />
      <div class="document-drag-ghost__filename padding-left--4">
        {{ displayedName }}
      </div>
      <div
        class="
          document-drag-ghost__number-of-documents
          flex
          flex--justify-content-center
          flex--align-items-center
          padding--1
        "
      >
        {{ numberOfDocuments }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { PIcon } from '@pulse/styleguide/components'
import { getIconFileName } from '@pulse/styleguide'
import { getFileExtension } from '@pulse/core'
import type { DocumentDragGhostProps } from './DocumentDragGhostTypes'

const props = withDefaults(
  defineProps<DocumentDragGhostProps>(),
  {
    disabled: false,
  },
)

const isMultiple = computed(() => props.numberOfDocuments > 1)
const iconName = computed(() => {
  const extension = getFileExtension(props.displayedName)

  return getIconFileName(extension, 'fileText')
})
</script>

<style lang="scss" scoped>
$ghostWidth: 185px;
$ghostHeight: 56px;
.document-drag-ghost {
  $self: &;

  position: absolute;
  left: -1000px;
  width: $ghostWidth;
  height: $ghostHeight;

  &__content {
    background: var(--p-jungle-400);
    position: absolute;
    top: 0;
    left: 0;
    width: $ghostWidth;
    height: $ghostHeight;
    color: white;
    border-radius: var(--el-border-radius-base);
    font-weight: 600;
  }

  &__multiple-outline {
    display: none;
    position: absolute;
    width: $ghostWidth;
    height: $ghostHeight;
    top: 8px;
    left: 8px;
    background: var(--p-jungle-300);
    border-radius: var(--el-border-radius-base);
  }

  &--multiple #{$self}__multiple-outline {
    display: block;
  }

  &__filename {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  &__number-of-documents {
    min-width: 24px;
    min-height: 24px;
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(50%, -50%);
    border-radius: 100%;
    border: 2px solid white;
    background: var(--p-red-500);
    z-index: 10;
    line-height: 12px;
  }
}
</style>
