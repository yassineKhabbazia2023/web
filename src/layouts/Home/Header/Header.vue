<template>
  <div
    class="header-section
    flex
    flex--align-items-center
    flex--justify-content-space-between
    padding-y--3
    padding-x--6
    shadow--4"
  >
    <PImage
      class="header-section__logo"
      pType="logos"
      pName="pulse-color"
      pFit="fill"
    />
    <PToolbox
      :pElements="authenticatedUserToolbox"
      @p-toolbox-item-clicked="onActionClick"
    >
      <div class="header-section__user-avatar cursor-pointer">
        <PAvatar
          pShape="circle"
          pType="small"
          pColor="persian-gradient"
          data-ut="user-initials"
        >
          {{ userInitials }}
        </PAvatar>
      </div>
    </PToolbox>
  </div>
</template>
<i18n lang="yaml">
en-US:
  logout: 'Logout'
fr-FR:
  logout: 'Se déconnecter'
</i18n>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  commonStore as useStore,
  dataProvider as useDataProvider
} from '@kpmg/common'
import { useI18n } from 'vue-i18n'
import { PAvatar, PImage, PToolbox } from '@kpmg/styleguide'

const router = useRouter()
const store = useStore()
const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const { fetchUserData } = useDataProvider()
const firstName = ref(store.user?.firstName || '')
const lastName = ref(store.user?.lastName || '')

const authenticatedUserToolbox = [
  {
    pIconName: 'PIPower',
    pValue: t('logout'),
    pActionName: 'logout'
  }
]

const userInitials = computed(() => {
  return firstName.value?.charAt(0) + lastName.value?.charAt(0)
})

const onActionClick = async (actionName: string) => {
  if (actionName === 'logout') {
    await store.logout(store.$state)
    router.push({ name: 'login' })
  }
}

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
</script>

<style lang="scss" scoped>
.header-section {
  z-index: 10;
  position: fixed;
  top: 0;
  left: 27px;
  border-bottom-left-radius: 24px;
  height: 56px;
  width: calc(100vw - 27px);
  background-color: var(--el-color-base-white);

  &__logo {
    width: 149px;
    height: 20px;
  }
}
</style>
