<template>
  <div>
    <PNavbar
      class="aside"
      :pEntities="entities"
      :pMenuList="menu"
      :pActiveIndex="activeEntityIndex"
    >
      <template #title>
        {{ t('title') }}
      </template>
    </PNavbar>
  </div>
</template>

<i18n lang="yaml">
  en-US:
    title: 'Entities'
    menuTitle: 'My entities'
  fr-FR:
    title: 'Portefeuille'
    menuTitle: 'Mon portefeuille'
</i18n>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PNavbar } from '@kpmg/styleguide'
import { commonStore } from '@kpmg/common'
import { computed } from 'vue'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const menu = [
  {
    pName: t('menuTitle'),
    pIcon: 'PIGrid',
    pPath: '/entities'
  }
]

const userStore = commonStore()

const entities = computed(() =>
  (userStore.user?.entities?.favorites ?? [])
    .map((f) => ({
      pIdAccount: f.idAccount,
      pName: f.name,
      pIcon: f.icon,
      pColor: f.color
    }))
)

const activeEntityIndex = computed(() => {
  const userEntities = userStore.user?.entities
  if (userEntities?.favorites && userEntities?.default) {
    const currentEntityIndex = userEntities.favorites.findIndex(({ idAccount }) =>
      idAccount === userEntities.default?.idAccount)
    if (currentEntityIndex > -1) {
      return currentEntityIndex.toString()
    }
  }
  return ''
})
</script>
