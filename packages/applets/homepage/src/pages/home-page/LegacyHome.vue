<template>
  <div class="legacy-home-folder">
    <PRow :pGutter="24" class="flex-row-gap--4">
      <PCol
        :pSpan="24"
        :pMd="16"
        class="position--relative"
      >
        <div
          class="
            height-100
            padding--12
            bg--base-blue-pulse
            text-color--base-white
          "
        >
          <PRow :pGutter="0">
            <PCol
              :pSpan="12"
              :pXs="24"
              :pSm="24"
              :pLg="12"
            >
              <h1 class="home-folder__title font-semibold">
                {{ t('homepage.legacy.entityWelcomeTitle') }}
                <span class="text-color--jungle-400">{{ t('homepage.legacy.brandName') }}</span>
              </h1>
            </PCol>
          </PRow>

          <PRow class="margin-top--8">
            <PCol>
              <h2>{{ t('homepage.legacy.welcome') }}</h2>
            </PCol>
          </PRow>

          <PRow class="margin-top--8">
            <PCol
              :pSpan="24"
              :pLg="12"
              :pMd="20"
            >
              <i18n-t
                keypath="homepage.legacy.introductionText"
                tag="p"
                scope="global"
              >
                <template #aboutUrl>
                  <a
                    class="text-underline"
                    :href="ABOUT_URL"
                    target="_blank"
                  >
                    {{ t('homepage.legacy.about') }}
                  </a>
                </template>
              </i18n-t>
            </PCol>
          </PRow>

          <PRow class="margin-top--8">
            <PCol>
              <h2>{{ t('homepage.legacy.secondSection.title') }}</h2>
            </PCol>
          </PRow>

          <PRow class="margin-top--8">
            <PCol
              :pSpan="24"
              :pLg="12"
              :pMd="18"
            >
              <ul class="margin-left--8">
                <li>{{ t('homepage.legacy.secondSection.listItems.first') }}</li>
                <li>
                  <i18n-t
                    keypath="homepage.legacy.secondSection.listItems.second"
                    tag="p"
                    scope="global"
                  >
                    <template #loginUrl>
                      <a
                        class="text-color--jungle-400 text-underline"
                        :href="loginUrl"
                        target="_blank"
                      >
                        {{ loginDisplayUrl }}
                      </a>
                    </template>
                    <template #connexionGuide>
                      <a
                        class="text-underline"
                        :href="CLIENT_HELP_URL"
                        target="_blank"
                      >
                        {{ t('homepage.legacy.secondSection.listItems.connexionGuide') }}
                      </a>
                    </template>
                  </i18n-t>
                </li>
              </ul>
            </PCol>
          </PRow>

          <PRow class="margin-top--8">
            <PCol>
              <h2>{{ t('homepage.legacy.thirdSection.title') }}</h2>
            </PCol>
          </PRow>

          <PRow class="margin-top--8">
            <PCol
              :pSpan="24"
              :pLg="16"
              :pMd="20"
            >
              <ul class="margin-left--8">
                <li>{{ t('homepage.legacy.thirdSection.listItems.first') }}</li>
                <li>{{ t('homepage.legacy.thirdSection.listItems.second') }}</li>
                <li>{{ t('homepage.legacy.thirdSection.listItems.third') }}</li>
                <li>{{ t('homepage.legacy.thirdSection.listItems.fourth') }}</li>
              </ul>
            </PCol>
          </PRow>

          <PRow class="margin-top--8">
            <PCol :pSpan="16">
              <p class="font-bold">
                {{ t('homepage.legacy.greetings.message') }}<br>
                {{ t('homepage.legacy.greetings.signature') }}
              </p>
            </PCol>
          </PRow>
        </div>

        <div class="home-folder__background position--absolute hidden-sm-and-down">
          <PImage pName="road_with_brand_shape" pFit="contain" />
        </div>
      </PCol>

      <PCol
        :pSpan="24"
        :pMd="8"
      >
        <div
          class="
            home-folder__mobile
            height-100
            bg--jungle-50
            padding-top--6
            padding-left--6
            padding-right--6
          "
        >
          <PRow class="height-100">
            <PCol>
              <PRow>
                <PCol
                  :pSpan="24"
                  :pSM="12"
                  :pMd="24"
                >
                  <p
                    class="
                  font-xsmall
                  text-uppercase
                  font-bold
                  text-color--jungle-400
                "
                  >
                    {{ t('homepage.legacy.mobileApp') }}
                  </p>
                </PCol>
              </PRow>

              <PRow class="margin-top--2">
                <PCol>
                  <h3 class="font-semibold font-large text-color--base-blue-pulse">
                    {{ t('homepage.legacy.titleMobileApp') }}
                  </h3>
                </PCol>
              </PRow>

              <PRow class="margin-top--5">
                <PCol>
                  <p class="font-normal font-large text-underline text-color--base-blue-pulse">
                    <a :href="MOBILE_APPLICATION_DOCUMENTATION_URL" target="_blank">
                      {{ t('homepage.legacy.downloadTutorial') }}
                    </a>
                  </p>
                </PCol>
              </PRow>

              <PRow
                class="margin-top--5"
                :pGutter="24"
                pJustify="center"
              >
                <PCol
                  :pSpan="6"
                  :pMd="8"
                  :pLg="6"
                >
                  <div class="home-folder__qrcode home-folder__qrcode--left">
                    <figure class="text-center">
                      <PImage
                        class="home-folder__qrcode margin-bottom--2"
                        pType="qrcode"
                        pName="ios"
                        pFit="fill"
                      />
                      <figcaption class="font-small font-semibold text-color--neutral-gray-700">
                        {{ t('homepage.legacy.ios') }}
                      </figcaption>
                    </figure>
                  </div>
                </PCol>

                <PCol
                  :pSpan="6"
                  :pMd="8"
                  :pLg="6"
                >
                  <div class="home-folder__qrcode home-folder__qrcode--right">
                    <figure class="text-center">
                      <PImage
                        class="margin-bottom--2"
                        pType="qrcode"
                        pName="android"
                        pFit="fill"
                      />
                      <figcaption class="font-small font-semibold text-color--neutral-gray-700">
                        {{ t('homepage.legacy.android') }}
                      </figcaption>
                    </figure>
                  </div>
                </PCol>
              </PRow>

              <PRow class="margin-y--5">
                <PCol>
                  <ul class="text-color--neutral-gray-700 list-style-none home-folder__mobile-list">
                    <li class="margin-bottom--2 flex flex--align-items-center font-small">
                      <PIcon
                        :size="16"
                        :color="AppColors.PRIMARY"
                        class="margin-right--2"
                        pName="check"
                      />
                      {{ t('homepage.legacy.mobileListItems.first') }}
                    </li>
                    <li class="margin-bottom--2 flex flex--align-items-center font-small">
                      <PIcon
                        :size="16"
                        :color="AppColors.PRIMARY"
                        class="margin-right--2"
                        pName="check"
                      />
                      {{ t('homepage.legacy.mobileListItems.second') }}
                    </li>
                    <li class="margin-bottom--2 flex flex--align-items-center font-small">
                      <PIcon
                        :size="16"
                        :color="AppColors.PRIMARY"
                        class="margin-right--2"
                        pName="check"
                      />
                      {{ t('homepage.legacy.mobileListItems.third') }}
                    </li>
                    <li class="flex flex--align-items-center font-small">
                      <PIcon
                        :size="16"
                        :color="AppColors.PRIMARY"
                        class="margin-right--2"
                        pName="check"
                      />
                      {{ t('homepage.legacy.mobileListItems.fourth') }}
                    </li>
                  </ul>
                </PCol>
              </PRow>
            </PCol>
            <PCol class="home-folder__phone-section">
              <PRow pAlign="bottom">
                <PCol>
                  <div class="flex">
                    <PImage pName="phones_with_app" />
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
import {
  PCol,
  PIcon,
  PImage,
  PRow,
} from '@pulse/styleguide/components'
import { AppColors } from '@pulse/styleguide'
import {
  ABOUT_URL,
  APP_URL,
  CLIENT_HELP_URL,
  HOST_NAME,
  MOBILE_APPLICATION_DOCUMENTATION_URL,
} from '@pulse/common/constants'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'global',
})

const loginUrl = `${APP_URL}login`
const loginDisplayUrl = `${HOST_NAME}/login`

</script>

<style lang="scss" scoped>
.height-100 {
  @media screen and (min-width: 992px) {
    height: 100%;
  }
}
.home-folder {

  &__title {
    font-size: 2.6rem;
  }

  h2 {
    font-size: 1.8rem;
    font-weight: 500;
  }

  &__background {
    height: 80%;
    bottom: 0;
    right: 12px;

    > div {
      height: 100%;
    }

    @media screen and (max-width: 1363px) {
      height: 60%;
    }
    @media screen and (max-width: 1200px) {
      height: 45%;
    }
  }

  &__phone-section {
    align-content: end;
  }
}
</style>
