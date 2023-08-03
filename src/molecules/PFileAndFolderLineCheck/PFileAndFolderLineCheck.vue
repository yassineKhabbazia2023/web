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
      type="gradient"
      class="p-file-and-folder-line-check__loader"
      size="14"
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
      <span>{{ fileName }}</span>
      <span
        v-if="(isErrorState || isSuccessState) && additionalText"
        class="p-file-and-folder-line-check__details__additional-text"
      >
        {{ additionalText }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { iconResolver } from '@/utils/iconResolver'
import { getFileExtension } from '@/utils/strings'
import PCheckbox from '@/atoms/PCheckbox'
import PLoader from '@/atoms/PLoader'

type PFileAndFolderLineCheckProps = {
  fileName: string
  additionalText?: string
  state?: 'default' | 'loading' | 'error' | 'success'
  modelValue: boolean
}

const props = withDefaults(defineProps<PFileAndFolderLineCheckProps>(), {
  state: 'default',
  additionalText: ''
})

const emit = defineEmits(['update:modelValue'])

const isDefaultState = computed(() => props.state === 'default')
const isLoadingState = computed(() => props.state === 'loading')
const isErrorState = computed(() => props.state === 'error')
const isSuccessState = computed(() => props.state === 'success')
const cssStateClass = computed(() => {
  return isSelectedRef.value
    ? 'p-file-and-folder-line-check--selected'
    : `p-file-and-folder-line-check--${props.state}`
})

const isSelectedRef = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', !value)
  }
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
  switch (getFileExtension(props.fileName)) {
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
  width: 300px;
  border-radius: 4px;

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

    span {
      width: 214px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      height: 17px;
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
