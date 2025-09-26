<template>
  <div
    class="widget-power-bi-intro height--100"
    data-testid="widget-power-bi-intro"
  >
    <PImage
      pType="paupulse"
      pName="chart"
      pFit="fill"
    />
    <i18n-t
      keypath="widgets.powerBi.title"
      tag="h4"
      class="
        widget-power-bi-intro__title
        h4
        margin-top--4
        font-semibold
        text-color--neutral-gray-900
      "
    >
      <template #emphasis>
        <span class="text-color--secondary-amethyste">{{ t('widgets.powerBi.titleEmphasis') }}</span>
      </template>
    </i18n-t>
    <i18n-t
      keypath="widgets.powerBi.description"
      tag="p"
      class="
        widget-power-bi-intro__description
        margin-y--4
        text-color--neutral-gray-900
      "
    >
      <template #emphasis>
        <span class="font-semibold">
          {{ t('widgets.powerBi.descriptionEmphasis') }}
        </span>
      </template>
    </i18n-t>
    <a
      class="
          el-button el-button--default
          el-button--small
          p-button
          p-button--secondary
        "
      :href="POWER_BI_INTRODUCTION"
      target="_blank"
      rel="noopener"
      @click="widgetClick({
        event: AmplitudeEvent.WIDGET_INTERACTED,
        widgetName: WidgetName.POWERBI_INTRO,
        featureName: AmplitudeFeatureName.HOMEPAGE,
      })"
    >
      {{ t('widgets.powerBi.seeMore') }}
    </a>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { PImage } from '@pulse/styleguide/components'
import { POWER_BI_INTRODUCTION } from '@pulse/core'
import { widgetClick } from '@pulse/widgets/utils'
import { AmplitudeEvent, AmplitudeFeatureName } from '@pulse/common/enums'
import { WidgetName } from '@pulse/widgets/enums'

const { t } = useI18n()
</script>

<style lang="scss" scoped>
.widget-power-bi-intro {

  .widget-power-bi-intro__title {
    font-size: 16px;
  }
  .widget-power-bi-intro__description {
    font-size: 14px;
  }
}
</style>
