<template>
  <div
    class="
      home-top-bar
      flex
      flex-gap--4
    "
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
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { PennylaneSSO } from '@pulse/widgets/gridless'
import { PennylanePermissionsManager, CurrentUserManager } from '@pulse/common/managers'
import { useUserStore, useCurrentEntityStore } from '@pulse/common/stores'
import { SubscriptionOfferCode } from '@pulse/common/enums'
import { ACCOUNT_PERMISSIONS } from '@pulse/common/constants'
import { WidgetName } from '@pulse/widgets/enums'

const userStore = useUserStore()
const currentEntityStore = useCurrentEntityStore()

const isPennylaneSSODisplayed = computed(() =>
  currentEntityStore.hasOffer(SubscriptionOfferCode.PENNYLANE) === true &&
  CurrentUserManager.hasCurrentEntityPermission(ACCOUNT_PERMISSIONS.PENNYLANE) === true,
)

const showEmailPennylaneWidget = computed(() =>
  PennylanePermissionsManager.hasPennylaneAccountingGedV2Permission() === true,
)
</script>
