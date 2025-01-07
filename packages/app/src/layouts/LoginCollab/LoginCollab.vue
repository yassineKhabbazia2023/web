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
          <a
            :href="OFFICIAL_WEBSITE_URL"
            rel="noopener"
            target="_blank"
            data-testid="login-brand-link"
          >
            <PImage
              pType="logos"
              pName="brand-color"
              class="brand-logo-content"
              alt="Brand logo"
            />
          </a>
          <router-view />
        </PCol>

        <PCol
          :pXs="0"
          :pXm="0"
          :pMd="12"
        >
          <PImage
            class="login-page-image hidden-sm-and-down"
            pName="login-page-collab"
            pFit="cover"
          />
        </PCol>
      </PRow>
    </main>

    <footer class="footer" data-testid="login-collab-footer">
      <div class="footer__legal-links margin-bottom--4">
        <LegalLinks dark />
      </div>
      <div class="footer__support">
        <SupportInfoCollab />
      </div>

      <PImage
        pType="logos"
        pName="brand-white"
        class="logo-footer hidden-sm-and-down"
        alt="Brand logo"
      />
    </footer>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import { PCol, PRow, PImage } from '@pulse/styleguide/components'
import LegalLinks from '@app/components/LegalLinks'
import SupportInfoCollab from '@app/components/SupportInfoCollab'
import { OFFICIAL_WEBSITE_URL } from '@pulse/core'
import { initProductFruits, stopProductFruits } from '@app/plugins/ProductFruits/productFruits.plugin'
import { VITE_PRODUCT_FRUITS_ANONYMOUS_KEY } from 'env-vars'

onMounted(() => {
  localStorage.removeItem('selected-entity')

  initProductFruits({
    lang: 'fr',
    key: VITE_PRODUCT_FRUITS_ANONYMOUS_KEY,
  })
})

onBeforeUnmount(() => {
  stopProductFruits()
})
</script>

<style lang="scss" scoped>
.wrapper {
  padding: 2.4rem 1.6rem;
  background: var(--el-color-base-blue-pulse);
  height: 100vh;
  text-align: center;
  overflow: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

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
      padding: 48px 48px 0;
    }
    @media (max-width: 991px) {
      padding: 2.4rem 1.6rem 0 1.6rem;
    }

    .brand-logo-content {
      @media (min-width: 992px) {
        margin-bottom: 38px;
        max-width: 129px;
      }
      margin-bottom: 24px;
      max-width: 140px;
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
}

$footer-margin: 24px;
.footer {
  position: relative;
  color: var(--el-color-white);

  &__legal-links {
    text-align: center;
  }
}

.logo-footer {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 100px;
}

.login-page-image {
  display: inherit;
}
</style>
