<template>
  <div class="common-layout">
    <PContainer pDirection="vertical">
      <PCHeader class="header-container" height="56">
        <Header />
      </PCHeader>
      <PContainer class="aside-main-container">
        <PAside class="aside-container">
          <Sidebar class="sidebar-container" />
        </PAside>
        <PContainer
          class="main-container"
          :class="{
            'main-container--no-paddings':
              stylesMetaProperties?.hasPaddings === false
          }"
        >
          <router-view />
        </PContainer>
        <PContainer class="home-bottom-menu">
          <PBottomMenu :defaultActive="routeActive" :pItems="menuBottomMenu" />
        </PContainer>
      </PContainer>
    </PContainer>
  </div>
</template>

<i18n lang="yaml">
en-US:
  wallet: 'Wallet'
  subscriptions: 'Request validation'
  ged: 'My documents'
  mandate: 'Banking'
fr-FR:
  wallet: 'Portefeuille'
  subscriptions: 'Validation de demande'
  ged: 'Mes documents'
  mandate: 'Flux bancaires'
</i18n>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import Header from './Header'
import Sidebar from './Sidebar'
import { PCHeader, PAside, PContainer, PBottomMenu } from '@kpmg/styleguide'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const headerMenu = [
  {
    pIcon: 'PIGrid',
    pText: t('wallet'),
    pPath: '/portefeuille'
  },
  {
    pIcon: 'PIFolder',
    pText: t('ged'),
    pPath: '/ged'
  },
  {
    pIcon: 'PIFiles',
    pText: t('subscriptions'),
    pPath: '/subscription'
  },
  {
    pIcon: 'PICashCoin',
    pText: t('mandate'),
    pPath: '/mandats'
  }
]

const menuBottomMenu = headerMenu.map(({ pIcon, pText: pName, pPath }) => {
  return {
    pIcon,
    pName,
    pPath,
    pComponent: { render: () => null }
  }
})

const router = useRouter()
const stylesMetaProperties = computed(
  () => router.currentRoute.value.meta.styles
)
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

  .aside-container .sidebar-container {
    @media only screen and (min-width: 992px) {
      overflow: hidden;
    }
  }

  .sidebar-container:not(.el-menu--collapse) {
    @media only screen and (max-width: 991px) {
      width: 100%;
    }
  }

  @media only screen and (max-width: 991px) {
    .aside-main-container {
      display: block;
    }

    .home-bottom-menu {
      display: block;
      bottom: 0;
      left: 0;
      right: 0;
      position: absolute;
      z-index: 10;
    }
  }

  .main-container {
    display: block;
    padding: 16px;
    position: relative;
    width: 100%;
    height: calc(100vh - 52px);
    margin-top: 52px;
    overflow: auto;

    @media only screen and (max-width: 991px) {
      width: auto;
      height: calc(100vh - 102px);
    }

    &--no-paddings {
      padding: 0;
    }
  }
}
</style>
