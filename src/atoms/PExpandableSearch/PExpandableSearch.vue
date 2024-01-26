<template>
  <div
    class="p-expandable-search flex flex--align-items-center flex--justify-content-start"
  >
    <PButton
      v-if="!isSearchOpen"
      pType="white"
      pPlain
      pSize="small"
      @click="openSearchBar"
    >
      <PIcon>
        <PISearch />
      </PIcon>
    </PButton>

    <PInput
      v-model="searchContent"
      pType="search"
      :pPlaceholder="pPlaceholder"
      :pPrefixIcon="PISearch"
      pClearable
      pSize="small"
      :class="['p-expandable-search__input', isSearchOpen ? 'isExpanded' : '']"
      @clear="handleClear"
      @input="handleInput"
      @blur="handleBlur"
    >
    </PInput>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { PISearch } from '@/atoms/PIcon/components'
import type { PExpandableSearchProps } from './PExpandableSearchTypes'
import PButton from '@/atoms/PButton'
import PInput from '@/atoms/PInput'

const props = defineProps<PExpandableSearchProps>()

const emit = defineEmits<{
  input: [string]
  'search-expand-change': [boolean]
}>()

const searchContent = ref('')
const isSearchOpen = ref(false)

const openSearchBar = () => {
  isSearchOpen.value = true
  emit('search-expand-change', true)
}

const handleClear = () => {
  isSearchOpen.value = false
  emit('search-expand-change', false)
}

const handleInput = () => {
  emit('input', searchContent.value)
}

const handleBlur = () => {
  if (props.pIsSearchShrinkable) {
    isSearchOpen.value = false
    searchContent.value = ''
    emit('search-expand-change', false)
  }
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
