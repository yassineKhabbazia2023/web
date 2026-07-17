<template>
  <div class="wallet">
    <h3 class="h3 margin-bottom--6 wallet__title">
      {{ t('entities.wallet.hello') }} {{ user?.firstName }}
    </h3>

    <PTitle
      v-if="isMobile"
      :pTitle="t('entities.wallet.allEntities')"
      class="margin-bottom--4"
    />

    <PTabs
      :modelValue="activeTab"
      @tab-click="handleTabClick"
    >
      <PTabPane
        v-for="tab in tabs"
        :key="tab.route"
        :pLabel="t(tab.title)"
        :pCount="tab.count"
        :name="tab.route"
        class="margin-bottom--2"
      />
      <router-view />
    </PTabs>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
import { PTabs, PTabPane, PTitle } from '@pulse/styleguide/components'
import { useResponsive } from '@pulse/styleguide'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import { usePermissionsStore, useUserStore } from '@pulse/common/stores'
import { WalletManager } from './managers'
import type { TabsPaneContext } from '@pulse/styleguide/types'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const { user, isCollab } = storeToRefs(userStore)
const { isMobile } = useResponsive()

const activeTab = computed(() => route.name as string)

const handleTabClick = (tab: TabsPaneContext) => {
  const clickedTab = tabs.value.find(t => t.route === tab.paneName)

  if (clickedTab) {
    AmplitudeService.track('Feature Consulted', {
      feature_name: t(clickedTab.title).toLowerCase(),
    })
    router.push({ name: clickedTab.route })
  }
}

const permissionsStore = usePermissionsStore()

const getFilteredTabs = () => WalletManager.getTabsForUser(isCollab.value ?? false, isMobile.value)

const tabs = ref(getFilteredTabs())

watch([() => permissionsStore.userPermissions, () => userStore.walletInformation, isCollab, isMobile], () => {
  tabs.value = getFilteredTabs()
})
</script>
