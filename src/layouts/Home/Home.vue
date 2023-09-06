<template>
  <div class="common-layout">
    <el-container>
      <el-header height="52">
        <Header :menu="menu"/>
      </el-header>
      <el-container class="aside-main-container">
        <el-aside class="aside-container">
          <Navbar class="navbar-aside-container" />
        </el-aside>
        <el-container class="main-container">
          <h3>{{ t('title') }}</h3>
          <router-view />
        </el-container>
        <el-container class="home-bottom-menu">
          <PBottomMenu
            :defaultActive="routeActive"
            :items="menuBottomMenu"
          />
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
import { useRoute } from 'vue-router'
import Header from './Header'
import Navbar from './Navbar'

const route = useRoute()
const routeActive = route.path

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const menu = [
  { icon: 'PIColumnsGap', text: 'Dashboard', path: '' }
]

const menuBottomMenu = menu.map(({ text, path, icon }) => ({
  name: text,
  icon,
  path
}))
</script>
<style scoped>
.aside-main-container {
  display: flex;
}

.home-bottom-menu {
  display: none;
}

.navbar-aside-container:not(.el-menu--collapse) {
  width: 240px;
  @media only screen and (max-width: 991px)  {
    width: 100%;
  }
}

@media only screen and (max-width: 991px)  {
  .aside-main-container {
    display: block;
    height: 100vh;
  }

  .home-bottom-menu {
    display: block;
    bottom: 0;
    left: 0;
    right: 0;
    position: absolute;
  }
}

.main-container {
  display: block;
  padding: 15px;
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: scroll;
  @media only screen and (max-width: 991px)  {
    width: auto;
  }
}
</style>
<style>
html, body {
  overflow: hidden;
  margin: 0px;
  height: 100%;
}
</style>
