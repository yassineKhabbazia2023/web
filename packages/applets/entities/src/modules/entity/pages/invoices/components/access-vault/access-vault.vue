<template>
  <div
    class="
      flex
      flex--align-items-start
      flex--direction-column
      access-vault
    "
  >
    <div class="access-vault__logo-wrapper margin-bottom--10">
      <PImage
        pType="logos"
        pName="brand-color"
      />
    </div>
    <h2 class="access-vault__title">
      <i18n-t keypath="entities.invoices.accessVault.title">
        <template #highlight>
          <span class="access-vault__title-highlight">
            {{ t('entities.invoices.accessVault.titleHighlight') }}
          </span>
        </template>
      </i18n-t>
    </h2>

    <p class="access-vault__description margin-top--4">
      {{ t('entities.invoices.accessVault.description') }}
    </p>

    <div class="margin-top--10 flex--align-self-center">
      <PButton
        pType="primary"
        pTag="a"
        target="_blank"
        :href="accessVaultUrl"
        :disabled="isAllowedToAccessVault === false"
        @click="handleLoginClick"
      >
        {{ t('entities.invoices.accessVault.loginButton') }}
      </PButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { VITE_RYDGE_INVOICES_LOGIN_URL } from 'env-vars'
import { PImage, PButton } from '@pulse/styleguide/components'
import { useI18n } from 'vue-i18n'
import { sanitizeUrl } from '@pulse/toolbox/utils/url'
import { InvoicesTracking } from '@entities/services/invoices/invoices.tracking.service'
const props = defineProps<{
  isAllowedToAccessVault: boolean
}>()

const { t } = useI18n()

function handleLoginClick() {
  if (props.isAllowedToAccessVault === true) {
    InvoicesTracking.trackInvoiceLoginButtonClick()
  }
}

const accessVaultUrl = computed(() => {
  return props.isAllowedToAccessVault === true ? sanitizeUrl(VITE_RYDGE_INVOICES_LOGIN_URL) : undefined
})
</script>

<style scoped lang="scss">
@use '@pulse/styleguide/scss/breakpoints' as breakpoints;

.access-vault {
  &__logo-wrapper {
    width: 130px;
    align-self: center;
  }

  &__title {
    font-size: 28px;
    font-weight: 600;
    line-height: 1.2;
    color: var(--p-black-rock-900);
    margin: 0;
  }

  &__title-highlight {
    color: var(--p-jungle-400);
  }

  &__description {
    margin: 0;
    width: 70%;

    @include breakpoints.media(md2) {
      width: 80%;
    }
  }
}
</style>
