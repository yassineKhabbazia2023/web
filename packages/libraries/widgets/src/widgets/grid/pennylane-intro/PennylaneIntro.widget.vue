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
          pEffect="dark"
          pColor="persian"
          :pContent="t('header.new')"
          pIconLeftName="stars"
          pRound
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

      <div class="widget-pennylane-intro__title margin-top--4">
        <i18n-t
          class="text-color--black-rock-900"
          keypath="title.revolutionizingSoftware"
        >
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
        >
          {{ t('description.links.pennylaneGettingStarted') }}
        </PButton>
      </div>
    </div>

    <div
      class="
        widget-pennylane-intro__right-section
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
} from '@pulse/core'
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

    &::before {
      content: '';
      position: absolute;
      left: -28px;
      top: 0;
      // This is the size of the base64 asset
      width: 49px;
      height: 719px;
      // Separator sprite, this is the best way to easily achieve this
      background-image: url('data:image/png;base64,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')
    }

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
      toolChange: "Tool change for {accountingTool}"
      accounting: "accounting production"
    title:
      pennylane: "Pennylane"
      revolutionizingSoftware: "{softwareName}, the software revolutionizing accounting"
    description:
      partnerChange: "RYDGE Conseil is switching partners for {accountingManagement}!"
      accountingManagement: "its accounting management"
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
      toolChange: "Changement d'outil de {accountingTool}"
      accounting: 'production comptable'
    title:
      pennylane: 'Pennylane'
      revolutionizingSoftware: '{softwareName}, le logiciel qui révolutionne la comptabilité'
    description:
      partnerChange: 'RYDGE Conseil change de partenaire pour la {accountingManagement} !'
      accountingManagement: 'gestion de sa comptabilité'
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
