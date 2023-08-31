<template>
  <div class="common-layout">
    <el-container>
      <el-header height="52">
        <Header />
      </el-header>
      <el-container class="aside-main-container">
        <el-aside class="aside-container">
          <Navbar class="navbar-aside-container" />
        </el-aside>
        <el-container class="main-container">
          <h3>{{ t('title') }}</h3>
          <router-view />
        </el-container>
      </el-container>
    </el-container>
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
