<template>
  <div class="wallet">
    <h3 class="h3 margin-bottom--6 wallet__title">
      {{ t('entities.wallet.hello') }} {{ user?.firstName }}
    </h3>

    <PTabs
      :modelValue="activeTab"
      @tab-click="handleTabClick"
    >
      <PTabPane
        v-for="tab in tabs"
        :key="tab.name"
        :pLabel="t(tab.title)"
        :name="tab.name"
        class="margin-bottom--6"
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
import { PTabs, PTabPane } from '@pulse/styleguide/components'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import { usePermissionsStore, useUserStore } from '@pulse/common/stores'
import { WalletManager } from './manager'
import type { TabsPaneContext } from '@pulse/styleguide/types'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const { user, isCollab } = storeToRefs(userStore)

const activeTab = computed(() => route.name as string)

const handleTabClick = (tab: TabsPaneContext) => {
  const clickedTab = tabs.value.find(t => t.name === tab.paneName)

  if (clickedTab) {
    AmplitudeService.track('Feature Consulted', {
      feature_name: tab.props.label.toLowerCase(),
    })
    router.push({ name: clickedTab.route })
  }
}

const tabs = ref(WalletManager.getTabsForUser(isCollab.value ?? false))

const permissionsStore = usePermissionsStore()
watch(() => permissionsStore.userPermissions, async () => {
  tabs.value = WalletManager.getTabsForUser(isCollab.value ?? false)
})
</script>
