<template>
  <div
    class="
      p-upload-file-line
      flex flex--align-items-center
      flex--justify-content-space-between
      padding-x--4
    "
    :class="pClassMapper"
  >
    <div class="flex flex--align-items-center overflow-hidden padding-y--2">
      <span class="flex margin-right--2 flex-grow--0 flex--shrink-0">
        <PLoader
          v-if="pStatus === 'uploading'"
          pSize="16"
          pType="primary"
        />
        <PIcon
          v-else
          data-testid="upload-fileline-icon"
          class="p-upload-file-line__icon"
          size="16"
        >
          <PIExclamationTriangle
            v-if="pStatus === 'fail'"
            data-testid="upload-fileline-icon-fail"
          />
          <component
            v-if="pIcon && pStatus !== 'fail'"
            data-testid="upload-file-line-icon-component"
            :is="iconResolver(pIcon)" />
        </PIcon>
      </span>
      <p class="p-upload-file-line__title overflow-hidden">
        {{ pFile.name }}
      </p>
    </div>
    <PTooltip
      v-if="pHasButton && pTitleButton && !['uploading', 'fail'].includes(pStatus)"
      :pContent="pTitleButton"
      data-testid="upload-fileline-action"
    >
      <PButton
        pType="generic"
        pSize="small"
        pIconOnly
        data-testid="upload-fileline-action-button"
        class="flex--grow-0 flex--shrink-0 margin-left--3"
        @click="handleClickFileAction"
      >
        <PIcon v-if="pButtonIcon">
          <component :is="iconResolver(pButtonIcon)" />
        </PIcon>
      </PButton>
    </PTooltip>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { iconResolver } from '@styleguide/utils/iconResolver'
import PButton from '@styleguide/atoms/PButton'
import PLoader from '@styleguide/atoms/PLoader'
import PTooltip from '@styleguide/atoms/PTooltip'
import PIcon from '@styleguide/atoms/PIcon'
import { PIExclamationTriangle } from '@styleguide/atoms/PIcon/components'
import type { PUploadFileLineProps } from './PUploadFileLineTypes'
import { type UploadFile, type UploadRawFile } from 'element-plus'

const props = withDefaults(defineProps<PUploadFileLineProps>(), {
  pColor: 'white',
})

const emit = defineEmits<{
  'on-click-file-action': [UploadFile | UploadRawFile]
}>()

const handleClickFileAction = () => {
  emit('on-click-file-action', props.pFile)
}

const pClassMapper = computed(() => ({
  [`p-upload-file-line--status-${props.pStatus}`]: true,
  [`p-upload-file-line--color-${props.pColor}`]: true,
}))
</script>

<style lang="scss" scoped>
.p-upload-file-line {
  $self: &;

  width: 100%;

  & + #{$self} {
    margin-top: 0.8rem;
  }

  &--color {
    &-persian {
      padding-top: 5px;
      padding-bottom: 5px;
      background: var(--el-color-persian-50);
      border-radius: var(--el-border-radius-base);

      #{$self}__icon {
        color: var(--el-color-neutral-gray-900);
      }
    }

    &-white {
      background: var(--el-color-base-white);
      border-bottom: 1px solid transparent;

      &:not(:last-child) {
        border-color: var(--el-color-neutral-gray-100);
      }
    }
  }

  &--status {
    &-uploading,
    &-fail {
      #{$self}__title {
        color: var(--el-color-neutral-gray-500);
      }
    }

    &-fail {
      #{$self}__icon {
        color: var(--el-color-functionnal-red);
      }
    }
  }

  &__title {
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 1.4rem;
    color: var(--el-color-neutral-gray-900);
  }

  &__icon {
    color: var(--el-color-neutral-gray-300);
  }
}
</style>
