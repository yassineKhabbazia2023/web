<template>
  <Story
    title="3. Molecules/Menu"
    icon="mingcute:menu-line"
    :layout="{ type: 'grid', width: '220px' }"
  >
    <Variant title="Simple Menu">
      <div
        class="simple-menu-variant padding-y--3 padding-left--3"
        :class="{ 'simple-menu-variant--collapsed': menuConfig.collapse }"
        style="background-color: var(--el-color-persian-100)"
      >
        <PMenu
          pDefaultActive="1-2"
          :pMode="menuConfig.mode"
          :pCollapse="menuConfig.collapse"
          :pEllipsis="menuConfig.ellipssis"
          :pBackgroundColor="menuConfig.backgroundColor"
          :pTextColor="menuConfig.textColor"
          :pActiveTextColor="menuConfig.activeTextColor"
          :pRouter="menuConfig.router"
          :pUniqueOpened="menuConfig.uniqueOpened"
          :pMenuTrigger="menuConfig.menuTrigger"
          :pCollapseTransition="menuConfig.collapseTransition"
          @open="logEvent('open', $event)"
          @close="logEvent('close', $event)"
          @select="logEvent('select', $event)"
        >
          <PSubMenu
            v-for="submenu in submenus"
            :key="submenu.index"
            :pIndex="submenu.index"
            pIcon="PIHouse"
            :pDisabled="menuConfig.disabledSubmenus"
          >
            <template #title>
              {{ submenu.title }}
            </template>
            <PMenuItem
              v-for="item in submenu.items"
              :key="item.index"
              :pIndex="item.index"
              :pRightIcon="PICheckCircle"
              :pDisabled="menuConfig.disabledMenuItems"
            >
              <template #title>
                {{ item.title }}
              </template>
            </PMenuItem>
          </PSubMenu>
          <PMenuItem
            v-for="item in menuItems"
            :key="item.index"
            :pIndex="item.index"
            pLeftIcon="PIHouse"
            :pDisabled="menuConfig.disabledMenuItems"
          >
            <template #title>
              {{ item.title }}
            </template>
          </PMenuItem>
        </PMenu>
      </div>
      <template #controls>
        <HstSelect
          v-model="menuConfig.mode"
          title="Mode"
          :options="['vertical']"
        />
        <HstSelect
          v-if="menuConfig.mode === 'horizontal'"
          v-model="menuConfig.menuTrigger"
          title="Menu Trigger"
          :options="['hover', 'click']"
        />
        <HstCheckbox
          v-if="menuConfig.mode === 'horizontal'"
          v-model="menuConfig.ellipssis"
          title="Ellipssis"
        />
        <HstCheckbox v-model="menuConfig.collapse" title="Collapse" />
        <HstCheckbox v-model="menuConfig.uniqueOpened" title="Unique Opened" />
        <HstCheckbox
          v-model="menuConfig.disabledMenuItems"
          title="Disabled Menu Items"
        />
        <HstCheckbox
          v-model="menuConfig.disabledSubmenus"
          title="Disabled Submenus"
        />
        <HstCheckbox
          v-model="menuConfig.router"
          title="Routing using indexes"
        />
        <HstCheckbox
          v-model="menuConfig.collapseTransition"
          title="Collapse Transition"
        />
      </template>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { logEvent } from 'histoire/client'
import { PICheckCircle } from '@/atoms/PIcon/components'
import PMenu from './'
import PMenuItem from '../PMenuItem'
import PSubMenu from '../PSubMenu'

const menuConfig: any = reactive({
  mode: 'vertical',
  ellipssis: true,
  menuTrigger: 'click',
  uniqueOpened: false,
  collapseTransition: false,
  disabledMenuItems: false,
  disabledSubmenus: false,
  router: true,
})

const menuItems = [
  {
    index: '1',
    title: 'Menu Item 1',
  },
  {
    index: '2',
    title: 'Menu Item 2',
  },
  {
    index: '3',
    title: 'Menu Item 3',
  },
  {
    index: '4',
    title: 'Menu Item 4',
  },
]

const submenus = [
  {
    index: '1',
    title: 'Submenu 1',
    items: menuItems.map((item) => {
      return { ...item, index: `1-${item.index}` }
    }),
  },
  {
    index: '2',
    title: 'Submenu 2',
    items: menuItems.map((item) => {
      return { ...item, index: `2-${item.index}` }
    }),
  },
]
</script>

<style lang="scss" scoped>
.simple-menu-variant {
  &--collapsed {
    width: 54px;
  }
}
</style>

<docs lang="md">
  <div class="responsive-iframe-container">
    <iframe class="responsive-iframe" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D682%253A4757%26mode%3Ddesign%26t%3Dyik5rp5OWfY0iLjT-1" allowfullscreen></iframe>
  </div>
</docs>
