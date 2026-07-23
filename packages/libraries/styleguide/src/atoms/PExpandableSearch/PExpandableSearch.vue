<template>
  <div
    class="p-expandable-search flex flex--align-items-center flex--justify-content-start"
    :data-testid="pTestId ?? 'expandable-search'"
  >
    <PButton
      v-if="!isSearchOpen"
      :pType="pType"
      pPlain
      pSize="small"
      @click="openSearchBar"
    >
      <PIcon pName="search" />
    </PButton>

    <PInput
      ref="inputRef"
      v-model="internalSearchContent"
      data-testid="p-expandable-search-input"
      :class="['p-expandable-search__input', isSearchOpen ? 'isExpanded' : '']"
      pClearable
      :pMaxlength="pMaxLength"
      :pPlaceholder="pPlaceholder"
      pPrefixIconName="search"
      pSize="small"
      pType="search"
      @blur="handleBlur"
      @clear="handleClear"
      @keyup.enter="emit('enter')"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import PIcon from '../PIcon'
import type { PExpandableSearchProps } from './PExpandableSearchTypes'
import PButton from '../../atoms/PButton'
import PInput from '../../atoms/PInput'

const props = withDefaults(defineProps<PExpandableSearchProps>(), {
  pType: 'white',
  pIsSearchOpen: false,
  pMaxLength: 255,
})

const inputRef = ref<InstanceType<typeof PInput>>()

const emit = defineEmits<{
  input: [string]
  'search-expand-change': [boolean]
  'update:p-search-content': [string]
  'enter': []
}>()

const internalSearchContent = computed({
  get: () => props.pSearchContent ?? '',
  set: (searchContent: string) => emit('update:p-search-content', searchContent),
})
const isSearchOpen = ref(props.pIsSearchOpen)

const openSearchBar = () => {
  isSearchOpen.value = true
  emit('search-expand-change', true)
  if (props.pFocusOnExpand) {
    setFocus()
  }
}

const handleClear = () => {
  isSearchOpen.value = false
  emit('search-expand-change', false)
}

const handleBlur = () => {
  if (props.pIsSearchShrinkable) {
    isSearchOpen.value = false
    internalSearchContent.value = ''
    emit('search-expand-change', false)
  }
}

watch(
  () => props.pIsSearchOpen,
  (value) => {
    if (!value) {
      internalSearchContent.value = ''
    }

    isSearchOpen.value = value
    emit('search-expand-change', value)
  },
)

function setFocus() {
  inputRef.value?.focus()
}
</script>

<style lang="scss">
.p-expandable-search {
  height: 32px;
  width: 100%;
  &__input {
    width: 0;
    align-self: stretch;
    transition: width 0.2s ease-in-out;
    .el-input__wrapper {
      display: none;
    }
  }
  &__input.isExpanded {
    width: 100%;
    .el-input__wrapper {
      display: inherit;
    }
  }
}
</style>
