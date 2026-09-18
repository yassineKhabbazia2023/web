<template>
  <div
    class="
      flex
      flex--align-items-center
      flex-gap--1
    "
  >
    <!-- Sortable listens on the handle alone, so text in the block stays selectable -->
    <span
      v-if="canMove"
      class="key-moments-editor-handle"
      :title="t('keyMoments.settings.editor.toolbar.move')"
      :data-testid="`${testIdPrefix}-handle`"
    >
      <PIcon pName="arrowDownUp" />
    </span>

    <PButton
      pSize="small"
      pIconOnly
      pType="tertiary"
      :aria-label="t('keyMoments.settings.editor.toolbar.edit')"
      :pTestId="`${testIdPrefix}-edit-button`"
      @click="emit('edit')"
    >
      <PIcon pName="pencilSquare" />
    </PButton>

    <PButton
      v-if="canHide"
      pSize="small"
      pIconOnly
      pType="tertiary"
      :aria-label="isHidden
        ? t('keyMoments.settings.editor.toolbar.show')
        : t('keyMoments.settings.editor.toolbar.hide')"
      :pTestId="`${testIdPrefix}-visibility-button`"
      @click="emit('toggle-hidden')"
    >
      <PIcon :pName="isHidden ? 'eyeSlash' : 'eye'" />
    </PButton>

    <PButton
      pSize="small"
      pIconOnly
      pType="tertiary"
      :aria-label="t('keyMoments.settings.editor.toolbar.remove')"
      :pTestId="`${testIdPrefix}-remove-button`"
      @click="emit('remove')"
    >
      <PIcon pName="trash" />
    </PButton>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PButton, PIcon } from '@pulse/styleguide/components'

withDefaults(defineProps<{
  isHidden: boolean
  testIdPrefix: string
  canMove?: boolean
  // Only sub-sections can be hidden: a section is shown or not by what it holds
  canHide?: boolean
}>(), {
  canMove: true,
  canHide: true,
})

const emit = defineEmits<{
  edit: []
  'toggle-hidden': []
  remove: []
}>()

const { t } = useI18n()
</script>

<style scoped lang="scss">
@use '../../styles/editor';

.key-moments-editor-handle {
  @include editor.handle;
}
</style>
