<template>
  <div class="home-folder">
    <header class="home-folder__header padding-bottom--4 flex flex--align-items-center">
      <PAvatar
        pShape="circle"
        pType="small"
        pColor="orange"
      >
        <PIcon pName="pulse" />
      </PAvatar>
      <h2 class="h4 margin-left--2" data-testid="home-folder-name">
        {{ defaultEntity?.legalName }}
      </h2>
      <div class="home-folder__header-separator margin-x--3 bg--neutral-gray-100" />
      <p class="text-color--neutral-gray-500" data-testid="home-folder-account-number">
        {{ defaultEntity?.accountNumber }}
      </p>
    </header>
    <PRow :pGutter="24">
      <PCol
        :pSpan="24"
        :pMd="16"
        :pLg="18"
      >
        <div class="padding--6 shadow--4 radius--2 height-100">
          <PRow :pGutter="24" class="height-100">
            <PCol :pSpan="24" :pMd="12">
              <div class="flex flex--direction-column flex--justify-content-center height-100">
                <h1 class="h2 margin-bottom--4 text-color--neutral-gray-800">
                  {{ t('titleWelcome') }}
                  <span class="text-color--persian-500">
                    {{ t('namePlateform') }}
                  </span>
                </h1>
                <p class="text-color--neutral-gray-700 margin-bottom--4">
                  {{ t('onBuild') }}
                </p>
                <p class="text-color--neutral-gray-700">
                  {{ t('helpUs') }}
                  <span class="font-semibold">{{ t('clubClient') }}</span>
                  {{ t('participationHelp') }}
                </p>
                <div class="home-folder__button">
                  <PTooltip v-if="isCollab" :pContent="t('accessClient')">
                    <PButton
                      pType="primary"
                      pSize="default"
                      pDisabled
                      data-testid="home-folder-button"
                    >
                      {{ t('joinClub') }}
                      <PIcon class="el-button__icon--right" pName="arrowRight" />
                    </PButton>
                  </PTooltip>
                  <PButton
                    v-else
                    pType="primary"
                    pSize="default"
                    tag="a"
                    href="https://forms.office.com/e/zMP0Ectm8P"
                    target="_blank"
                    data-testid="home-folder-button"
                  >
                    {{ t('joinClub') }}
                    <PIcon
                      class="el-button__icon--right"
                      pName="arrowRight"
                      data-testid="join-arrow-right-icon"
                    />
                  </PButton>
                </div>
              </div>
            </PCol>
            <PCol :pSpan="24" :pMd="12">
              <div
                class="flex flex--direction-column
                flex--justify-content-center flex--align-items-center height-100"
              >
                <PImage
                  class="home-folder__img"
                  pType="paupulse"
                  pName="talking"
                  pFit="fill"
                />
              </div>
            </PCol>
          </PRow>
        </div>
      </PCol>
      <PCol
        :pSpan="24"
        :pMd="8"
        :pLg="6"
      >
        <div class="padding--6 home-folder__mobile height-100 bg--secondary-cyan-bg radius--2">
          <PRow>
            <PCol
              :pSpan="24"
              :pSM="12"
              :pMd="24"
            >
              <p
                class="
                  margin-bottom--2
                  font-xsmall text-uppercase
                  text-color--secondary-cyan-txt
                "
              >
                {{ t('mobileApp') }}
              </p>
              <h3 class="font-semibold font-large margin-bottom--4">
                {{ t('titleMobileApp') }}
              </h3>
              <ul class="text-color--neutral-gray-700 list-style-none home-folder__mobile-list">
                <li class="margin-bottom--2 flex flex--align-items-center font-small">
                  <PIcon
                    :size="16"
                    :color="AppColors.SECONDARY_CYAN_TXT"
                    class="margin-right--2"
                    pName="check"
                  />
                  {{ t('gedMobile') }}
                </li>
                <li class="margin-bottom--2 flex flex--align-items-center font-small">
                  <PIcon
                    :size="16"
                    :color="AppColors.SECONDARY_CYAN_TXT"
                    class="margin-right--2"
                    pName="check"
                  />
                  {{ t('notifMobile') }}
                </li>
                <li class="margin-bottom--2 flex flex--align-items-center font-small">
                  <PIcon
                    :size="16"
                    :color="AppColors.SECONDARY_CYAN_TXT"
                    class="margin-right--2"
                    pName="check"
                  />
                  {{ t('perfMobile') }}
                </li>
                <li class="flex flex--align-items-center font-small">
                  <PIcon
                    :size="16"
                    :color="AppColors.SECONDARY_CYAN_TXT"
                    class="margin-right--2"
                    pName="check"
                  />
                  {{ t('socialMobile') }}
                </li>
              </ul>
            </PCol>
            <PCol
              :pSpan="24"
              :pSm="12"
              :pMd="24"
            >
              <PRow :pGutter="24">
                <PCol :pSpan="12">
                  <div class="home-folder__qrcode home-folder__qrcode--left">
                    <figure class="text-center">
                      <PImage
                        class="home-folder__qrcode margin-bottom--2"
                        pType="qrcode"
                        pName="ios"
                        pFit="fill"
                      />
                      <figcaption class="font-small font-semibold text-color--neutral-gray-700">
                        {{ t('ios') }}
                      </figcaption>
                    </figure>
                  </div>
                </PCol>
                <PCol :pSpan="12">
                  <div class="home-folder__qrcode home-folder__qrcode--right">
                    <figure class="text-center">
                      <PImage
                        class="margin-bottom--2"
                        pType="qrcode"
                        pName="android"
                        pFit="fill"
                      />
                      <figcaption class="font-small font-semibold text-color--neutral-gray-700">
                        {{ t('android') }}
                      </figcaption>
                    </figure>
                  </div>
                </PCol>
              </PRow>
            </PCol>
          </PRow>
        </div>
      </PCol>
    </PRow>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import {
  PAvatar,
  PButton,
  PCol,
  PIcon,
  PImage,
  PRow,
  PTooltip,
} from '@pulse/styleguide/components'
import { AppColors } from '@pulse/styleguide'
import { commonStore } from '@pulse/common'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const { defaultEntity, isCollab } = storeToRefs(commonStore())
</script>

<style lang="scss" scoped>
.height-100 {
  @media screen and (min-width: 992px) {
    height: 100%;
  }
}
.home-folder {
  &__header-separator {
    width: 1px;
    height: 12px;
  }
  &__button {
    margin-top: 4rem;
  }
  &__img {
    max-width: 400px;

    @media screen and (max-width: 992px) {
      margin-top: 4rem;
    }
  }
  &__mobile {
    @media screen and (max-width: 992px) {
      margin-top: 2.4rem;
    }
  }
  &__mobile-list {
    @media screen and (max-width: 768px) {
      margin-bottom: 4rem;
    }
    @media screen and (min-width: 992px) {
      margin-bottom: 4rem;
    }
  }
  &__qrcode {
    max-width: 120px;
    width: 100%;

    &--left {
      margin: 0 0 0 auto;
    }

    &--right {
      margin: 0 auto 0 0;
    }

    @media screen and (min-width: 992px) {
      max-width: none;
    }
  }
}
</style>

<i18n lang="yaml">
  en-US:
    titleWelcome: 'Welcome to your new platform'
    namePlateform: 'Pulse'
    onBuild: 'The home page is currently under construction by our teams.'
    helpUs: 'To help us enrich your experience, join the '
    clubClient: 'Pulse Customer Club'
    participationHelp: 'and take part in improving the platform
      through user tests and individual or group exchanges.'
    joinClub: 'Join Club Pulse'
    mobileApp: 'Mobile application'
    titleMobileApp: 'Control your business from your pocket!'
    gedMobile: 'Consult, scan and deliver your documents to your expert'
    notifMobile: 'Be notified and track the history of filed documents'
    perfMobile: "Track your company's performance"
    socialMobile: "Enter your employees' pay variables"
    ios: 'iOS'
    android: 'Android'
    accessClient: 'This feature is only accessible to your customer'
  fr-FR:
    titleWelcome: 'Bienvenue sur votre nouvelle plateforme'
    namePlateform: 'Pulse'
    onBuild: "La page d'accueil est en cours de construction par nos équipes."
    helpUs: 'Pour nous aider à enrichir votre expérience, rejoignez-le '
    clubClient: 'Club Client Pulse'
    participationHelp: "et participez à l'amélioration de la plateforme
      via des tests utilisateurs et des échanges individuels ou en groupe."
    joinClub: 'Rejoindre le Club Pulse'
    mobileApp: 'Application mobile'
    titleMobileApp: 'Pilotez votre activité depuis votre poche !'
    gedMobile: 'Consultez, scannez et déposez vos documents à votre expert'
    notifMobile: "Soyez notifié et suivez l'historique des documents déposés"
    perfMobile: 'Suivez les performances de votre entreprise'
    socialMobile: 'Saisissez les variables de paie de vos salariés'
    ios: 'iOS'
    android: 'Android'
    accessClient: "Cette fonctionnalité n'est accessible que par votre client"
</i18n>
