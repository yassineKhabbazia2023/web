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
      v-if="!isDefaultState && !isLoadingState"
      size="14"
      class="p-file-and-folder-line-check__icon"
    >
      <PICheckCircle
        v-if="isSuccessState"
        class="p-file-and-folder-line-check__icon--success"
      />
      <PIExclamationTriangle
        v-else-if="isErrorState"
        class="p-file-and-folder-line-check__icon--error"
      />
    </PIcon>
    <PIcon size="16" class="p-file-and-folder-line-check__file-icon">
      <component :is="fileIconComponent"></component>
    </PIcon>
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
import { iconResolver } from '@/utils/iconResolver'
import { getFileExtension } from '@/utils/fileExtension'
import PCheckbox from '@/atoms/PCheckbox'
import PLoader from '@/atoms/PLoader'
import type { PFileAndFolderLineCheckProps } from './PFileAndFolderLineCheckTypes'

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
  if (!isDefaultState.value) emit('update:modelValue', false)
})

const isCheckboxDisplayed = computed(() => isDefaultState.value)

const fileIconComponent = computed(() => {
  switch (getFileExtension(props.pFileName)) {
    case 'pdf':
      return iconResolver('PIFiletypePdf')

    default:
      return iconResolver('PIFileText')
  }
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
      color: var(--el-color-functionnal-green);
    }
    &--error {
      color: var(--el-color-functionnal-orange);
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
      color: var(--el-color-neutral-gray-500);
    }
  }

  &--default {
    &:hover {
      background: var(--el-color-persian-50);
      cursor: pointer;
    }

    #{$self}__file-icon {
      color: var(--el-color-neutral-gray-300);
    }
  }

  &--selected {
    color: var(--el-color-base-persian);
    font-weight: 600;
    background-color: var(--el-color-persian-50);
    cursor: pointer;
  }

  &--error #{$self}__file-icon {
    color: var(--el-color-neutral-gray-300);
  }
}
</style>
