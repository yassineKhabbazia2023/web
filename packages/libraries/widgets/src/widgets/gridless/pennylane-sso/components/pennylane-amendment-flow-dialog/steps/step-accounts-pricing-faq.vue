<template>
  <div
    class="
      step-accounts-pricing-faq
      padding-responsive--dialog-content
    "
  >
    <div class="faq-section margin-y--8">
      <div class="faq-section__header flex flex--align-items-center margin-bottom--3">
        <PIcon
          pName="scales"
          pSize="20"
          class="text-color--base-white margin-right--2"
        />
        <h3 class="font-bold font-large text-color--base-white margin--0">
          {{ t('widgets.pennylaneAmendmentFlow.step2.faq.risks.title') }}
        </h3>
      </div>
      <ul class="list-style-none font-base font-normal margin-left--2 padding--0">
        <li
          v-for="(item, index) in RISK_ITEMS"
          :key="index"
          class="faq-section__item text-color--text-white"
        >
          {{ item }}
        </li>
      </ul>
    </div>

    <div class="faq-section">
      <div class="faq-section__header flex flex--align-items-center margin-bottom--3">
        <PIcon
          pName="currencyEuro"
          pSize="20"
          class="text-color--base-white margin-right--2"
        />
        <h3 class="font-bold font-large text-color--base-white margin--0">
          {{ t('widgets.pennylaneAmendmentFlow.step2.faq.reform.title') }}
        </h3>
      </div>
      <ul class="list-style-none font-base font-normal margin-left--2 padding--0">
        <li
          v-for="(item, index) in REFORM_ITEMS"
          :key="index"
          class="faq-section__item text-color--text-white"
        >
          {{ item }}
        </li>
      </ul>
    </div>

    <div class="faq-section margin-y--8">
      <div class="faq-section__header flex flex--align-items-center margin-bottom--3">
        <PIcon
          pName="pennylane"
          pSize="20"
          class="text-color--base-white margin-right--2"
        />
        <h3 class="font-bold font-large text-color--base-white margin--0">
          {{ t('widgets.pennylaneAmendmentFlow.step2.faq.pennylane.title') }}
        </h3>
      </div>
      <ul class="list-style-none font-base font-normal margin-left--2 padding--0">
        <li class="faq-section__item text-color--text-white">
          <span class="font-bold">
            {{ t('widgets.pennylaneAmendmentFlow.step2.faq.pennylane.item1Bold') }}
          </span>
          {{ t('widgets.pennylaneAmendmentFlow.step2.faq.pennylane.item1') }}
        </li>
        <li class="faq-section__item text-color--text-white">
          <span class="font-bold">
            {{ t('widgets.pennylaneAmendmentFlow.step2.faq.pennylane.item2Bold') }}
          </span>
          {{ t('widgets.pennylaneAmendmentFlow.step2.faq.pennylane.item2') }}
        </li>
        <li class="faq-section__item text-color--text-white">
          <span class="font-bold">
            {{ t('widgets.pennylaneAmendmentFlow.step2.faq.pennylane.item3Bold') }}
          </span>
          {{ t('widgets.pennylaneAmendmentFlow.step2.faq.pennylane.item3') }}
        </li>
        <li class="faq-section__item text-color--text-white">
          <span class="font-bold">
            {{ t('widgets.pennylaneAmendmentFlow.step2.faq.pennylane.item4Bold') }}
          </span>
          {{ t('widgets.pennylaneAmendmentFlow.step2.faq.pennylane.item4') }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { PIcon } from '@pulse/styleguide/components'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'global',
})

const RISK_ITEMS = computed(() => [
  t('widgets.pennylaneAmendmentFlow.step2.faq.risks.item1'),
  t('widgets.pennylaneAmendmentFlow.step2.faq.risks.item2'),
  t('widgets.pennylaneAmendmentFlow.step2.faq.risks.item3'),
])

const REFORM_ITEMS = computed(() => [
  t('widgets.pennylaneAmendmentFlow.step2.faq.reform.item1'),
  t('widgets.pennylaneAmendmentFlow.step2.faq.reform.item2'),
  t('widgets.pennylaneAmendmentFlow.step2.faq.reform.item3'),
])
</script>

<style lang="scss" scoped>
.step-accounts-pricing-faq {
  height: 100%;
  overflow-y: auto;
}

.faq-section {
  &__item {
    margin-bottom: 4px;
    padding-left: 16px;
    position: relative;

    &::before {
      content: '•';
      position: absolute;
      left: 0;
      color: var(--p-base-white);
    }

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
