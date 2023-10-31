<template>
  <div class="common-layout">
    <PContainer>
      <PCHeader class="header-container" height="52">
        <Header :menu="menuHeader" />
      </PCHeader>
      <PContainer class="aside-main-container">
        <PAside class="aside-container">
          <Navbar class="navbar-aside-container" />
        </PAside>
        <PContainer
          class="main-container"
          :class="{ 'main-container--no-paddings': stylesMetaProperties?.hasPaddings === false }"
        >
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

<i18n lang="yaml">
  en-US:
    dashboard: 'Dashboard'
    subscriptions: 'Request validation'
    ged:  'My documents'
    mandate: 'Banking'
  fr-FR:
    dashboard: 'Tableau de bord'
    subscriptions: 'Validation de demande'
    ged:  'Mes documents'
    mandate: 'Flux bancaires'
</i18n>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import Header from './Header'
import Navbar from './Navbar'
import { PCHeader, PAside, PContainer, PBottomMenu } from '@kpmg/styleguide'
import { useI18n } from 'vue-i18n'
import { Component, computed } from 'vue'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const menuHeader = [
  {
    icon: 'PIColumnsGap',
    text: t('dashboard'),
    path: '',
    component: {
      render: () => 'Dashboard'
    }
  },
  {
    icon: 'PIFolder',
    text: t('ged'),
    path: '/ged'
  },
  {
    icon: 'PIFiles',
    text: t('subscriptions'),
    path: '/subscriptions'
  },
  {
    icon: 'PICashCoin',
    text: t('mandate'),
    path: '/mandats'
  }
]

const menuBottomMenu = menuHeader.map(({ icon, text, path, component }) => {
  return {
    icon,
    name: text,
    path,
    component: (component as unknown) as Component
  }
})

const router = useRouter()
const stylesMetaProperties = computed(() => router.currentRoute.value.meta.styles)
const route = useRoute()
const routeActive = route.path
</script>
<style lang="scss" scoped>

.common-layout {

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
    padding: 16px;
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: auto;

    @media only screen and (max-width: 991px)  {
      width: auto;
    }

    &--no-paddings {
      padding: 0;
    }
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
