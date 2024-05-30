<template>
  <div class="wrapper">
    <main class="card margin-bottom--6">
      <PRow>
        <PCol
          :pXs="24"
          :pSm="24"
          :pMd="12"
          class="content"
        >
          <PImage
            pType="logos"
            pName="pulse-color"
            class="pulse-logo-content"
            alt="KPMG Pulse logo"
          />
          <router-view />
        </PCol>

        <PCol
          :pXs="0"
          :pSm="0"
          :pMd="12"
          class="illustration-wrapper"
        >
          <PCarousel
            :pItems="carouselData"
            :pInterval="3300"
            pArrow="never"
            pHeight="600px"
            class="carousel"
          />
        </PCol>
      </PRow>
    </main>

    <footer class="footer">
      <div class="footer__legal-links margin-bottom--4">
        <LegalLinks />
      </div>

      <p class="support">
        {{ t('contactSupport') }}
        <span class="link">{{ t('phoneNumber') }}</span>
        {{ t('emailLabel') }}
        <a href="mailto:relation-client@kpmg.fr" class="link">{{ t('SAVEmail') }}</a>
      </p>
      <p>
        <a
          class="link"
          @click.prevent="handleCopyrightLink"
          href=""
          data-testid="login-collab-copyright-link"
        >
          {{ t('copyright') }}
        </a>
      </p>
    </footer>

    <PImage
      pType="logos"
      pName="kpmg-color"
      class="logo-footer hidden-sm-and-down"
      alt="KPMG logo"
    />

    <PDrawer
      v-model="isCopyrightDrawerOpened"
      pTitle="Copyright"
      @close-drawer-button="handleCloseDrawer"
      data-testid="login-collab-copyright-drawer"
    >
      <p class="drawerContent">
        {{ t('copyrightContent') }}
      </p>
      <template #footer>
        <PButton
          @click="handleCloseDrawer"
          pType="primary"
        >
          {{ t('close') }}
        </PButton>
      </template>
    </PDrawer>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PButton, PCol, PDrawer, PCarousel, PRow, PImage } from '@kpmg/styleguide'
import { useFooterLink } from '@/composables/useFooterLink'
import LegalLinks from '@/components/LegalLinks'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const {
  handleCopyrightLink,
  isCopyrightDrawerOpened,
  handleCloseDrawer,
} = useFooterLink()

const carouselData = [
  {
    pText: t('carouselItem1'),
    pImageName: 'mirror-smartphone',
    pImageType: 'paupulse',
  },
  {
    pText: t('carouselItem2'),
    pImageType: 'paupulse',
    pImageName: 'bank-mandate',
  },
  {
    pText: t('carouselItem3'),
    pImageType: 'paupulse',
    pImageName: 'shared-document',
  },
]
</script>

<style lang="scss" scoped>
.link {
  color: var(--el-color-primary);
  font-style: italic;
}
.wrapper {
  position: relative;
  padding: 2.4rem 1.6rem;
  background: var(--el-color-base-persian-light);
  height: 100vh;
  text-align: center;

  @media screen and (max-height: 750px) {
    overflow-y: scroll;
  }
  @media (min-width: 992px) {
    background: var(--el-color-base-persian-light)
      url('../Login/images/icon-pulse-bg.svg') no-repeat right;
    padding-top: 10vh;
  }
  @media (min-height: 1028px) {
    background-size: contain;
  }
}

.card {
  @media (min-width: 992px) {
    max-width: 920px;
    margin: auto;
    padding: 0;
    filter: drop-shadow(0px 24px 50px rgba(112, 144, 176, 0.20))
      drop-shadow(0px 8px 8px rgba(112, 144, 176, 0.05))
      drop-shadow(0px 4px 4px rgba(112, 144, 176, 0.08))
      drop-shadow(0px 2px 2px rgba(112, 144, 176, 0.05))
      drop-shadow(0px 2px 1px rgba(112, 144, 176, 0.10));
  }
  background: var(--el-color-base-white);
  border-radius: 16px;
  padding: 24px 16px;

  .content {
    @media (min-width: 992px) {
      padding: 48px 48px 0;
    }

    .pulse-logo-content {
      @media (min-width: 992px) {
        margin-bottom: 38px;
        max-width: 236px;
      }
      margin-bottom: 24px;
      max-width: 177px;
    }
  }

  .illustration-wrapper {
    text-align: left;

    .illustration {
      position: relative;
      top: 50%;
      left: -4%;
      transform: translateY(-50%);
    }
  }

  .carousel {
    border-top-right-radius: 16px;
    border-bottom-right-radius: 16px;
  }
}

$footer-margin: 24px;
.footer,
.link {
  font-size: 1.2rem;
}
.footer {
  @media (min-width: 992px) and (min-height: 750px) {
    position: absolute;
    left: 0;
    bottom: $footer-margin;
    width: 100%;
  }

  &__legal-links {
    text-align: center;
  }
}

.drawerContent {
  text-align: left;
}

.logo-footer {
  position: absolute;
  right: $footer-margin;
  bottom: $footer-margin;
  width: 100px;
}
</style>

<!-- eslint-disable @intlify/vue-i18n/no-unused-keys no-trailing-spaces -->
<i18n lang="yaml">
  en-US:
    contactSupport: 'Contact support : '
    phoneNumber: '09 73 73 3000'
    emailLabel: ' — email : '
    SAVEmail: "relation-client{'@'}kpmg.fr"
    copyright: "© 2024 KPMG S.A"
    copyrightContent: >-
      © 2024 KPMG S.A., public accounting and auditing company,
      French member of the global KPMG organization made up of independent firms
      affiliated with KPMG International Limited, a company incorporated under English
      law (“private company limited by guarantee”). All rights reserved.
      The KPMG name and logo are trademarks used under license by independent member firms of
      the global KPMG organization. To learn more about the structure of
      the KPMG global organization, visit https://kpmg.com/governance.
    close: 'Close'
    carouselItem1 : >-
      Manage the activation of the various Pulse services
    carouselItem2 : >-
      Create and track your bank mandate requests at a glance!
    carouselItem3 : >-
      Follow the documents shared by your customers on a daily basis.
  fr-FR:
    contactSupport: 'Contact support : '
    phoneNumber: '09 73 73 3000'
    emailLabel: ' — email : '
    SAVEmail: "relation-client{'@'}kpmg.fr"
    copyright: "© 2024 KPMG S.A"
    copyrightContent: >-
      © 2024 KPMG S.A., société anonyme d'expertise comptable et de commissariat aux comptes,
      membre français de l’organisation mondiale KPMG constituée de cabinets indépendants
      affiliés à KPMG International Limited, une société de droit anglais (« private company
      limited by guarantee »). Tous droits réservés. Le nom et le logo KPMG sont des
      marques utilisées sous licence par les cabinets indépendants membres de l’organisation
      mondiale KPMG. Pour en savoir plus sur la structure de l’organisation mondiale KPMG,
      rendez-vous sur la page https://kpmg.com/governance (en anglais).
    close: 'Fermer'
    carouselItem1 : >-
      Pilotez l’activation des différents services Pulse
      et la digitalisation de votre relation client.
    carouselItem2 : >-
      Créez et suivez vos demandes de mandats bancaires en un coup d’oeil !
    carouselItem3 : >-
      Suivez au quotidien les documents partagés par vos clients.
</i18n>
