<template>
  <ElMenu
    :mode="pMode"
    class="p-header-tabs hidden-xs-only"
    :ellipsis="pEllipsis"
    router
  >
    <ElMenuItem
      v-for="item in pHeaderTabsMenu.slice(0, 4)"
      class="menu-item"
      :index="item.pPath"
      :route="{ path: item.pPath }"
      :key="item.pPath"
    >
      <PIcon>
        <component :is="createIcon(item.pIcon)" />
      </PIcon>
      <template #title>
        {{ item.pText }}
      </template>
    </ElMenuItem>
    <ElSubMenu
      index="2"
      v-if="pHeaderTabsMenu.length > 4"
    >
      <template #title>
        <PIcon>
          <component :is="createIcon('PIThreeDots')" />
        </PIcon>
        <span>{{ t('more') }}</span>
      </template>
      <ElMenuItem
        v-for="item in pHeaderTabsMenu.slice(4)"
        class="menu-item"
        :index="item.pPath"
        :route="{ path: item.pPath }"
        :key="item.pPath"
      >
        <PIcon>
          <component :is="createIcon(item.pIcon)" />
        </PIcon>
        <template #title>
          {{ item.pText }}
        </template>
      </ElMenuItem>
    </ElSubMenu>
  </ElMenu>
</template>

<i18n lang="yaml">
  en-US:
    more: 'More'
  fr-FR:
    more: 'Plus'
</i18n>

<script setup lang="ts">
import PIcon from '@/atoms/PIcon'
import { defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMenuItem, ElMenu, ElSubMenu } from 'element-plus'
import type { PHeaderTabsProps } from './PHeaderTabsTypes'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

withDefaults(defineProps<PHeaderTabsProps>(), {
  pHeaderTabsMenu: () => [],
  pMode: 'horizontal',
  pEllipsis: false
})

const createIcon = (name: string) => {
  return defineAsyncComponent(() => import(`../PIcon/components/${name}.vue`))
}
</script>
