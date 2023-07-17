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
          :backgroundColor="basicNavData.backgroundColor"
          :routeActive="routeActive"
        />
        <router-view />
        <template #controls>
          <HstRadio
            v-model="basicNavData.backgroundColor"
            title="Theme"
            :options="basicNavData.themeOptions"
          />
          <HstJson
            v-model="basicNavData.entities"
            title="Entities"
          />
        </template>
      </Variant>
    </div>
  </Story>
</template>
<script lang="ts" setup>
import { reactive, computed } from 'vue'
import PNavbar from './PNavbar.vue'
import { isAttribute } from '../../utils'
import themeOptions from '../../constants/themeOptions'
import { useRoute } from 'vue-router'

const entities = [
  { name: 'Restaurant Johnny s pizza', idAccount: 'idAccount' },
  { name: 'Jean Levage', idAccount: 'idAccount 2' }
]
const basicNavData = reactive({
  backgroundColor: 'var(--el-color-neutral-gray-700)',
  themeOptions,
  entities
})

const navbarSource = computed(() => {
  return `<PNavbar${isAttribute(
  basicNavData.backgroundColor !== '',
    `backgroundColor="${basicNavData.backgroundColor}"`
  )} class="aside" :entities="entities" />`
})

const route = useRoute()
const routeActive = route.path
</script>
