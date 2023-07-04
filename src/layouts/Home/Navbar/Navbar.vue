<template>
  <nav>
    <div>
      <h2>{{ t('title') }}</h2>
    </div>
    <div v-for="item in MENU" :key="item.name">
      <router-link :to="{ name: item.name }">
        {{ item.title }}
      </router-link>
    </div>
  </nav>
</template>

<i18n lang="yaml">
  en-US:
    title: 'Navbar'
    goToHome: 'Go to home'
    goToLogin: 'Go to login'
  fr-FR:
    title: 'Navbar'
    goToHome: "Aller à l'accueil"
    goToLogin: 'Aller à la page de login'
</i18n>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const MENU = [
  {
    title: t('goToHome'),
    name: 'home'
  },
  {
    title: t('goToLogin'),
    name: 'login'
  }
]
</script>
