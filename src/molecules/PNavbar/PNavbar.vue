<template>
  <ElMenu
    textColor="white"
    class="el-menu--navbar shadow--3 p-navbar"
    :collapse="isWindowUnderDesktop ? false : isCollapse"
    :mode="isWindowUnderDesktop ? 'horizontal' : 'vertical'"
    :defaultActive="activeIndex"
    :ellipsis="!isWindowUnderDesktop"
    router
  >
    <ElMenuItem class="el-menu-item--title hidden-sm-and-down">
      <span class="p-menu-name-title"><slot name="title" /></span>
      <PIcon
        @click="collapseMenu"
        class="p-icon-collapse"
      >
        <PIArrowBarRight v-show="isCollapse" />
        <PIArrowBarLeft v-show="!isCollapse" />
      </PIcon>
    </ElMenuItem>
    <ElMenuItem
      v-for="item in pMenuList"
      :index="item.pPath"
      :key="item.pPath"
    >
      <PIcon class="p-navbar__icon">
        <component :is="iconResolver(item.pIcon)" />
      </PIcon>
      <span class="p-menu-name p-menu-name--list hidden-sm-and-down">{{ item.pName }}</span>
    </ElMenuItem>
    <div class="divider hidden-sm-and-down">
      <ElDivider />
    </div>
    <ElMenuItem
      v-for="(item, index) in pEntities"
      :key="item.pIdAccount"
      @click="pHandleClickEntity(item.pIdAccount)"
      :index="`${index + 2}`"
      class="p-menu-item-entity"
    >
      <span class="p-navbar__avatar-container">
        <PAvatar
          :pShape="currentShape"
          :pType="currentType"
          :pColor="item.pColor"
        >
          <PIcon>
            <component :is="iconResolver(item.pIcon)" />
          </PIcon>
        </PAvatar>
      </span>
      <span class="p-menu-name">{{ item.pName }}</span>
    </ElMenuItem>
  </ElMenu>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { ElDivider, ElMenu, ElMenuItem } from 'element-plus'
import PAvatar from '@/atoms/PAvatar'
import type { PAvatarProps } from '@/atoms/PAvatar/PAvatarTypes'
import PIcon from '@/atoms/PIcon'
import { iconResolver } from '@/utils/iconResolver'
import type { PNavbarProps } from './PNavbarTypes'

const isCollapse = ref(true)
const currentShape = ref<PAvatarProps['pShape']>('circle')
const currentType = ref<PAvatarProps['pType']>('default')
const activeIndex = ref('2')

withDefaults(defineProps<PNavbarProps>(), {
  pEntities: () => [],
  pMenuList: () => [],
  pHandleClickEntity: () => {}
})

const collapseMenu = () => {
  isCollapse.value = !isCollapse.value
}

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
