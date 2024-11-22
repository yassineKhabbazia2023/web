<template>
  <div
    class="document-drag-ghost"
    :class="{'document-drag-ghost--multiple': isMultiple }"
  >
    <div class="document-drag-ghost__multiple-outline"/>

    <div
      class="
        document-drag-ghost__content
        flex
        flex--align-items-center
        padding-y--4
        padding-x--4
        shadow--2
      "
    >
      <PIcon>
        <component :is="iconComponent" />
      </PIcon>
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
import { getFileIcon } from '@ged/modules/common/helpers/iconsHelper'
import type { DocumentDragGhostProps } from './DocumentDragGhostTypes'

const props = withDefaults(
  defineProps<DocumentDragGhostProps>(),
  {
    disabled: false,
  },
)

const isMultiple = computed(() => props.numberOfDocuments > 1)
const iconComponent = computed(() => getFileIcon(props.displayedName))

</script>

<style lang="scss" scoped>
$ghostWidth: 276px;
$ghostHeight: 56px;
.document-drag-ghost {
  $self: &;

  position: absolute;
  left: -1000px;
  width: $ghostWidth;
  height: $ghostHeight;

  &__content {
    background: var(--el-color-persian-500);
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
    background: var(--el-color-persian-300);
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
    background: var(--el-color-functionnal-red);
    z-index: 10;
    line-height: 12px;
  }
}
</style>
