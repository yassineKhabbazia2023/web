<template>
  <div class="p-action-bar">
    <div class="p-action-bar__left">
      <template v-for="(item, index) in truncatedLeftSideButtons" :key="index">
        <PUpload
          v-if="item.pComponentType === 'UPLOAD'"
          :pMultiple="item.pMultiple"
          :pDisable="item.pButton.pDisabled"
          :pShowFileList="false"
          :pDrag="false"
          pUploadType="slot"
          pShouldClearPreviousFilesListOnUpload
          @files-selected="handleFilesSelected"
        >
          <PTooltip
            :disabled="item.pButton.pDisabled === false"
            :pContent="item.pTooltipContent"
          >
            <PButton
              :pType="item.pButton.pType"
              :pCircle="item.pButtonName === '' ? true : false"
              :pLoading="item.pButton.pLoading"
              :pDisabled="item.pButton.pDisabled"
              :pSize="item.pButton.pSize"
              :class="[
                'p-action-bar__left-btn',
                'margin-right--2',
                item.pButtonName === '' ? 'el-button--icon' : ''
              ]"
            >
              <PIcon
                :pName="item.pButtonIconName"
                class="el-button__icon--left"
              />
              <p>{{ item.pButtonName }}</p>
            </PButton>
          </PTooltip>
        </PUpload>

        <PButton
          v-else-if="!item.pComponentType"
          :pType="item.pButton.pType"
          :pCircle="item.pButtonName === '' ? true : false"
          :pLoading="item.pButton.pLoading"
          :pDisabled="item.pButton.pDisabled"
          :pSize="item.pButton.pSize"
          :class="[
            'p-action-bar__left-btn',
            'margin-right--2',
            item.pButtonName === '' ? 'el-button--icon' : ''
          ]"
          @click="emit('p-action-bar-button-clicked', item.pButtonActionName)"
        >
          <PIcon
            :pName="item.pButtonIconName"
            class="el-button__icon--left"
          />
          <p>
            {{ item.pButtonName }}
          </p>
        </PButton>
        <PExpandableSearch
          v-else-if="item.pComponentType === 'SEARCH'"
          v-model:pSearchContent="pSearchContent"
          :pType="'default'"
          :pIsSearchShrinkable="item.pIsSearchShrinkable"
          :pIsSearchOpen="item.pIsSearchOpen ?? false"
          :pMaxLength="pSearchMaxLength"
          @update:p-search-content="handleSearchTextTyped"
          @search-expand-change="handleExpandEvent"
        />
      </template>
    </div>
    <div class="p-action-bar__right">
      <PButton
        v-for="(item, index) in truncatedRightSideButtons"
        :key="index"
        :pType="item.pButton.pType"
        :pCircle="isIconsTypeCircle"
        :pLoading="item.pButton.pLoading"
        :pDisabled="item.pButton.pDisabled"
        :pSize="item.pButton.pSize"
        :class="[
          'p-action-bar__right-btn',
          isSearchExpanded ? 'p-action-bar__right-btn--round' : ''
        ]"
        @click="emit('p-action-bar-button-clicked', item.pButtonActionName)"
      >
        <PIcon
          :pName="item.pButtonIconName"
          class="el-button__icon--left"
        />
        <span v-if="!isSearchExpanded" class="hidden-sm-and-down">
          {{ item.pButtonName }}
        </span>
      </PButton>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import PButton from '../../atoms/PButton'
import PIcon from '../../atoms/PIcon'
import PExpandableSearch from '../../atoms/PExpandableSearch'
import PUpload from '../../atoms/PUpload'
import PTooltip from '../../atoms/PTooltip'
import type { PActionBarProps } from './PActionBarTypes'
const props = withDefaults(defineProps<PActionBarProps>(), {
  pSearchMaxLength: 255,
})

const emit = defineEmits<{
  'p-upload-files-selected': [File[]]
  'p-action-bar-button-clicked': [string]
  'p-search-input': [string]
  'search-expand-change': [boolean]
}>()

const isSearchExpanded = ref(false)

const truncatedRightSideButtons = computed(() => {
  return props.pRightSideButtons.length > 5 || isSearchExpanded
    ? props.pRightSideButtons.slice(0, 5)
    : props.pRightSideButtons
})

const truncatedLeftSideButtons = computed(() => {
  return props.pLeftSideButtons.length > 3
    ? props.pLeftSideButtons.slice(0, 3)
    : props.pLeftSideButtons
})

const isWindowUnderDesktop = ref(window.innerWidth < 992)

const isIconsTypeCircle = computed(
  () => isWindowUnderDesktop.value || isSearchExpanded.value,
)

const handleResize = () => {
  isWindowUnderDesktop.value = window.innerWidth < 992
}

const handleExpandEvent = (value: boolean) => {
  isSearchExpanded.value = value
  emit('search-expand-change', value)
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})

const handleFilesSelected = (data: File[]) => {
  emit('p-upload-files-selected', data)
}

const pSearchContent = ref('')
const handleSearchTextTyped = (data: string) => {
  emit('p-search-input', data)
}
</script>

<style lang="scss">
.p-action-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  &__right-btn {
    &--round {
      &.el-button.el-button--small .el-button__icon--left {
        margin: 0;
      }
    }
    @media screen and (max-width: 992px) {
      &.el-button.el-button--small .el-button__icon--left {
        margin: 0;
      }
    }
  }
  &__left {
    display: flex;
    width: 100%;
  }
  &__right {
    display: flex;
  }
}
</style>
