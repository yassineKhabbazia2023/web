<template>
  <div>
    <h2 class="font-bold margin-bottom--6">
      {{ t('widgets.pennylaneAmendmentFlow.step1.title') }}
    </h2>

    <PNoticeCard
      :pTitle="t('widgets.pennylaneAmendmentFlow.step1.reform.title')"
      p-icon="scales"
      p-header-color="teal"
      p-body-color="light-blue"
      class="margin-bottom--4 font-base"
    >
      <p class="margin-bottom--3">
        {{ t('widgets.pennylaneAmendmentFlow.step1.reform.description') }}
      </p>
      <p class="margin-bottom--2">
        <span class="font-bold">
          {{ t('widgets.pennylaneAmendmentFlow.step1.reform.listIntroBold') }}
        </span>
        {{ t('widgets.pennylaneAmendmentFlow.step1.reform.listIntro') }}
      </p>
      <ul class="margin--0 padding-left--6">
        <li>{{ t('widgets.pennylaneAmendmentFlow.step1.reform.listItem1') }}</li>
        <li>{{ t('widgets.pennylaneAmendmentFlow.step1.reform.listItem2') }}</li>
        <li>{{ t('widgets.pennylaneAmendmentFlow.step1.reform.listItem3') }}</li>
        <li>{{ t('widgets.pennylaneAmendmentFlow.step1.reform.listItem4') }}</li>
      </ul>
    </PNoticeCard>

    <PNoticeCard
      :pTitle="t('widgets.pennylaneAmendmentFlow.step1.pennylane.title')"
      p-icon="pennylaneColor"
      p-header-color="dark-green"
      p-body-color="green-lighter"
      class="margin-bottom--6 font-base"
    >
      <p class="margin--0">
        {{ t('widgets.pennylaneAmendmentFlow.step1.pennylane.descriptionPart1') }}
        <span class="font-bold">
          {{ t('widgets.pennylaneAmendmentFlow.step1.pennylane.descriptionBold') }}
        </span>
        {{ t('widgets.pennylaneAmendmentFlow.step1.pennylane.descriptionPart2') }}
      </p>
    </PNoticeCard>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PNoticeCard } from '@pulse/styleguide/components'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'global',
})
</script>
