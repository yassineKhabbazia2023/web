<template>
  <Story title="Basic/Navbar">
    <div class="container">
      <Variant
        title="Basic Usage"
        :source="navbarSource"
      >
        <PNavbar
          class="aside"
          :entities="basicNavData.entities"
          :handleClickEntity="handleClickEntity"
          :menuList="menus"
        >
          <template #title >
            Mes entités
          </template>
        </PNavbar>
        <router-view />
        <template #controls>
          <HstJson
            v-model="basicNavData.entities"
            title="Entities"
          />
          <HstJson
            v-model="basicNavData.menus"
            title="Menus"
          />
        </template>
      </Variant>
    </div>
  </Story>
</template>
<script lang="ts" setup>
import { reactive, computed } from 'vue'
import PNavbar from './'
import themeOptions from '../../constants/themeOptions'
import { useRouter } from 'vue-router'

const router = useRouter()

const handleClickPortefeuille = () => {
  router.push('/entity')
}

const entities = [
  { name: 'Restaurant Johnny s pizza', idAccount: 'idAccount', icon: 'PICupHot', color: 'orange' },
  { name: 'Jean Levage', idAccount: 'idAccount 2', icon: 'PIShop', color: 'green' }
]

const menus = [
  { name: 'Voir mes entités', icon: 'PIGrid', handleClick: handleClickPortefeuille },
  { name: 'Voir la vue client', icon: 'PIPersonVideo3', handleClick: handleClickPortefeuille }
]
const basicNavData = reactive({
  themeOptions,
  entities,
  menus
})

const navbarSource = computed(() => {
  return '<PNavbar class="aside" :entities="entities" :menuList="menus"/>'
})

const handleClickEntity = (idAccount: string) => {
  console.log('current entity', idAccount)
}
</script>
