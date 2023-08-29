<template>
  <div class="common-layout">
      <PContainer>
        <PAside width="200px" class="add-border">
          <Navbar />
        </PAside>
        <PContainer>
          <PCHeader class="add-border">
            <Header />
          </PCHeader>
          <PMain class="add-border">
          <h3>{{ t('title') }}</h3>
          <router-view />
          </PMain>
        </PContainer>
      </PContainer>
  </div>
</template>

<i18n lang="yaml">
  en-US:
    title: 'This is the Home layout'
  fr-FR:
    title: 'Ceci est le layout Home'
</i18n>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Header from './Header'
import Navbar from './Navbar'
import { PMain, PCHeader, PAside, PContainer } from '@kpmg/styleguide'

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
