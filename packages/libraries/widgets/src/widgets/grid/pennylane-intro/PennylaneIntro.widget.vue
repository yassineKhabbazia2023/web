<template>
  <div
    class="
      widget-pennylane-intro
      height--100
      bg--jungle-50
      flex
      flex--justify-content-space-between
      position--relative
      overflow-hidden
    "
    data-testid="widget-pennylane-intro"
  >
    <div
      class="
        widget-pennylane-intro__left-section
        padding--6
        position--relative
      "
    >
      <div
        class="
          widget-pennylane-intro__header
          flex
          flex--align-items-center
          bg--base-white
          padding-left--1
          padding-right--3
          padding-y--1
        "
      >
        <PTag
          pColor="dark-green"
          :pContent="t('widgets.pennylaneIntro.header.new')"
          pIconLeftName="stars"
        />
        <i18n-t
          class="
            intro-header-text
            padding-left--2
            font-small
          "
          keypath="widgets.pennylaneIntro.header.toolChange"
          tag="span"
          scope="global"
        >
          <template #accountingTool>
            <span class="font-bold">{{ t('widgets.pennylaneIntro.header.accounting') }}</span>
          </template>
        </i18n-t>
      </div>

      <div class="widget-pennylane-intro__title margin-top--4 font-bold">
        <i18n-t keypath="widgets.pennylaneIntro.title.revolutionizingSoftware" scope="global">
          <template #brand>
            <span class="text-color--secondary-amethyste">{{ t('widgets.pennylaneIntro.title.brand') }}</span>
          </template>
          <template #softwareName>
            <span class="text-color--secondary-amethyste">{{ t('widgets.pennylaneIntro.title.pennylane') }}</span>
          </template>
        </i18n-t>
      </div>

      <div class="widget-pennylane-intro__description margin-top--4">
        <i18n-t
          keypath="widgets.pennylaneIntro.description.partnerChange"
          tag="p"
          scope="global"
        >
          <template #accountingManagement>
            <span class="font-bold">{{ t('widgets.pennylaneIntro.description.accountingManagement') }}</span>
          </template>
        </i18n-t>

        <i18n-t
          class="margin-top--4"
          keypath="widgets.pennylaneIntro.description.newProcedure"
          tag="p"
          scope="global"
        >
          <template #accountingDocumentsDeposit>
            <span class="font-bold">{{ t('widgets.pennylaneIntro.description.accountingDocumentsDeposit') }}</span>
          </template>
        </i18n-t>

        <ul class="widget-pennylane-intro__list margin-top--4 margin-left--4 padding--0">
          <i18n-t
            keypath="widgets.pennylaneIntro.description.links.pennylaneConnection"
            tag="li"
            scope="global"
          >
            <template #pennylaneFromRydge>
              <a
                class="text-underline text-color--secondary-amethyste"
                :href="PENNYLANE_ACTIVATION_AND_CONNECTION_HELP_URL"
                target="_blank"
                @click="widgetClick({
                  event: AmplitudeEvent.WIDGET_INTERACTED,
                  widgetName: WidgetName.PENNYLANE_INTRO,
                  featureName: AmplitudeFeatureName.HOMEPAGE,
                  widgetItemClicked: WidgetItemClicked.PENNYLANE_CONNECTED
                })"
              >
                {{ t('widgets.pennylaneIntro.description.links.pennylaneFromRydge') }}
              </a>
            </template>
          </i18n-t>

          <i18n-t
            keypath="widgets.pennylaneIntro.description.links.pennylaneSession"
            tag="li"
            scope="global"
          >
            <template #pennylaneFreeClass>
              <a
                class="text-underline text-color--secondary-amethyste"
                :href="PENNYLANE_FREE_CLASS_SESSION_URL"
                target="_blank"
                @click="widgetClick({
                  event: AmplitudeEvent.WIDGET_INTERACTED,
                  widgetName: WidgetName.PENNYLANE_INTRO,
                  featureName: AmplitudeFeatureName.HOMEPAGE,
                  widgetItemClicked: WidgetItemClicked.PENNYLANE_SESSION
                })"
              >
                {{ t('widgets.pennylaneIntro.description.links.pennylaneFreeClass') }}
              </a>
            </template>
          </i18n-t>

          <i18n-t
            keypath="widgets.pennylaneIntro.description.links.invoiceDeposit"
            tag="li"
            scope="global"
          >
            <template #pennylanePlatform>
              <a
                class="text-underline text-color--secondary-amethyste"
                :href="PENNYLANE_IMPORT_INVOICE_HELP_URL"
                target="_blank"
                @click="widgetClick({
                  event: AmplitudeEvent.WIDGET_INTERACTED,
                  widgetName: WidgetName.PENNYLANE_INTRO,
                  featureName: AmplitudeFeatureName.HOMEPAGE,
                  widgetItemClicked: WidgetItemClicked.PENNYLANE_DEPOSED
                })"
              >
                {{ t('widgets.pennylaneIntro.description.links.pennylanePlatform') }}
              </a>
            </template>
          </i18n-t>

          <i18n-t
            keypath="widgets.pennylaneIntro.description.links.discover"
            tag="li"
            scope="global"
          >
            <template #pennylaneAppDiscovery>
              <a
                class="text-underline text-color--secondary-amethyste"
                :href="PENNYLANE_MOBILE_APP_URL"
                target="_blank"
                @click="widgetClick({
                  event: AmplitudeEvent.WIDGET_INTERACTED,
                  widgetName: WidgetName.PENNYLANE_INTRO,
                  featureName: AmplitudeFeatureName.HOMEPAGE,
                  widgetItemClicked: WidgetItemClicked.PENNYLANE_MOBILE
                })"
              >
                {{ t('widgets.pennylaneIntro.description.links.pennylaneAppDiscovery') }}
              </a>
            </template>
          </i18n-t>
        </ul>
      </div>

      <div
        class="
          widget-pennylane__actions
          margin-top--6
          flex
          flex-gap--4
        "
      >
        <PButton
          :href="PENNYLANE_GETTING_STARTED_URL"
          pTag="a"
          pType="primary"
          target="_blank"
          pSize="small"
          @click="widgetClick({
            event: AmplitudeEvent.WIDGET_INTERACTED,
            widgetName: WidgetName.PENNYLANE_INTRO,
            featureName: AmplitudeFeatureName.HOMEPAGE,
            widgetItemClicked: WidgetItemClicked.PENNYLANE_GETTING_STARTED
          })"
        >
          {{ t('widgets.pennylaneIntro.description.links.pennylaneGettingStarted') }}
        </PButton>
      </div>
    </div>

    <div
      class="
        widget-pennylane-intro__right-section
        pennylane-card__right-section
        flex
        flex--align-items-end
        bg--partner-pennylane-dark-green
      "
    >
      <div class="flex">
        <PImage pName="rydge-x-pennylane-transparent" pFit="scale-down" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PButton, PImage, PTag } from '@pulse/styleguide/components'
import { useI18n } from 'vue-i18n'
import {
  PENNYLANE_ACTIVATION_AND_CONNECTION_HELP_URL,
  PENNYLANE_IMPORT_INVOICE_HELP_URL,
  PENNYLANE_MOBILE_APP_URL,
  PENNYLANE_GETTING_STARTED_URL,
  PENNYLANE_FREE_CLASS_SESSION_URL,
} from '@pulse/common/constants'
import { widgetClick } from '@pulse/widgets/utils'
import { WidgetItemClicked, WidgetName } from '@pulse/widgets/enums'
import { AmplitudeEvent, AmplitudeFeatureName } from '@pulse/common/enums'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'global',
})
</script>
<style lang="scss">
@use '@pulse/styleguide/scss/breakpoints' as breakpoints;

.widget-pennylane-intro {
  &__left-section {
    padding-right: 0 !important;
    @include breakpoints.media(md2) {
        padding: 1.6rem !important;
    }
  }

  &__header {
    width: max-content;
    border-radius: 4px;

    .intro-header-text {
      line-height: 1;
    }
  }

  &__title {
    width: 74%;
    font-size: 2.4rem;
    font-weight: 600;

    @include breakpoints.media(md2) {
        width: 90%;
    }
  }

  &__description {
    width: 100%;
    @include breakpoints.media(md2) {
        width: 100%;
    }
    @include breakpoints.media(md2) {
        width: 95%;
    }
  }

  &__list {
    list-style-position: inside;
    list-style-type: disc;

    li {
      line-height: 140%;
      margin: 0.8rem 0;
    }
  }

  &__right-section {
    flex-basis: 30%;
    position: relative;
    overflow: hidden;

    @include breakpoints.media(lg) {
        flex-basis: 40%;
    }

    // specific breakpoint for this usecase
    @media only screen and (width <= 1880px) {
      flex-basis: 33%;
    }

    @include breakpoints.media(md2) {
        flex-basis: 60%;
    }

    @include breakpoints.media(md) {
        flex-basis: 63%;
    }
  }
}
</style>
