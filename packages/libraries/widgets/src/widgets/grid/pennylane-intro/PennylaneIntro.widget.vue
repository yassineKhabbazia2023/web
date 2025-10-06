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
          :pContent="t('header.new')"
          pIconLeftName="stars"
        />
        <i18n-t
          class="
            intro-header-text
            padding-left--2
            font-small
          "
          keypath="header.toolChange"
          tag="span"
        >
          <template #accountingTool>
            <span class="font-bold">{{ t('header.accounting') }}</span>
          </template>
        </i18n-t>
      </div>

      <div class="widget-pennylane-intro__title margin-top--4 font-bold">
        <i18n-t keypath="title.revolutionizingSoftware">
          <template #brand>
            <span class="text-color--secondary-amethyste">{{ t('title.brand') }}</span>
          </template>
          <template #softwareName>
            <span class="text-color--secondary-amethyste">{{ t('title.pennylane') }}</span>
          </template>
        </i18n-t>
      </div>

      <div class="widget-pennylane-intro__description margin-top--4">
        <i18n-t keypath="description.partnerChange" tag="p">
          <template #accountingManagement>
            <span class="font-bold">{{ t('description.accountingManagement') }}</span>
          </template>
        </i18n-t>

        <i18n-t
          class="margin-top--4"
          keypath="description.newProcedure"
          tag="p"
        >
          <template #accountingDocumentsDeposit>
            <span class="font-bold">{{ t('description.accountingDocumentsDeposit') }}</span>
          </template>
        </i18n-t>

        <ul class="widget-pennylane-intro__list margin-top--4 margin-left--4 padding--0">
          <i18n-t keypath="description.links.pennylaneConnection" tag="li">
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
                {{ t('description.links.pennylaneFromRydge') }}
              </a>
            </template>
          </i18n-t>

          <i18n-t keypath="description.links.invoiceDeposit" tag="li">
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
                {{ t('description.links.pennylanePlatform') }}
              </a>
            </template>
          </i18n-t>

          <i18n-t keypath="description.links.discover" tag="li">
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
                {{ t('description.links.pennylaneAppDiscovery') }}
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
          {{ t('description.links.pennylaneGettingStarted') }}
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
} from '@pulse/common/constants'
import { widgetClick } from '@pulse/widgets/utils'
import { WidgetItemClicked, WidgetName } from '@pulse/widgets/enums'
import { AmplitudeEvent, AmplitudeFeatureName } from '@pulse/common/enums'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})
</script>
<style lang="scss">
@use '../../../utils/breakpoints';

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

<i18n lang="yaml">
  en-US:
    header:
      new: "New"
      toolChange: "Change of {accountingTool}"
      accounting: "management tool"
    title:
      brand: 'RYDGE Conseil'
      pennylane: "Pennylane"
      revolutionizingSoftware: "{brand} combines its expertise with {softwareName}"
    description:
      partnerChange: "Your new partner in daily {accountingManagement}!"
      accountingManagement: "managing your activities"
      newProcedure: "This change introduces a new procedure for {accountingDocumentsDeposit}:"
      accountingDocumentsDeposit: "submitting your accounting documents"
      links:
        pennylaneConnection: "Log in to {pennylaneFromRydge}"
        pennylaneFromRydge: "Pennylane via the RYDGE Conseil platform"
        invoiceDeposit: "Upload your invoices from {pennylanePlatform}"
        pennylanePlatform: "the Pennylane platform"
        discover: "Discover {pennylaneAppDiscovery}"
        pennylaneAppDiscovery: "the Pennylane mobile app"
        pennylaneGettingStarted: 'Getting started on Pennylane'
  fr-FR:
    header:
      new: 'Nouveau'
      toolChange: "Changement d'{accountingTool}"
      accounting: 'outil de gestion'
    title:
      brand: 'RYDGE Conseil'
      pennylane: 'Pennylane'
      revolutionizingSoftware: '{brand} allie son expertise à {softwareName}'
    description:
      partnerChange: 'Votre nouveau partenaire dans la {accountingManagement} au quotidien !'
      accountingManagement: 'gestion de vos activités'
      newProcedure: 'Ce changement implique une nouvelle procédure pour le {accountingDocumentsDeposit} :'
      accountingDocumentsDeposit: 'dépôt de vos pièces comptables'
      links:
        pennylaneConnection: 'Se connecter à {pennylaneFromRydge}'
        pennylaneFromRydge: 'Pennylane depuis la plateforme RYDGE Conseil'
        invoiceDeposit: 'Déposer ses factures depuis {pennylanePlatform}'
        pennylanePlatform: 'la plateforme Pennylane'
        discover: 'Découvrir {pennylaneAppDiscovery}'
        pennylaneAppDiscovery: "l'application mobile Pennylane"
        pennylaneGettingStarted: 'Bien débuter sur Pennylane'
</i18n>
