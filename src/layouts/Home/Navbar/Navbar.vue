<template>
  <PNavbar
    class="aside"
    :entities="entities"
    :menuList="menu"
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
    title: 'Portefeuille'
</i18n>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { menu } from '../../../routes'
import { PNavbar } from '@kpmg/styleguide'

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
</script>
