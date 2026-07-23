<template>
  <div
    class="p-smart-search"
    :class="{ 'p-smart-search--disabled': pDisabled }"
    :data-testid="pTestId ?? 'p-smart-search'"
  >
    <Transition
      name="fade-drop"
      mode="out-in"
    >
      <div
        v-if="aiEnabled === false"
        key="classic"
        class="p-smart-search__classic"
        data-testid="p-smart-search-classic"
      >
        <PFormSearch
          ref="formSearchRef"
          v-model:pSearch="searchValue"
          :pAutofocus="pAutofocus"
          :pPlaceholder="pPlaceholder"
          :pClearable="pClearable"
          :pDisabled="pDisabled"
          :pMinLength="pMinLength"
          :pSearchInvalidMessage="pSearchInvalidMessage"
          class="p-smart-search__form-search"
          data-testid="p-smart-search-input"
        >
          <template
            v-if="props.pShowSmartSearchToggle === true"
            #append
          >
            <div class="flex flex--align-items-center flex-gap--2 padding-y--4">
              <PSwitch
                v-model="aiEnabled"
                :pDisabled="pDisabled"
                :pActiveColor="AppColors.JUNGLE_500"
                class="p-smart-search__switch"
                data-testid="p-smart-search-switch"
              />
              <span
                class="p-smart-search__switch-label font-size--14 text-color--text-neutral"
                data-testid="p-smart-search-switch-label"
              >
                {{ pSwitchLabel }}
              </span>
            </div>
          </template>
        </PFormSearch>
      </div>

      <div
        v-else
        key="ai"
        class="flex flex--direction-column min-width--full"
        data-testid="p-smart-search-ai"
      >
        <div
          v-if="$slots.header !== undefined"
          class="p-smart-search__header"
          data-testid="p-smart-search-header"
        >
          <slot name="header" />
        </div>
        <div
          class="
            p-smart-search__ai-content
            flex
            flex--direction-column
            bg--jungle-50
            padding--4
          "
          data-testid="p-smart-search-ai-content"
        >
          <div class="p-smart-search__ai-row flex flex-gap--2 min-width--full flex--align-items-stretch">
            <PIcon
              pName="stars"
              class="p-smart-search__ai-stars flex--shrink-0 text-color--text-body margin-top--1"
              data-testid="p-smart-search-ai-icon"
            />
            <textarea
              ref="textareaRef"
              v-model="searchValue"
              :placeholder="pAiPlaceholder"
              :disabled="pDisabled"
              class="p-smart-search__ai-textarea font-size--16 text-color--text-neutral bg--transparent flex--grow-1"
              data-testid="p-smart-search-textarea"
            />
            <div class="flex flex--direction-column flex--justify-content-space-between flex--shrink-0">
              <PSwitch
                v-if="props.pShowSmartSearchToggle === true"
                v-model="aiEnabled"
                :pDisabled="pDisabled"
                :pActiveColor="AppColors.JUNGLE_500"
                class="p-smart-search__switch"
                data-testid="p-smart-search-ai-switch"
              />
              <PButton
                pType="primary"
                :pDisabled="pDisabled === true || searchValue.trim().length === 0"
                class="p-smart-search__ai-submit padding--0"
                data-testid="p-smart-search-submit"
                @click="onAiSubmit"
              >
                <PIcon
                  pName="arrowRight"
                  class="p-smart-search__ai-submit-icon"
                />
              </PButton>
            </div>
          </div>
        </div>
        <div
          v-if="$slots.disclaimer !== undefined"
          class="p-smart-search__disclaimer"
          data-testid="p-smart-search-disclaimer"
        >
          <slot name="disclaimer" />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import { watch, nextTick, useTemplateRef } from 'vue'

import PFormSearch from '../PFormSearch/PFormSearch.vue'
import PSwitch from '../../atoms/PSwitch/PSwitch.vue'
import PButton from '../../atoms/PButton/PButton.vue'
import PIcon from '../../atoms/PIcon/PIcon.vue'
import type { PSmartSearchProps } from './PSmartSearch.types'
import { AppColors } from '../../utils/AppColorsEnum'

const props = withDefaults(defineProps<PSmartSearchProps>(), {
  pPlaceholder: '',
  pAiPlaceholder: '',
  pSwitchLabel: 'Recherche intelligente',
  pDisabled: false,
  pClearable: false,
  pMinLength: 3,
  pSearchInvalidMessage: '',
  pAutofocus: false,
  pShowSmartSearchToggle: true,
})

const emit = defineEmits<{
  'search': [value: string]
}>()

const searchValue = defineModel<string>('pSearch', { default: '' })
const aiEnabled = defineModel<boolean>('pAiEnabled', { default: false })

const formSearchRef = useTemplateRef('formSearchRef')
const textareaRef = useTemplateRef('textareaRef')

function onAiSubmit() {
  if (searchValue.value.trim().length > 0 && props.pDisabled === false) {
    emit('search', searchValue.value)
  }
}

watch(aiEnabled, (newValue) => {
  if (newValue === true) {
    nextTick(() => {
      focus()
    })
  }
})

const clearSearch = () => {
  searchValue.value = ''
  formSearchRef.value?.clearSearch()
}

const focus = () => {
  if (aiEnabled.value === true) {
    textareaRef.value?.focus()
  } else {
    formSearchRef.value?.focus()
  }
}

defineExpose({
  clearSearch,
  focus,
})
</script>

<style lang="scss" scoped>
.p-smart-search {
  &--disabled {
    opacity: 0.6;
    pointer-events: none;
  }

  &__form-search {
    :deep(.el-input-group__append) {
      background-color: var(--el-fill-color-blank);
    }
  }

  &__switch-label {
    max-width: 80px;
    line-height: 1.2;
    word-wrap: break-word;
    white-space: normal;
  }

  &__header {
    animation: fade-up 0.3s ease-out;
  }

  &__disclaimer {
    animation: fade-up 0.3s ease-out 0.1s both;
  }

  &__ai-stars {
    animation: wobble-in 0.5s ease-out;
  }

  &__ai-content {
    border: 1px solid var(--el-border-color);
    border-bottom: 2px solid var(--p-jungle-200);
    border-radius: var(--el-border-radius-base);
    transition: border-color 0.3s ease, box-shadow 0.3s ease;

    &:focus-within {
      border-color: var(--p-jungle-300);
      box-shadow: 0 0 0 3px rgba(26, 171, 142, 0.15);
    }
  }

  &__ai-row {
    height: 110px;
  }

  &__ai-textarea {
    border: none;
    outline: none;
    resize: none;
    overflow-y: auto;

    &::placeholder {
      color: var(--el-text-color-placeholder);
    }

    &:disabled {
      cursor: not-allowed;
    }
  }

  &__ai-submit {
    min-width: 40px;
    height: 40px;

    :deep(.el-button) {
      min-width: 40px;
      height: 40px;
      padding: 0;
      background-color: var(--p-black-rock-900);
      border-color: var(--p-black-rock-900);
      transition: transform 0.2s ease, opacity 0.2s ease;

      &:hover:not(.is-disabled),
      &:focus:not(.is-disabled) {
        background-color: var(--p-black-rock-900);
        border-color: var(--p-black-rock-900);
        transform: scale(1.05);
      }

      &:not(.is-disabled) {
        animation: scale-pop 0.3s ease-out;
      }

      .el-icon {
        margin: 0;
        transition: transform 0.2s ease;
      }

      &:hover:not(.is-disabled) .el-icon {
        transform: translateX(3px);
      }
    }
  }

  &__ai-submit-icon {
    transition: transform 0.2s ease;
  }
}

@media (max-width: 768px) {
  .p-smart-search {
    >[data-testid="p-smart-search-classic"] {
      flex-direction: column;
      align-items: stretch;

      >.flex:last-child {
        justify-content: flex-end;
      }
    }
  }
}
</style>
