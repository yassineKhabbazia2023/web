<template>
  <div>
    <div>
      <a
        href="https://vitejs.dev"
        target="_blank"
        rel="noopener"
      >
        {{ t('vite') }}
      </a>
      <span>{{ t('+') }}</span>
      <a
        href="https://vuejs.org/"
        target="_blank"
        rel="noopener"
      >
        {{ t('vue') }}
      </a>
    </div>
    <HelloWorld />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import HelloWorld from './components/helloWorld'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})
</script>

<style lang="scss" scoped>
span {
  margin: 0 0.5rem;
}
</style>

<i18n lang="yaml">
  en-US:
    vite: 'Vite'
    vue: 'Vue'
    +: '+'
  fr-FR:
    vite: 'Vite'
    vue: 'Vue'
    +: '+'
</i18n>
