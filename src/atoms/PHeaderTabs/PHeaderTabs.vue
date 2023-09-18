<template>
  <ElMenu
    mode="horizontal"
    class="p-header-tabs hidden-xs-only"
    :ellipsis=false
    router
  >
    <ElMenuItem
      v-for="item in menu.slice(0, 4)"
      class="menu-item"
      :index="item.path"
      :route="{ path: item.path }"
      :key="item.path"
    >
      <PIcon>
        <component :is="createIcon(item.icon)" />
      </PIcon>
      <template #title>
        {{ item.text }}
      </template>
    </ElMenuItem>
    <ElSubMenu
      index="2"
      v-if="menu.length > 4"
    >
      <template #title>
        <PIcon>
          <component :is="createIcon('PIThreeDots')" />
        </PIcon>
        <span>{{ t('more') }}</span>
      </template>
      <ElMenuItem
        v-for="item in menu.slice(4)"
        class="menu-item"
        :index="item.path"
        :route="{ path: item.path }"
        :key="item.path"
      >
        <PIcon>
          <component :is="createIcon(item.icon)" />
        </PIcon>
        <template #title>
          {{ item.text }}
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

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

export interface IMenu {
  icon: string
  text: string
  path: string
}

export interface PHeaderProps {
  menu: IMenu[]
}

withDefaults(defineProps<PHeaderProps>(), {
  menu: () => []
})

const createIcon = (name: string) => {
  return defineAsyncComponent(() => import(`../PIcon/components/${name}.vue`))
}
</script>
