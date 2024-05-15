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
        padding-x--3
        shadow--2
      "
    >
      <PIcon>
        <component :is="iconComponent" />
      </PIcon>
      <div class="padding-left--2">
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
import { PIcon } from '@kpmg/styleguide'
import { getFileIcon } from '@/modules/common/helpers/iconsHelper'
import type { DocumentDragGhostProps } from './DocumentDragGhost'

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
.document-drag-ghost {
  position: absolute;
  left: -1000px;

  &__content {
    background: var(--el-color-persian-500);
    position: absolute;
    top: 0;
    left: 0;
    min-width: 200px;
    color: white;
    border-radius: 8px;
    font-weight: 600;
  }

  &__multiple-outline {
    position: absolute;
    width: calc(100% + 4px);
    height: 100%;
    top: 4px;
    left: 0;
    background: var(--el-color-persian-300);
    border-radius: 8px;
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
