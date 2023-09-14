<template>
  <div class="common-layout">
    <PContainer>
      <PCHeader class="header-container" height="52">
        <Header
          :menu="menuHeader"
        />
      </PCHeader>
      <PContainer class="aside-main-container">
        <PAside class="aside-container">
          <Navbar class="navbar-aside-container" />
        </PAside>
        <PContainer class="main-container">
          <router-view />
        </PContainer>
        <PContainer class="home-bottom-menu">
          <PBottomMenu
            :defaultActive="routeActive"
            :items="menuBottomMenu"
          />
        </PContainer>
      </PContainer>
    </PContainer>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import Header from './Header'
import Navbar from './Navbar'
import { PCHeader, PAside, PContainer, PBottomMenu } from '@kpmg/styleguide'

const menuBottomMenu = [
  {
    icon: 'PIColumnsGap',
    name: 'Dashboard',
    path: '',
    component: {
      render: () => 'Dashboard'
    }
  }
]

const menuHeader = menuBottomMenu.map(({ name, path, icon }) => ({
  text: name,
  icon,
  path
}))

const route = useRoute()
const routeActive = route.path
</script>
<style scoped>
.aside-main-container {
  display: flex;
}

.home-bottom-menu {
  display: none;
}

.aside-container {
  width: inherit;
}

.header-container {
  padding: 0;
}

.aside-container .navbar-aside-container {
  height: 100vh;
}

.navbar-aside-container:not(.el-menu--collapse) {
  @media only screen and (max-width: 991px)  {
    width: 100%;
  }
}

@media only screen and (max-width: 991px)  {
  .aside-main-container {
    display: block;
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
