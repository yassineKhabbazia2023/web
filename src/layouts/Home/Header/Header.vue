<template>
  <PHeader
    :ellipsis="false"
    :menu="props.menu"
    :defaultActive="routeActive"
    router
  >
    <template #logo>
      <router-link to="/" class="el-menu--header__link">
        <PImage
          class="el-menu--header__logo"
          type="logos"
          name="pulse-color"
          fit="fill"
        />
      </router-link>
    </template>
    <template #menu>
      <PHeaderTabs
        :menu="props.menu"
        class="home-header-tabs"
      />
    </template>
    <template #header-right>
      <PToolbox
        :elements="toolboxBasicData"
        @p-toolbox-item-clicked="logoutHandler"
      >
        <div class="avatar-container">
          <PAvatar
            shape="circle"
            size="small"
            color="persian-gradient"
          >
            {{ initial }}
          </PAvatar>
        </div>
      </PToolbox>
    </template>
  </PHeader>
</template>

<i18n lang="yaml">
  en-US:
    logout: 'Logout'
  fr-FR:
    logout: 'Se déconnecter'
</i18n>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref, computed, Component } from 'vue'

import { PAvatar, PHeader, PHeaderTabs, PImage, PToolbox } from '@kpmg/styleguide'
import { commonStore as useStore, dataProvider as useDataProvider } from '@kpmg/common'
import { useI18n } from 'vue-i18n'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

interface Item {
  icon: string
  text: string
  path: string
  component?: Component
}

interface Props {
  menu: Item[]
}

const props = withDefaults(defineProps<Props>(), {
  menu: () => []
})

const route = useRoute()
const router = useRouter()
const store = useStore()
const { fetchUserData } = useDataProvider()
const routeActive = route.path
if (!store.user && store.isAuthenticated) {
  const user = await fetchUserData()
  store.$patch({
    user: {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isCollab: user.isCollab,
      id: user.id
    }
  })
}

const firstName = ref(store.user?.firstName)
const lastName = ref(store.user?.lastName)

const toolboxBasicData = [
  {
    iconName: 'PIPower',
    value: t('logout'),
    actionName: 'logout'
  }
]

const logoutHandler = async (actionName: string) => {
  if (actionName === 'logout') {
    await store.logout(store.$state)
    router.push({ name: 'login' })
  }
}

const initial = computed(() => {
  return '' + firstName.value?.charAt(0) + lastName.value?.charAt(0)
})

</script>
<style scoped>
@media only screen and (max-width: 991px)  {
  .home-header-tabs {
    display: none;
  }
}

.avatar-container {
  cursor: pointer;
}
</style>
