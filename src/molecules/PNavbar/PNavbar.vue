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
      v-for="item in menuList"
      :index="item.path"
      :key="item.path"
    >
      <PIcon class="p-navbar__icon">
        <component :is="iconResolver(item.icon)" />
      </PIcon>
      <span class="p-menu-name p-menu-name--list hidden-sm-and-down">{{ item.name }}</span>
    </ElMenuItem>
    <div class="divider hidden-sm-and-down">
      <ElDivider />
    </div>
    <ElMenuItem
      v-for="(item, index) in entities"
      :key="item.idAccount"
      @click="handleClickEntity(item.idAccount)"
      :index="`${index + 2}`"
      class="p-menu-item-entity"
    >
      <span class="p-navbar__avatar-container">
        <PAvatar
          :shape="currentShape"
          :type="currentType"
          :color="item.color"
        >
          <PIcon>
            <component :is="iconResolver(item.icon)" />
          </PIcon>
        </PAvatar>
      </span>
      <span class="p-menu-name">{{ item.name }}</span>
    </ElMenuItem>
  </ElMenu>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { ElDivider, ElMenu, ElMenuItem } from 'element-plus'
import PAvatar from '@/atoms/PAvatar'
import PIcon from '@/atoms/PIcon'
import { iconResolver } from '@/utils/iconResolver'

export interface EntityProps {
  idAccount: string
  name: string
  icon: string
  color: string
}

export interface MenuProps {
  name: string
  path: string
  icon: string
}

export interface NavbarProps {
  entities: EntityProps[]
  menuList: MenuProps[]
  handleClickEntity: Function
}

const isCollapse = ref(true)

const currentShape = ref('circle')
const currentType = ref('xsmall')
const activeIndex = ref('2')

withDefaults(defineProps<NavbarProps>(), {
  entities: () => [],
  menuList: () => [],
  handleClickEntity: () => {}
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
