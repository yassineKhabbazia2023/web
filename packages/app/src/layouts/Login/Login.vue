<template>
  <div class="wrapper">
    <main
      class="
      card
      margin-bottom--6"
    >
      <PRow>
        <PCol
          :pXs="24"
          :pSm="24"
          :pMd="12"
          class="content"
        >
          <PImage
            pType="logos"
            pName="brand-color"
            class="brand-logo-content"
            alt="Brand logo"
          />
          <router-view />
        </PCol>

        <PCol
          :pXs="0"
          :pXm="0"
          :pMd="12"
        >
          <PImage
            class="login-page-image hidden-sm-and-down"
            pName="login-page-client"
            pFit="cover"
          />
        </PCol>
      </PRow>
    </main>

    <footer class="footer">
      <div class="footer__legal-links margin-bottom--4">
        <LegalLinks dark />
      </div>
      <div class="footer__support">
        <SupportInfo />
      </div>
    </footer>

    <PImage
      pType="logos"
      pName="brand-white"
      class="logo-footer hidden-sm-and-down"
      alt="Brand logo"
    />
  </div>
</template>

<script setup lang="ts">
import { PCol, PImage, PRow } from '@pulse/styleguide/components'
import LegalLinks from '@app/components/LegalLinks'
import SupportInfo from '@app/components/SupportInfo'
import { onMounted } from 'vue'

onMounted(() => {
  localStorage.removeItem('selected-entity')
})

</script>

<style lang="scss" scoped>
.wrapper {
  position: relative;
  padding: 2.4rem 1.6rem;
  background: var(--el-color-base-blue-pulse);
  height: 100vh;
  text-align: center;

  @media screen and (max-height: 700px) {
    overflow-y: scroll;
  }
  @media (min-width: 992px) {
    padding-top: 10vh;
  }
}

.card {
  @media (min-width: 992px) {
    max-width: 920px;
    margin: 0 auto;
  }
  background: var(--el-color-base-white);

  .content {
    @media (min-width: 992px) {
      padding: 4.8rem 4.8rem 0 4.8rem;
    }
    @media (max-width: 991px) {
      padding: 2.4rem 1.6rem 0 1.6rem;
    }

    .brand-logo-content {
      @media (min-width: 992px) {
        max-width: 129px;
      }
      max-width: 140px;
    }
  }
}

$footer-margin: 24px;
.footer {
  color: var(--el-color-white);
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

.login-page-image {
  display: inherit;
}
</style>
