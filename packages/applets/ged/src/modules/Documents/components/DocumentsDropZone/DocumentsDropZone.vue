<template>
  <div
    class="
    documents-drop-zone
    flex
    flex--align-items-center
    flex--justify-content-center
    flex--direction-column
    "
    :class="{ 'documents-drop-zone--not-allowed': !isAllowedDropZone }"
  >
    <div
      v-if="isAllowedDropZone"
      class="documents-list-wrapper__dropzone-image"
    >
      <PImage
        pType="paupulse"
        pName="document-import"
      />
    </div>
    <p
      v-if="isAllowedDropZone"
      class="text-center margin-top--2"
      data-testid="allowed-drop-text"
    >
      <span class="text-color--neutral-gray-900">{{ t('dropYourFiles') }}</span><br>
      <span class="text-color--neutral-gray-500">{{ t('maxSize') }}</span>
    </p>
    <p
      v-else-if="!isAllowedDropZone"
      data-testid="not-allowed-drop-text"
      class="
        flex
        flex--align-items-center
        flex--justify-content-center
        font-semibold
      "
    >
      <PIcon :color="AppColors.RED" pName="slashCircle" />
      <span class="padding-left--2">{{ t('dropNotAllowed') }}</span>
    </p>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { PImage, PIcon } from '@pulse/styleguide/components'
import { AppColors } from '@pulse/styleguide'
import type { DocumentsDropZoneProps } from './DocumentsDropZoneTypes'

defineProps<DocumentsDropZoneProps>()

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})
</script>

<style lang="scss" scoped>
  .documents-drop-zone {
    z-index: 2;
    position: absolute;
    left: 0;
    top: 0;
    // in order to makes the dashed borders visible on bottom and right side
    height: calc(100% - 2px);
    width: calc(100% - 2px);
    background: var(--el-color-persian-100);
    border: 1px dashed var(--el-color-persian-700);

    &--not-allowed {
      background: var(--el-color-neutral-gray-50);
      border: 1px dashed var(--el-color-persian-200);
    }

    // Used to prevent dragover to be triggered and make the component blink
    & * {
      position: relative;
      pointer-events: none;
    }
  }
  .documents-list-wrapper__dropzone-image {
    width: 221px;
  }
</style>

<i18n lang="yaml">
  en-US:
    dropYourFiles: 'Drop your file'
    maxSize: '(max. 50MB)'
    dropNotAllowed: "Drag and drop is not allowed, you don't have the appropriate rights."
  fr-FR:
    dropYourFiles: 'Glisser-déposer le ou les fichiers ici'
    maxSize: '(max. 50MB)'
    dropNotAllowed: "Glisser-déposer non autorisé, vous n'avez pas les droits."
</i18n>
