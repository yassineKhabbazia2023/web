<template>
  <div>
    <PNavbar
      class="aside"
      :entities="defaultEntity"
      :menuList="menu"
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
  fr-FR:
    title: 'Portefeuille'
</i18n>

<script setup lang="ts">
import useNavbarStore from '@/stores/navbar-store'
import { useI18n } from 'vue-i18n'
import { menu } from '../../../routes'
import { PNavbar } from '@kpmg/styleguide'
import { storeToRefs } from 'pinia'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const navbarStore = useNavbarStore()
const { defaultEntity } = storeToRefs(navbarStore)
</script>
