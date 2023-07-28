<template>
  <div class="p-action-bar">
    <div class="p-action-bar__left">
      <PButton
        v-for="(item, index) in truncatedLeftSideButtons"
        :key="index"
        :type="item.buttonType"
        :plain="item.plain"
        :circle="item.buttonName === '' ? true : false"
        :loading="item.loading"
        :disabled="item.disabled"
        :size="item.size"
        :class="['p-action-bar__left-btn', item.buttonName === '' ? 'no-gap' : '']"
        @click="$emit(item.buttonActionName)">

        <PIcon>
          <component :is="resolvedIconsLeft[index]"></component>
        </PIcon>
        <p>
          {{ item.buttonName }}
        </p>
      </PButton>
    </div>
    <div class="p-action-bar__right">
      <PButton
        v-for="(item, index) in truncatedRightSideButtons"
        :key="index"
        :type="item.buttonType"
        :plain="item.plain"
        :circle="isWindowUnder1200"
        :loading="item.loading"
        :disabled="item.disabled"
        :size="item.size"
        :class="['p-action-bar__right-btn', isWindowUnder1200 ? 'no-gap' : '']"
        @click="$emit(item.buttonActionName)">
        <PIcon>
          <component :is="resolvedIconsRight[index]"></component>
        </PIcon>
        <p class="hidden-md-and-down">
          {{ item.buttonName }}
        </p>
      </PButton>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import PButton from '@/atoms/PButton'
import PIcon from '@/atoms/PIcon'
import { iconsResolver } from '@/utils/iconResolver'

interface Buttons {
  buttonName: string,
  buttonType: string,
  buttonIcon: string,
  buttonActionName: string,
  size: string,
  plain: Boolean,
  round: Boolean,
  circle: Boolean,
  loading: Boolean,
  disabled: Boolean
}

interface PActionBarProps {
  rightSideButtons: Buttons[];
  leftSideButtons: Buttons[];
}

const props = defineProps<PActionBarProps>()

const truncatedRightSideButtons = props.rightSideButtons.length > 5
  ? props.rightSideButtons.slice(0, 5)
  : props.rightSideButtons
const truncatedLeftSideButtons = props.leftSideButtons.length > 3
  ? props.leftSideButtons.slice(0, 3)
  : props.leftSideButtons

const resolvedIconsRight = iconsResolver(props.rightSideButtons, 'buttonIcon')
const resolvedIconsLeft = iconsResolver(props.leftSideButtons, 'buttonIcon')

const isWindowUnder1200 = ref(window.innerWidth < 1200)

const handleResize = () => {
  isWindowUnder1200.value = window.innerWidth < 1200
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})

</script>

<style lang="scss">
.p-action-bar {
  display: grid;
  grid-template-columns: auto auto;
  width: fit-content;
  gap: 135px;

  &__left,
  &__right {
    &-btn {
      padding: 9px 8px;
    }

    &-btn.no-gap{
      width: 32px;
      height: 32px;
      padding: 9px 8px;
    }

    .el-button > span {
      gap: 10px;
    }

    .no-gap > span {
      gap: 0;
    }
  }
}
</style>
