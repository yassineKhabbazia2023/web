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
        :class="['p-action-bar__left-btn', item.buttonName === '' ? 'el-button--icon' : '']"
        @click="$emit(item.buttonActionName)">

        <PIcon class="el-button__icon--left">
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
        :circle="isWindowUnderDesktop"
        :loading="item.loading"
        :disabled="item.disabled"
        :size="item.size"
        class="p-action-bar__right-btn"
        @click="$emit(item.buttonActionName)">
        <PIcon class="el-button__icon--left">
          <component :is="resolvedIconsRight[index]"></component>
        </PIcon>
        <p class="hidden-sm-and-down">
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

const isWindowUnderDesktop = ref(window.innerWidth < 992)

const handleResize = () => {
  isWindowUnderDesktop.value = window.innerWidth < 992
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  &__right-btn {
    @media screen and (max-width: 992px) {
      &.el-button.el-button--small .el-button__icon--left {
        margin: 0;
      }
    }
  }
}
</style>
