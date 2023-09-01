<template>
  <div class="common-layout">
      <PContainer class="aside-main-container">
        <PAside class="aside-container">
          <Navbar class="navbar-aside-container" />
        </PAside>
        <PContainer>
          <PCHeader class="add-border">
            <Header />
          </PCHeader>
          <PMain class="main-container">
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
.aside-main-container {
  height: 100vh;
  display: flex;
}

.navbar-aside-container:not(.el-menu--collapse) {
  width: 240px;
  @media only screen and (max-width: 991px)  {
    width: 100%;
  }
}

@media only screen and (max-width: 991px)  {
  .aside-main-container {
    display: contents;
  }
}

.main-container {
  padding: 15px;
  width: 100%;
}
</style>
