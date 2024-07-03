<template>
  <div v-if="!isLoading && defaultEntity" class="common-layout">
    <HomeScheduleDrawer v-if="calendarHasBeenOpened" v-model="showCalendar" />
    <PContainer pDirection="vertical">
      <PCHeader
        v-if="!isFullpage"
        class="header-container"
        height="56"
      >
        <Header
          v-model:showCalendar="showCalendar"
          @show-user-profile-drawer="handleClick"
        />
      </PCHeader>
      <PContainer class="aside-main-container">
        <PAside v-if="!isFullpage" class="aside-container">
          <Sidebar class="sidebar-container" />
        </PAside>
        <PContainer
          class="main-container"
          :class="{
            'main-container--no-paddings':
              stylesMetaProperties?.hasPaddings === false,
            'main-container--fullpage':
              isFullpage,
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
import { productFruits } from 'product-fruits'
import { VITE_PRODUCT_FRUITS_KEY } from 'env-vars'
import { commonStore as store, dataProvider } from '@kpmg/common'
import { PCHeader, PAside, PContainer, PBottomMenu } from '@kpmg/styleguide'
import { getBrowserName } from '@/helper'
import UserProfile from '@/components/UserProfile'
import HomeScheduleDrawer from '@/components/HomeScheduleDrawer'
import { ReloadOneTrust } from '@/plugins/OneTrust'
import Header from './Header'
import Sidebar from './Sidebar'
import { storeToRefs } from 'pinia'
import { fetchEntities } from '@/services/entities'
import { getDefaultEntity } from './Sidebar/components/SidebarEntity/utils'

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

const handleClick = () => {
  hasUserProfileDrawerOpened.value = true
  ReloadOneTrust()
}
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

const isFullpage = computed(
  () => router.currentRoute.value.meta.display?.fullpage,
)

const globalStore = store()
const { defaultEntity } = storeToRefs(globalStore)
// Hooks
onMounted(async () => {
  try {
    const user = await fetchUserData()
    const entities = await fetchEntities()
    const isProd = import.meta.env.PROD
    if (isProd) {
      productFruits.init(VITE_PRODUCT_FRUITS_KEY, 'fr', {
        username: user?.id,
        role: user?.isCollab ? 'Collaborateur' : 'Client',
        props: {
          browser: getBrowserName(),
        },
      })
    }

    const defaultEntity = getDefaultEntity(entities.items[0])
    globalStore.$patch({
      user: {
        ...user,
        entities: {
          default: defaultEntity,
          favorites: [],
        },
      },
    })
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
    padding-right: 52px;
    @media only screen and (min-width: 992px) {
      position: relative;
      z-index: 10;
    }
  }

  @media only screen and (max-width: 991px) {
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
    height: calc(100vh - 56px);
    margin-top: 56px;
    overflow: auto;

    @media only screen and (max-width: 991px) {
      height: calc(100vh - 108px);
    }

    &--no-paddings {
      padding: 0;
    }
    &--fullpage {
      padding: 0;
      margin: 0;
      height: 100vh;
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
