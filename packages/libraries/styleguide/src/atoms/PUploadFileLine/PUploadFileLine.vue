<template>
  <div
    class="p-upload-file-line"
    :class="pClassMapper"
  >
    <template v-if="pIsMultiLine">
      <PTooltip
        v-if="isActionButtonVisible"
        :pContent="pTitleButton"
        data-testid="upload-fileline-action"
      >
        <PButton
          class="p-upload-file-line__delete"
          data-testid="upload-fileline-action-button"
          pIconOnly
          pSize="small"
          @click="handleClickFileAction"
        >
          <PIcon
            v-if="pButtonIconName"
            :pName="pButtonIconName"
            pSize="12"
          />
        </PButton>
      </PTooltip>
      <span class="flex flex-grow--0 flex--shrink-0">
        <PLoader
          v-if="pStatus === PUploadFileLineStatus.UPLOADING"
          pSize="24"
          pType="no-color"
        />
        <PIcon
          v-else
          class="p-upload-file-line__icon"
          data-testid="upload-fileline-icon"
          pSize="24"
          :pName="mainIconName"
        />
      </span>
      <p class="p-upload-file-line__title margin-top--2">
        {{ pFile.name }}
      </p>
    </template>
    <template v-else>
      <div class="flex flex--align-items-center overflow-hidden padding-y--2">
        <span class="flex margin-right--2 flex-grow--0 flex--shrink-0">
          <PLoader
            v-if="pStatus === PUploadFileLineStatus.UPLOADING"
            pSize="16"
            pType="no-color"
          />
          <PIcon
            v-else
            class="p-upload-file-line__icon"
            data-testid="upload-fileline-icon"
            :pName="mainIconName"
            pSize="16"
          />
        </span>
        <p class="p-upload-file-line__title overflow-hidden">
          {{ pFile.name }}
        </p>
      </div>
      <PTooltip
        v-if="isActionButtonVisible"
        data-testid="upload-fileline-action"
        :pContent="pTitleButton"
      >
        <PButton
          class="flex--grow-0 flex--shrink-0 margin-left--3"
          data-testid="upload-fileline-action-button"
          pIconOnly
          pSize="small"
          @click="handleClickFileAction"
        >
          <PIcon
            v-if="pButtonIconName"
            :pName="pButtonIconName"
          />
        </PButton>
      </PTooltip>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import PButton from '../../atoms/PButton'
import PLoader from '../../atoms/PLoader'
import PTooltip from '../../atoms/PTooltip'
import PIcon from '../../atoms/PIcon'
import type { PUploadFileLineProps } from './PUploadFileLineTypes'
import { getMainIconName } from './PUploadFileLineUtils'
import { PUploadFileLineStatus } from './PUploadFileLine.enums'
import { type UploadFile, type UploadRawFile } from 'element-plus'

const props = withDefaults(defineProps<PUploadFileLineProps>(), {
  pColor: 'white',
  pIsMultiLine: false,
})

const isActionButtonVisible = computed(() =>
  props.pHasButton === true
  && props.pTitleButton !== undefined
  && props.pTitleButton !== ''
  && props.pStatus !== PUploadFileLineStatus.UPLOADING
  && props.pStatus !== PUploadFileLineStatus.FAIL,
)

const emit = defineEmits<{
  'on-click-file-action': [UploadFile | UploadRawFile]
}>()

const handleClickFileAction = () => {
  emit('on-click-file-action', props.pFile)
}

const pClassMapper = computed(() => ({
  [`p-upload-file-line--status-${props.pStatus}`]: true,
  [`p-upload-file-line--color-${props.pColor}`]: true,
  'p-upload-file-line--multi-line': props.pIsMultiLine,
}))

const mainIconName = computed(() => getMainIconName(props.pStatus, props.pIconName))
</script>

<style lang="scss" scoped>
.p-upload-file-line {
  $self: &;

  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-left: 1.6rem;
  padding-right: 1.6rem;

  & + #{$self} {
    margin-top: 0.8rem;
  }

  &--color {
    &-persian {
      padding-top: 5px;
      padding-bottom: 5px;
      background: var(--p-jungle-75);
      border-radius: var(--el-border-radius-base);
    }

    &-white {
      background: var(--p-white);
      border-bottom: 1px solid transparent;

      &:not(:last-child) {
        border-color: var(--p-gray-100);
      }
    }
  }

  &--status {
    &-uploading {
      background: var(--p-surface-neutral-lighter);

      #{$self}__title {
        color: var(--p-text-neutral);
      }
    }

    &-fail {
      background: var(--p-surface-error);

      #{$self}__title {
        color: var(--p-text-error);
      }

      #{$self}__icon {
        color: var(--p-icon-error);
      }
    }

    &-success {
      background: var(--p-surface-success);
    }

    &-ready {
      background: var(--p-black-rock-100);
    }
  }

  &--multi-line {
    position: relative;
    flex-direction: column;
    padding: 1.2rem;
    border: 1px dashed var(--el-border-color);
    border-radius: var(--el-border-radius-small);

    #{$self}__delete {
      position: absolute;
      top: 0;
      right: 0;
    }
  }

  &__title {
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 1.4rem;
    color: var(--p-gray-900);
  }

  &__icon {
    color: var(--p-black-rock-900);
  }

  :deep(.p-loader__icon) {
    color: var(--p-black-rock-900);
  }
}
</style>
