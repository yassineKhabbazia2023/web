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
    goToEntities: 'Go to entities'
    goToGed: 'Go to ged'
    goToMandate: 'Go to mandate'
  fr-FR:
    title: 'Navbar'
    goToHome: "Aller à l'accueil"
    goToLogin: 'Aller à la page de login'
    goToEntities: 'Aller à la page de entities'
    goToGed: 'Aller à la page de ged'
    goToMandate: 'Aller à la page de mandate'
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
  },
  {
    title: t('goToEntities'),
    name: 'entities'
  },
  {
    title: t('goToGed'),
    name: 'ged'
  },
  {
    title: t('goToMandate'),
    name: 'mandats'
  }
]
</script>
