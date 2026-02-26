<template>
  <div class="invoices-info padding--6">
    <div class="invoices-info__content">
      <h1 class="invoices-info__title">
        {{ t('entities.invoices.title') }}
      </h1>

      <p class="invoices-info__description margin-top--6">
        <i18n-t keypath="entities.invoices.description">
          <template #noExtraCost>
            <strong>{{ t('entities.invoices.descriptionBold.noExtraCost') }}</strong>
          </template>
          <template #electronicFormat>
            <strong>{{ t('entities.invoices.descriptionBold.electronicFormat') }}</strong>
          </template>
          <template #digitalVault>
            <strong>{{ t('entities.invoices.descriptionBold.digitalVault') }}</strong>
          </template>
        </i18n-t>
      </p>

      <div class="margin-top--4">
        <p>
          {{ t('entities.invoices.benefitsTitle') }}
        </p>

        <ul class="invoices-benefits margin-top--4">
          <li
            class="
              invoices-benefits__item
              flex
              flex--align-items-center
              margin-bottom--4
            "
          >
            <PIcon
              class="invoices-benefits__icon"
              pName="lockDuotone"
              pSize="16"
            />
            <span class="margin-left--3">
              <i18n-t keypath="entities.invoices.benefit1">
                <template #mandatoryInvoice>
                  <strong>{{ t('entities.invoices.benefit1Bold.mandatoryInvoice') }}</strong>
                </template>
                <template #digitalTransition>
                  <strong>{{ t('entities.invoices.benefit1Bold.digitalTransition') }}</strong>
                </template>
              </i18n-t>
            </span>
          </li>
          <li
            class="
              invoices-benefits__item
              flex
              flex--align-items-center
              margin-bottom--4
            "
          >
            <PIcon
              class="invoices-benefits__icon"
              pName="shieldLockDuotone"
              pSize="16"
            />
            <span class="margin-left--3">
              <i18n-t keypath="entities.invoices.benefit2">
                <template #secure>
                  <strong>{{ t('entities.invoices.benefit2Bold.secure') }}</strong>
                </template>
                <template #durability>
                  <strong>{{ t('entities.invoices.benefit2Bold.durability') }}</strong>
                </template>
                <template #integrity>
                  <strong>{{ t('entities.invoices.benefit2Bold.integrity') }}</strong>
                </template>
                <template #traceability>
                  <strong>{{ t('entities.invoices.benefit2Bold.traceability') }}</strong>
                </template>
              </i18n-t>
            </span>
          </li>
          <li
            class="
              invoices-benefits__item
              flex
              flex--align-items-center
            "
          >
            <PIcon
              class="invoices-benefits__icon"
              pName="thumbUpDuotone"
              pSize="16"
            />
            <span class="margin-left--3">
              <i18n-t keypath="entities.invoices.benefit3">
                <template #csrPolicy>
                  <strong>{{ t('entities.invoices.benefit3Bold.csrPolicy') }}</strong>
                </template>
              </i18n-t>
            </span>
          </li>
        </ul>
      </div>

      <a
        :href="HELP_CENTER_URL"
        target="_blank"
        rel="noopener noreferrer"
        class="invoices-info__help-link margin-y--6 text-underline"
      >
        {{ t('entities.invoices.helpCenterLink') }}
      </a>

      <PAlert
        class="margin-top--4"
        pType="information"
      >
        <p class="margin-bottom--2">
          <i18n-t keypath="entities.invoices.alertText1">
            <template #reform>
              <strong>{{ t('entities.invoices.alertBold.reform') }}</strong>
            </template>
          </i18n-t>
        </p>
        <p>
          <i18n-t keypath="entities.invoices.alertText2">
            <template #electronicInvoice>
              <strong>{{ t('entities.invoices.alertBold.electronicInvoice') }}</strong>
            </template>
            <template #podcast>
              <a
                :href="PODCAST_URL"
                target="_blank"
                rel="noopener noreferrer"
                class="invoices-info__podcast-link text-underline"
              >
                <strong>{{ t('entities.invoices.alertBold.podcast') }}</strong>
              </a>
            </template>
          </i18n-t>
        </p>
      </PAlert>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PAlert, PIcon } from '@pulse/styleguide/components'
import { HELP_CENTER_URL, PODCAST_URL } from '@pulse/common/constants'

const { t } = useI18n()
</script>

<style scoped lang="scss">
.invoices-info {
  &__title {
    font-size: 24px;
    color: var(--p-gray-900);
  }

  &__description {
    line-height: 1.5;
    color: var(--p-gray-900);
  }

  &__help-link {
    display: block;
    font-size: 16px;
  }

  &__podcast-link {
    color: var(--p-jungle-600);
  }
}

.invoices-benefits {
  list-style: none;

  &__item {
    color: var(--p-gray-900);
  }
}
</style>
