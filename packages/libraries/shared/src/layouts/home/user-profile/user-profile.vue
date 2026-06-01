<template>
  <PDrawer
    v-model="isDrawerOpened"
    :pTitle="t('profileSettings')"
    pDirection="ttb"
    pType="mini"
    class="user-profile-drawer"
    @close-drawer-button="isDrawerOpened = false"
  >
    <PTabs
      v-if="shouldShowTabs"
      v-model="activeTab"
      p-stretch
    >
      <PTabPane
        pName="information"
        :pLabel="t('tabInformation')"
      >
        <MyInformation />
      </PTabPane>
      <PTabPane
        v-if="hasPasswordTab"
        pName="password"
        :pLabel="t('tabPassword')"
      >
        <UpdatePassword />
      </PTabPane>
    </PTabs>
    <MyInformation v-else />

    <template #footer>
      <div
        v-show="shouldShowTabs ? activeTab === 'information' : true"
        id="my-information__footer-drawer"
        class="
          flex
          flex--align-items-center
          flex-gap--3
        "
      >
        <PButton
          v-if="shouldShowSwitchToMobileButton === true"
          pType="tertiary"
          data-testid="user-profile-activate-mobile-mode"
          @click="handleActivateMobileMode"
        >
          <PIcon
            pName="phone"
            class="el-button__icon--left"
          />
          {{ t('activateMobileMode') }}
        </PButton>
      </div>
      <div
        v-show="shouldShowTabs && activeTab === 'password'"
        id="update-password__footer-drawer"
      />
    </template>
  </PDrawer>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { PButton, PDrawer, PIcon, PTabs, PTabPane } from '@pulse/styleguide/components'
import { disableForceDesktopMode, useResponsive } from '@pulse/styleguide'
import { useUserStore } from '@pulse/common/stores'
import MyInformation from './components/my-information'
import UpdatePassword from './components/update-password'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      profileSettings: 'Profile Settings',
      tabInformation: 'My information',
      tabPassword: 'Password',
      activateMobileMode: 'Switch to mobile mode',
    },
    'fr-FR': {
      profileSettings: 'Paramètres du profil',
      tabInformation: 'Mes informations',
      tabPassword: 'Mot de passe',
      activateMobileMode: 'Passer en mode mobile',
    },
  },
})

const userStore = useUserStore()
const { forceDesktopMode, isViewportMobile } = useResponsive()

const isDrawerOpened = defineModel<boolean>('isDrawerOpened', { default: false })
const activeTab = ref<string>('information')
const isCollab = computed(() => userStore.isCollab)
const hasPasswordTab = computed(() => isCollab.value === false)
const shouldShowTabs = computed(() => hasPasswordTab.value)
const shouldShowSwitchToMobileButton = computed(
  () => forceDesktopMode.value === true && isViewportMobile.value === true,
)

const handleActivateMobileMode = () => {
  disableForceDesktopMode()
  isDrawerOpened.value = false
}
</script>

<style lang="scss" scoped>
@use '@pulse/styleguide/scss/breakpoints' as breakpoints;

// On small screens the drawer is shown full-width, so stack the footer actions
// vertically (one under the other) instead of side by side to avoid overflow.
@include breakpoints.media(xs) {
  #my-information__footer-drawer {
    flex-direction: column;
  }
}
</style>
