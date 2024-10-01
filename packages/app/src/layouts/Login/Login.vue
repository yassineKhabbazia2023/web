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
          :pXm="0"
          :pMd="12"
          class="illustration-wrapper"
        >
          <PImage
            pType="paupulse"
            :pName="illustration"
            class="illustration"
          />
        </PCol>
      </PRow>
    </main>

    <footer class="footer">
      <div class="footer__legal-links margin-bottom--4">
        <LegalLinks />
      </div>
      <div class="footer__support">
        <SupportInfo />
      </div>
    </footer>

    <PImage
      pType="logos"
      pName="kpmg-color"
      class="logo-footer hidden-sm-and-down"
      alt="KPMG logo"
    />
  </div>
</template>

<script setup lang="ts">
import { PCol, PImage, PRow } from '@pulse/styleguide'
import LegalLinks from '@app/components/LegalLinks'
import SupportInfo from '@app/components/SupportInfo'
import { type LoginLayoutProps } from '@app/layouts/Login/LoginTypes'
import { onMounted } from 'vue'

withDefaults(defineProps<LoginLayoutProps>(), {
  illustration: 'connection-default',
})

onMounted(() => {
  localStorage.removeItem('selected-entity')
})

</script>

<style lang="scss" scoped>
.wrapper {
  position: relative;
  padding: 2.4rem 1.6rem;
  background: var(--el-color-base-persian-light);
  height: 100vh;
  text-align: center;

  @media screen and (max-height: 700px) {
    overflow-y: scroll;
  }
  @media (min-width: 992px) {
    background: var(--el-color-base-persian-light)
      url('./images/icon-pulse-bg.svg') no-repeat right;
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
      padding: 4.8rem;
    }

    .pulse-logo-content {
      @media (min-width: 992px) {
        max-width: 236px;
      }
      margin-bottom: 24px;
      max-width: 177px;
    }
  }

  .illustration-wrapper {
    background: linear-gradient(
      90deg,
      var(--el-color-primary) 0%,
      var(--el-color-secondary-amethyste) 100%
    );
    text-align: left;
    border-top-right-radius: 16px;
    border-bottom-right-radius: 16px;

    .illustration {
      position: relative;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 70%;
    }
  }
}

$footer-margin: 24px;
.footer {
  @media (min-width: 992px) and (min-height: 700px) {
    position: absolute;
    left: 0;
    bottom: $footer-margin;
    width: 100%;
  }
  &__legal-links,
  &__support {
    text-align: center;
  }
}

.logo-footer {
  position: absolute;
  right: $footer-margin;
  bottom: $footer-margin;
  width: 100px;
}
</style>
