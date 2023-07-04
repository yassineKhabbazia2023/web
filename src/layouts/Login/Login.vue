<template>
  <div class="common-layout">
    <el-container>
      <el-main class="add-border">
        <h3>{{ t('title') }}</h3>
        <router-link :to="{ name: 'home' }">
          {{ t('homeLink') }}
        </router-link>
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<i18n lang="yaml">
  en-US:
    title: 'This is the Login layout'
    homeLink: 'Back to home'
  fr-FR:
    title: 'Ceci est le layout Login'
    homeLink: "Retourner à l'accueil"
</i18n>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})
</script>

<style scoped>
.add-border {
  border: 1px dashed blueviolet;
}
</style>
