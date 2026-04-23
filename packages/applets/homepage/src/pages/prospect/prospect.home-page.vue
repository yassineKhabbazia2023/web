<template>
  <div
    class="prospect-home-page"
    data-testid="prospect-home-page"
  >
    <PEntityHeader
      v-if="currentEntity && isMobile === false"
      :pLegalName="currentEntity.legalName"
      :pAccountNumber="currentEntity.accountNumber"
      class="margin-bottom--4"
    />
    <component :is="WidgetName.WORKSPACE_INTRO" />
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useCurrentEntityStore } from '@pulse/common/stores'
import { PEntityHeader } from '@pulse/styleguide/components'
import { useResponsive } from '@pulse/styleguide'
import { WidgetName } from '@pulse/widgets/enums'

const { isMobile } = useResponsive()
const currentEntityStore = useCurrentEntityStore()
const { currentEntity } = storeToRefs(currentEntityStore)
</script>
