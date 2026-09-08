<template>
  <div
    class="
      flex
      flex--direction-column
      flex-gap--6
      bg--surface-information-primary
      padding--6
    "
  >
    <div
      class="
        flex
        flex--direction-column
        flex--align-items-flex-start
        flex-gap--1
      "
    >
      <PTag
        pColor="dark-green"
        pIconLeftName="stars"
        :pContent="t('entities.invoices.accessVaultRedirect.tag')"
      />

      <h3
        class="
          font-size--21
          font-semibold
          text-color--text-heading
          margin--0
        "
      >
        {{ t('entities.invoices.accessVaultRedirect.title') }}
      </h3>
    </div>

    <div
      class="
        flex
        flex--direction-column
        flex-gap--4
      "
    >
      <p
        class="
          font-size--14
          font-normal
          text-color--text-body
          margin--0
        "
      >
        {{ t('entities.invoices.accessVaultRedirect.description') }}
      </p>

      <ul
        class="
          list-style-none
          margin--0
          padding--0
          flex
          flex--direction-column
          flex-gap--4
        "
      >
        <li
          class="
            flex
            flex--align-items-center
            flex-gap--2
            font-size--14
            font-normal
            text-color--text-body
          "
        >
          <PIcon
            pName="rydgeMonogram"
            pSize="16"
          />
          <i18n-t
            tag="span"
            keypath="entities.invoices.accessVaultRedirect.navigationBullet"
          >
            <template #navigationBar>
              <span class="font-bold">
                {{ t('entities.invoices.accessVaultRedirect.navigationBarHighlight') }}
              </span>
            </template>
            <template #invoicesFile>
              <span class="font-bold">
                {{ t('entities.invoices.accessVaultRedirect.invoicesFileHighlight') }}
              </span>
            </template>
          </i18n-t>
        </li>
        <li
          class="
            flex
            flex--align-items-center
            flex-gap--2
            font-size--14
            font-normal
            text-color--text-body
          "
        >
          <PIcon
            pName="shield"
            pSize="16"
          />
          <i18n-t
            tag="span"
            keypath="entities.invoices.accessVaultRedirect.vaultBullet"
          >
            <template #vaultAccess>
              <span class="font-bold">
                {{ t('entities.invoices.accessVaultRedirect.vaultAccessHighlight') }}
              </span>
            </template>
            <template #historicalInvoices>
              <span class="font-bold">
                {{ t('entities.invoices.accessVaultRedirect.historicalInvoicesHighlight') }}
              </span>
            </template>
          </i18n-t>
        </li>
      </ul>

      <div
        class="
          access-vault-redirect__file-box
          flex
          flex--align-items-center
          flex-gap--3
        "
      >
        <PIcon
          pName="filetypeNone"
          pSize="16"
        />
        <span
          class="
            font-size--14
            font-semibold
            text-color--text-body
            pre-line
          "
        >
          {{ t('entities.invoices.accessVaultRedirect.fileBoxLabel') }}
        </span>
      </div>
    </div>

    <PButton
      pType="primary"
      class="flex--align-self-stretch"
      pTestId="access-vault-redirect-button"
      @click="handleAccessInvoicesClick"
    >
      {{ t('entities.invoices.accessVaultRedirect.ctaLabel') }}
      <PIcon
        pName="arrowRight"
        pSize="16"
        class="margin-left--2"
      />
    </PButton>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PButton, PIcon, PTag } from '@pulse/styleguide/components'
import { useAccessVaultRedirect } from './access-vault-redirect.composable'

const { t } = useI18n()

const { handleAccessInvoicesClick } = useAccessVaultRedirect()
</script>

<style scoped lang="scss">
// No design system utility covers this fixed-size preview of a nav item.
.access-vault-redirect__file-box {
  width: 200px;
  height: 50px;
  padding: 9px 17px;
  background: var(--p-navbar-client-surface-active);
  border-right: 6px solid var(--p-jungle-400);
}
</style>
