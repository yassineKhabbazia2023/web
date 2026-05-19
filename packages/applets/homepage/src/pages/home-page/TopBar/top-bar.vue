<template>
  <div
    class="home-top-bar"
  >
    <PTitle
      v-if="isMobile === true && isPennylaneSSODisplayed === true"
      pIconName="pulse"
      pIconSize="30"
      :pIconColor="AppColors.JUNGLE_400"
      :pTitle="t('homepage.topBar.managementTools')"
      class="margin-bottom--4"
    />

    <div
      :class="{
        'flex flex-gap--4': isMobile === false,
        'flex flex-gap--3 flex--justify-content-left margin-x--2 margin-y--2': isMobile === true,
      }"
    >
      <PennylaneSSO
        v-if="isPennylaneSSODisplayed === true"
        :isCollab="userStore.isCollab ?? false"
      />
      <component
        :is="WidgetName.EMAIL_PENNYLANE"
        v-if="showEmailPennylaneWidget === true"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { PennylaneSSO } from '@pulse/widgets/gridless'
import { CurrentUserManager } from '@pulse/common/managers'
import { useUserStore, useCurrentEntityStore } from '@pulse/common/stores'
import { SubscriptionOfferCode } from '@pulse/common/enums'
import { ACCOUNT_PERMISSIONS } from '@pulse/common/constants'
import { WidgetName } from '@pulse/widgets/enums'
import { AppColors, useResponsive } from '@pulse/styleguide'
import { PTitle } from '@pulse/styleguide/components'

const { t } = useI18n()

const userStore = useUserStore()
const currentEntityStore = useCurrentEntityStore()
const { isMobile } = useResponsive()

const isPennylaneSSODisplayed = computed(() =>
  currentEntityStore.hasOffer(SubscriptionOfferCode.PENNYLANE) === true &&
  CurrentUserManager.hasCurrentEntityPermission(ACCOUNT_PERMISSIONS.PENNYLANE) === true,
)

const showEmailPennylaneWidget = computed(() =>
  isMobile.value === false &&
  currentEntityStore.hasOffer(SubscriptionOfferCode.PENNYLANE) === true,
)
</script>

