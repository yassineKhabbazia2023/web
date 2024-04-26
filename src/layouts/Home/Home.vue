<template>
  <div v-if="!isLoading" class="common-layout">
    <HomeScheduleDrawer
      v-if="calendarHasBeenOpened"
      v-model="showCalendar"
    />
    <PContainer pDirection="vertical">
      <PCHeader class="header-container" height="56">
        <Header
          v-model:showCalendar="showCalendar"
          @show-user-profile-drawer="hasUserProfileDrawerOpened = true"
        />
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
          <UserProfile
            v-if="hasUserProfileDrawerOpened"
            v-model="hasUserProfileDrawerOpened"
            :hasDrawerOpened="hasUserProfileDrawerOpened"
          />
          <router-view />
        </PContainer>
        <PContainer class="home-bottom-menu">
          <PBottomMenu :defaultActive="routeActive" :pItems="menuBottomMenu" />
        </PContainer>
      </PContainer>
    </PContainer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { commonStore as store, dataProvider } from '@kpmg/common'
import { PCHeader, PAside, PContainer, PBottomMenu } from '@kpmg/styleguide'
import UserProfile from '@/components/UserProfile'
import HomeScheduleDrawer from '@/components/HomeScheduleDrawer'
import Header from './Header'
import Sidebar from './Sidebar'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

// Variables
const route = useRoute()
const router = useRouter()
const routeActive = route.path
const { fetchUserData } = dataProvider()
const isLoading = ref<boolean>(true)
const calendarIsOpened = ref(false)
const calendarHasBeenOpened = ref(false)
const showCalendar = computed({
  get: () => calendarIsOpened.value,
  set: (value: boolean) => {
    calendarIsOpened.value = value
    if (value && !calendarHasBeenOpened.value) {
      // calendar has been opened at least once
      calendarHasBeenOpened.value = true
    }
  },
})
const hasUserProfileDrawerOpened = ref(false)

// Constants
const headerMenu = [
  {
    pIcon: 'PIGrid',
    pText: t('wallet'),
    pPath: '/portefeuille',
  },
  {
    pIcon: 'PIFolder',
    pText: t('ged'),
    pPath: '/ged',
  },
  {
    pIcon: 'PIFiles',
    pText: t('subscriptions'),
    pPath: '/subscription',
  },
  {
    pIcon: 'PICashCoin',
    pText: t('mandate'),
    pPath: '/mandats',
  },
]

const menuBottomMenu = headerMenu.map(({ pIcon, pText: pName, pPath }) => {
  return {
    pIcon,
    pName,
    pPath,
    pComponent: { render: () => null },
  }
})

// Computed
const stylesMetaProperties = computed(
  () => router.currentRoute.value.meta.styles,
)

// Hooks
onMounted(async () => {
  try {
    const user = await fetchUserData()
    store().$patch({
      user,
    })
    console.warn('patched')
  } catch (error) {
    console.error('Unable to fetch current user information: ', error)
  } finally {
    isLoading.value = false
  }
})
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
    overflow: visible;
  }

  .header-container {
    padding: 0;
  }

  .aside-container .sidebar-container {
    height: 100vh;
    @media only screen and (min-width: 992px) {
      position: relative;
      padding-right: 52px;
      z-index: 10;
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
