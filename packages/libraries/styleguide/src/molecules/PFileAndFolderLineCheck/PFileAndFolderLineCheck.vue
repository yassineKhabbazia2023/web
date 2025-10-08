<template>
  <div
    class="p-file-and-folder-line-check"
    :class="cssStateClass"
    @click="setIsSelected"
  >
    <PCheckbox
      v-if="isCheckboxDisplayed"
      v-model="isSelectedRef"
      class="p-file-and-folder-line-check__checkbox"
    />
    <PLoader
      v-else-if="isLoadingState"
      pType="gradient"
      class="p-file-and-folder-line-check__loader"
      pSize="14"
    />
    <PIcon
      v-if="stateIconName !== undefined"
      size="14"
      class="p-file-and-folder-line-check__icon"
      :class="{
        'p-file-and-folder-line-check__icon--success': isSuccessState,
        'p-file-and-folder-line-check__icon--error': isErrorState,
      }"
      :pName="stateIconName"
    />
    <PIcon
      size="16"
      class="p-file-and-folder-line-check__file-icon"
      :pName="fileExtensionIconName"
    />
    <div class="p-file-and-folder-line-check__details">
      <div class="ellipsed-text">
        {{ pFileName }}
      </div>
      <div
        v-if="(isErrorState || isSuccessState) && pAdditionalText"
        class="p-file-and-folder-line-check__details__additional-text ellipsed-text"
      >
        {{ pAdditionalText }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { getFileExtension } from '@pulse/toolbox'
import PCheckbox from '../../atoms/PCheckbox'
import PIcon from '../../atoms/PIcon'
import PLoader from '../../atoms/PLoader'
import type { PFileAndFolderLineCheckProps } from './PFileAndFolderLineCheckTypes'
import type { IconName } from '../../types/IconName.types'

const props = withDefaults(defineProps<PFileAndFolderLineCheckProps>(), {
  pState: 'default',
  pAdditionalText: '',
})

const emit = defineEmits(['update:modelValue'])

const isDefaultState = computed(() => props.pState === 'default')
const isLoadingState = computed(() => props.pState === 'loading')
const isErrorState = computed(() => props.pState === 'error')
const isSuccessState = computed(() => props.pState === 'success')
const cssStateClass = computed(() => {
  return isSelectedRef.value
    ? 'p-file-and-folder-line-check--selected'
    : `p-file-and-folder-line-check--${props.pState}`
})

const isSelectedRef = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', !value)
  },
})

const setIsSelected = () => {
  if (isDefaultState.value) {
    emit('update:modelValue', !isSelectedRef.value)
  }
}
watch(isDefaultState, () => {
  if (!isDefaultState.value) {
    emit('update:modelValue', false)
  }
})

const isCheckboxDisplayed = computed(() => isDefaultState.value)

const fileExtensionIconName = computed<IconName>(() => {
  const extension = getFileExtension(props.pFileName)

  return extension === 'pdf' ? 'filetypePdf' : 'fileText'
})

const stateIconName = computed<IconName | undefined>(() => {
  if (isSuccessState.value) {
    return 'checkCircle'
  }
  if (isErrorState.value) {
    return 'exclamationTriangle'
  }
  return undefined
})
</script>

<style lang="scss">
.p-file-and-folder-line-check {
  $self: &;
  display: flex;
  align-items: center;
  padding: 8px 16px;
  transition: all 100ms ease-in-out;
  width: 100%;
  border-radius: var(--el-border-radius-small);

  &__checkbox.el-checkbox,
  &__file-icon,
  &__icon {
    margin-right: 12px;
  }

  &__checkbox.el-checkbox {
    height: auto;
  }

  &__icon {
    &--success {
      color: var(--p-green-500);
    }
    &--error {
      color: var(--p-orange-500);
    }
  }

  &__loader {
    margin-right: 12px;
  }

  &__details {
    display: flex;
    flex-direction: column;
    min-width: 0;

    .ellipsed-text {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      height: 17px;
      max-width: 100%;
    }

    &__additional-text {
      font-size: 1.2rem;
      margin-top: 4px;
      color: var(--p-gray-500);
    }
  }

  &--default {
    &:hover {
      background: var(--p-jungle-75);
      cursor: pointer;
    }

    #{$self}__file-icon {
      color: var(--p-gray-300);
    }
  }

  &--selected {
    color: var(--p-black-rock-900);
    font-weight: 600;
    background-color: var(--p-jungle-75);
    cursor: pointer;
  }

  &--error #{$self}__file-icon {
    color: var(--p-gray-300);
  }
}
</style>
