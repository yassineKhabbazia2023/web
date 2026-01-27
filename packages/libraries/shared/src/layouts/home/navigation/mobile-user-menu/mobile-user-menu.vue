<template>
  <PDrawer
    v-model="isDrawerOpened"
    :pTitle="t('menu')"
    pSize="100%"
    class="mobile-user-menu"
    data-testid="mobile-user-menu"
    @close-drawer-button="isDrawerOpened = false"
  >
    <!-- Multi-Entities management -->
    <div class="mobile-user-menu__content flex flex--direction-column padding-x--4">
      <nav
        v-if="isMultiEntity"
        class="mobile-user-menu__section padding-y--2"
      >
        <MobileUserMenuItem
          :label="t('myPortfolio')"
          :to="{ name: RouteName.CUSTOMER_ENTITIES }"
          @click="closeDrawer"
        />
        <MobileUserMenuItem
          :label="t('allUsers')"
          :to="{ name: RouteName.ALL_USERS }"
          @click="closeDrawer"
        />
      </nav>

      <!-- User Profile -->
      <nav class="mobile-user-menu__section mobile-user-menu__section--no-border padding-y--2">
        <MobileUserMenuItem
          :label="t('myInformation')"
          :to="{ name: RouteName.PROFILE_INFORMATION }"
          @click="closeDrawer"
        />
        <MobileUserMenuItem
          v-if="showPassword"
          :label="t('password')"
          :to="{ name: RouteName.PROFILE_PASSWORD }"
          @click="closeDrawer"
        />
      </nav>

      <!-- Legal stuff -->
      <nav class="mobile-user-menu__section mobile-user-menu__section--legal padding-y--2">
        <MobileUserMenuItem
          :label="t('legalNotice')"
          :href="LEGAL_NOTICE_URL"
        />
        <MobileUserMenuItem
          v-if="showCgu"
          :label="t('cgu')"
          :href="urlTerms"
        />
        <MobileUserMenuItem
          :label="t('privacyPolicy')"
          :href="PRIVACY_POLICY_URL"
        />
        <MobileUserMenuItem
          :label="t('manageCookies')"
          is-action
          icon-name="sliders"
          @click="openAxeptioCookies"
        />
      </nav>
    </div>

    <template #footer>
      <div class="flex flex--justify-content-center">
        <LogoutButton variant="mobile" />
      </div>
    </template>
  </PDrawer>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { PDrawer } from '@pulse/styleguide/components'
import { RouteName } from '@pulse/common/enums'
import { LEGAL_NOTICE_URL, PRIVACY_POLICY_URL } from '@pulse/common/constants'
import { fetchUrlTerms } from '@pulse/common'
import { useUserStore } from '@pulse/common/stores'
import { openAxeptioCookies } from '@pulse/shared/plugins'
import LogoutButton from '../../user-profile/components/logout-button'
import MobileUserMenuItem from './mobile-user-menu-item.vue'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const userStore = useUserStore()

const isDrawerOpened = defineModel<boolean>('isDrawerOpened', { default: false })

const urlTerms = ref('')

const showPassword = computed(() => userStore.isCollab === false)
const showCgu = computed(() => userStore.isCollab === false)
const isMultiEntity = computed(() => userStore.getIsSingleEntity() === false)

const closeDrawer = () => {
  isDrawerOpened.value = false
}

onMounted(async () => {
  urlTerms.value = await fetchUrlTerms()
})
</script>

<style lang="scss" scoped>
.mobile-user-menu {
  &__content {
    height: 100%;
  }

  &__section {
    border-bottom: 1px solid var(--p-gray-100);

    &:last-child {
      border-bottom: none;
    }

    &--no-border {
      border-bottom: none;
    }

    &--legal {
      margin-top: auto;
    }
  }
}
</style>

<i18n lang="json">
{
  "en-US": {
    "menu": "Menu",
    "myPortfolio": "My entities",
    "allUsers": "All users",
    "myInformation": "My information",
    "password": "Password",
    "legalNotice": "Legal Notice",
    "cgu": "CGU",
    "privacyPolicy": "Privacy Policy",
    "manageCookies": "Manage cookies"
  },
  "fr-FR": {
    "menu": "Menu",
    "myPortfolio": "Mes entités",
    "allUsers": "Tous les utilisateurs",
    "myInformation": "Mes informations",
    "password": "Mot de passe",
    "legalNotice": "Mentions légales",
    "cgu": "CGU",
    "privacyPolicy": "Politique de confidentialité",
    "manageCookies": "Gérer mes cookies"
  }
}
</i18n>
