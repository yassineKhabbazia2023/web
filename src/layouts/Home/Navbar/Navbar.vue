<template>
  <PNavbar
    class="aside"
    :entities="entitiesFormated"
    :handleClickEntity="handleClickEntity"
    :menuList="menus"
  >
    <template #title >
      {{ t('title') }}
    </template>
  </PNavbar>
</template>

<i18n lang="yaml">
  en-US:
    title: 'Entities'
  fr-FR:
    title: 'Mes entités'
</i18n>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

// TODO: replace with entity list from back
const entities = [
  {
    name: 'Restaurant Johnny s pizza - Courbevoie',
    idAccount: 'idAccount',
    icon: 'PICupHot',
    color: 'orange'
  },
  {
    name: 'Jean Levage',
    idAccount: 'idAccount 2',
    icon: 'PIShop',
    color: 'green'
  }
]

const menus = [
  { name: 'Voir mes entités', icon: 'PIGrid', path: '/entity' }
]

const handleClickEntity = (idAccount: string) => {
  console.log('idAccount', idAccount)
  // TODO switch entity here
}

const entitiesFormated = computed(() => {
  entities.forEach((entity) => {
    entity.name = entity.name.length > 29 ? entity.name.substring(0, 29).concat('...') : entity.name
  })
  return entities
})
</script>
