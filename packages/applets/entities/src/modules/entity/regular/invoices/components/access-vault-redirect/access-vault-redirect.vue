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
        pRound
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
          text-color--gray-900
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
            flex--align-items-flex-start
            flex-gap--2
            font-size--14
            font-normal
            text-color--gray-900
          "
        >
          <PIcon
            pName="clockHistory"
            pSize="16"
            :pColor="AppColors.JUNGLE_400"
          />
          <span>{{ t('entities.invoices.accessVaultRedirect.ventyaBullet') }}</span>
        </li>
        <li
          class="
            flex
            flex--align-items-flex-start
            flex-gap--2
            font-size--14
            font-normal
            text-color--gray-900
          "
        >
          <PIcon
            pName="rydgeMonogram"
            pSize="16"
            :pColor="AppColors.JUNGLE_400"
          />
          <i18n-t
            tag="span"
            keypath="entities.invoices.accessVaultRedirect.rydgeBullet"
          >
            <template #highlight>
              <span class="font-semibold">
                {{ t('entities.invoices.accessVaultRedirect.rydgeBulletHighlight') }}
              </span>
            </template>
          </i18n-t>
        </li>
      </ul>
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
import { AppColors } from '@pulse/styleguide'
import { useAccessVaultRedirect } from './access-vault-redirect.composable'

const { t } = useI18n()

const { handleAccessInvoicesClick } = useAccessVaultRedirect()
</script>
