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
          class="content padding-top--10"
        >
          <PImage
            pType="logos"
            pName="brand-color"
            class="pulse-logo-content"
            alt="Pulse logo"
          />
          <router-view />
        </PCol>

        <PCol
          :pXs="0"
          :pXm="0"
          :pMd="12"
          class="illustration-wrapper"
        />
      </PRow>
    </main>

    <footer class="footer">
      <div class="footer__support">
        <SupportInfo />
      </div>
      <div class="footer__legal-links margin-bottom--4">
        <LegalLinks />
      </div>
    </footer>

    <PImage
      pType="logos"
      pName="brand-white"
      class="logo-footer hidden-sm-and-down"
      alt="Pulse logo"
    />
  </div>
</template>

<script setup lang="ts">
import { PCol, PImage, PRow } from '@pulse/styleguide/components'
import LegalLinks from '@app/components/LegalLinks'
import SupportInfo from '@app/components/SupportInfo'
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getIllustration } from './LoginHelper'

const route = useRoute()

const illustration = computed(() => getIllustration(route.name))

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

.illustration-wrapper {
  background-image: url('https://picsum.photos/id/235/448/630.webp');
  background-size: cover;
}

.card {
  @media (min-width: 992px) {
    max-width: 920px;
    margin: 0 auto;
  }
  background: var(--el-color-base-white);

  .content {
    @media (min-width: 992px) {
      padding: 4.8rem;
    }

    .pulse-logo-content {
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
</style>
