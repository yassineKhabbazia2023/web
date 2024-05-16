<template>
  <div class="client-home">
    <header class="client-home__header padding-bottom--4 flex flex--align-items-center">
      <PAvatar
        pShape="circle"
        pType="small"
        pColor="orange"
      >
        <PIcon>
          <PIPulse />
        </PIcon>
      </PAvatar>
      <h2 class="h4 margin-left--2">
        {{ entityName }}
      </h2>
      <div class="client-home__header-separator margin-x--3 bg--neutral-gray-100"></div>
      <p class="text-color--neutral-gray-500">
        {{ entityIBS }}
      </p>
    </header>
    <PRow :pGutter="24">
      <PCol
        :pSpan="24"
        :pMd="16"
        :pLg="18">
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
                <div class="client-home__button">
                  <PButton
                    pType="primary"
                    pSize="default"
                    tag="a"
                    href="https://forms.office.com/e/zMP0Ectm8P"
                    target="_blank"
                  >
                    {{ t('joinClub') }}
                    <PIcon class="el-button__icon--right">
                      <PIArrowRight />
                    </PIcon>
                  </PButton>
                </div>
              </div>
            </PCol>
            <PCol :pSpan="24" :pMd="12">
              <div class="flex flex--direction-column flex--justify-content-center flex--align-items-center height-100">
                <PImage
                  class="client-home__img"
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
        <div class="padding--6 client-home__mobile height-100 bg--secondary-cyan-bg radius--2">
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
              <ul class="text-color--neutral-gray-700 list-style-none client-home__mobile-list">
                <li class="margin-bottom--2 flex flex--align-items-center font-small">
                  <PIcon
                    :size="16"
                    color="#194DB4"
                    class="margin-right--2">
                    <PICheck />
                  </PIcon>
                  {{ t('gedMobile') }}
                </li>
                <li class="margin-bottom--2 flex flex--align-items-center font-small">
                  <PIcon
                    :size="16"
                    color="#194DB4"
                    class="margin-right--2">
                    <PICheck />
                  </PIcon>
                  {{ t('notifMobile') }}
                </li>
                <li class="margin-bottom--2 flex flex--align-items-center font-small">
                  <PIcon
                    :size="16"
                    color="#194DB4"
                    class="margin-right--2">
                    <PICheck />
                  </PIcon>
                  {{ t('perfMobile') }}
                </li>
                <li class="flex flex--align-items-center font-small">
                  <PIcon
                    :size="16"
                    color="#194DB4"
                    class="margin-right--2">
                    <PICheck />
                  </PIcon>
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
                  <div class="client-home__qrcode client-home__qrcode--left">
                    <figure class="text-center">
                      <PImage
                        class="client-home__qrcode margin-bottom--2"
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
                  <div class="client-home__qrcode client-home__qrcode--right">
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
import { ref } from 'vue'
import {
  PAvatar,
  PButton,
  PCol,
  PIArrowRight,
  PICheck,
  PIcon,
  PImage,
  PIPulse,
  PRow,
} from '@kpmg/styleguide'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})
const entityName = ref('Épicerie Bio&Bon')
const entityIBS = ref('70006470886')

</script>

<style lang="scss" scoped>
.height-100 {
  @media screen and (min-width: 992px) {
    height: 100%;
  }
}
.client-home {
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
    namePlateform: 'KPMG Pulse'
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
  fr-FR:
    titleWelcome: 'Bienvenue sur votre nouvelle plateforme'
    namePlateform: 'KPMG Pulse'
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
</i18n>
