<template>
  <PHeader>
    <template #logo>
      <PImage
        class="el-menu--header__logo"
        pType="logos"
        pName="pulse-color"
        pFit="fill"
      />
    </template>
    <template #menu>
      <PHeaderTabs
        :pHeaderTabsMenu="headerMenu"
        :pDefaultActive="defaultActive"
        class="home-header-tabs"
      />
    </template>
    <template #header-right>
      <PToolbox
        :pElements="toolboxBasicData"
        @p-toolbox-item-clicked="logoutHandler"
      >
        <div class="avatar-container">
          <PAvatar
            pShape="circle"
            pType="small"
            pColor="persian-gradient"
            data-ut="userInitial"
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
import { useRouter } from 'vue-router'
import { ref, computed, onMounted } from 'vue'

import { PAvatar, PHeader, PHeaderTabs, PImage, PToolbox } from '@kpmg/styleguide'
import { commonStore as useStore, dataProvider as useDataProvider } from '@kpmg/common'
import { useI18n } from 'vue-i18n'
import type { HeaderMenu } from './HeaderTypes'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

interface Props {
  headerMenu: HeaderMenu[]
  defaultActive: string | undefined
}

withDefaults(defineProps<Props>(), {
  headerMenu: () => []
})

const router = useRouter()
const store = useStore()
const { fetchUserData } = useDataProvider()
const firstName = ref(store.user?.firstName || '')
const lastName = ref(store.user?.lastName || '')

onMounted(async () => {
  if (!store.user && store.isAuthenticated) {
    const user = await fetchUserData()
    store.$patch({
      user: {
        email: user?.email,
        firstName: user?.firstName,
        lastName: user?.lastName,
        isCollab: user?.isCollab,
        id: user?.id
      }
    })
    firstName.value = user?.firstName
    lastName.value = user?.lastName
  }
})
const toolboxBasicData = [
  {
    pIconName: 'PIPower',
    pValue: t('logout'),
    pActionName: 'logout'
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
