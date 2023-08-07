<template>
  <div>
    <div class="card">
      <p v-if="user && user.firstName">
        {{ t('welcomeMsg', { firstName: user.firstName, lastName: user.lastName }) }}
      </p>
      <el-button type="primary" @click="count++">
        {{ t('count', { count }) }}
      </el-button>
      <p>{{ t('edit', { component: 'components/helloWorld'}) }}</p>
    </div>

    <p>
      {{ t('checkOut') }}
      <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank">
        {{ t('createVue') }}
      </a>{{ t('vueViteStarter') }}
    </p>
    <p>
      {{ t('install') }}
      <a href="https://github.com/vuejs/language-tools" target="_blank">{{ t('volar') }}</a>
      {{ t('ide')}}
    </p>
    <p class="read-the-docs">
      {{ t('learnMore') }}
    </p>
  </div>
</template>

<i18n lang="yaml">
  en-US:
    count: 'count is {count}'
    edit: 'Edit {component} to test HMR'
    checkOut: 'Check out'
    createVue: 'create-vue'
    vueViteStarter: ', the official Vue + Vite starter'
    install: 'Install'
    volar: 'volar'
    ide: 'in your IDE for a better DX'
    learnMore: 'Click on the Vite and Vue links to learn more'
    welcomeMsg: 'Hello {firstName} {lastName} !'
  fr-FR:
    count: 'countage est {count}'
    edit: 'Editez {component} pour tester HMR'
    checkOut: 'Visitez'
    createVue: 'create-vue'
    vueViteStarter: ', le template officiel Vue + Vite'
    install: 'Installez'
    volar: 'volar'
    ide: 'dans votre IDE pour une meilleure DX'
    learnMore: 'Cliquez sur les liens Vite et Vue pour en savoir plus'
    welcomeMsg: 'Bonjour {firstName} {lastName} !'
</i18n>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { commonStore } from '@kpmg/common'
import { storeToRefs } from 'pinia'
const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const { user } = storeToRefs(commonStore())
const count = ref(0)
</script>

<style lang="scss" scoped>
.read-the-docs {
  color: #888;
}
</style>
