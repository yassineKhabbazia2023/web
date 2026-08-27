<template>
  <PAlert
    v-if="shouldShowBanner"
    pType="information"
    class="margin-bottom--4"
    data-testid="demat-mail-banner"
  >
    <div
      class="
        flex
        flex--align-items-center
        flex--justify-content-space-between
        flex-gap--4
      "
    >
      <span>
        <span class="font-bold">{{ t('entities.dematMail.banner.title') }}</span>
        {{ t('entities.dematMail.banner.description') }}
      </span>

      <PButton
        pType="primary"
        pSize="small"
        pTestId="demat-mail-banner-button"
        @click="handleComplete"
      >
        {{ t('entities.dematMail.banner.button') }}
        <PIcon
          pName="arrowRight"
          pSize="16"
          class="margin-left--2"
        />
      </PButton>
    </div>
  </PAlert>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { PAlert, PButton, PIcon } from '@pulse/styleguide/components'
import { useDematMailStore } from '@pulse/common/stores'
import { DematMailLocalisation } from '@pulse/common/services/invoices'
import { RouteName } from '@pulse/common/enums'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'global',
})

const route = useRoute()
const dematMailStore = useDematMailStore()
const { shouldShowBanner } = storeToRefs(dematMailStore)

// The banner sits above every page: the folder homepage is tracked as "Home",
// any other page as "Header".
const localisation = computed(() => (
  route.name === RouteName.HOMEPAGE
    ? DematMailLocalisation.HOME
    : DematMailLocalisation.HEADER
))

function handleComplete() {
  dematMailStore.openDialog(localisation.value)
}
</script>

<style scoped lang="scss">
// PAlert has no action slot: the content block must grow for the button to sit
// on the right edge of the banner.
:deep(.p-alert__content) {
  flex-grow: 1;
}
</style>
