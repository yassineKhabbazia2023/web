<template>
  <div class="p-expandable-search">
    <PButton
      v-if="!isSearchOpen"
      pType="white"
      pPlain
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
      :class="['p-expandable-search__input', isSearchOpen ? 'isExpanded' : '']"
      @clear="isSearchOpen = false"
      @input="handleInput"
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

defineProps<PExpandableSearchProps>()

const emit = defineEmits<{
  input: [string]
}>()

const searchContent = ref('')
const isSearchOpen = ref(false)

const openSearchBar = () => {
  isSearchOpen.value = true
}
const handleInput = () => {
  emit('input', searchContent.value)
}
</script>

<style lang="scss">
.p-expandable-search {
  display: flex;
  justify-content: center;
  align-items: center;

  &__input {
    width: 0;
    transition: width 0.5s ease-in-out;
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
