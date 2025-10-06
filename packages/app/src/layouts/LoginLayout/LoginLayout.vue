<template>
  <div class="wrapper">
    <main
      class="card margin-bottom--6"
      :class="{
        'card--collab': isCollabPage,
      }"
    >
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
            :pName="imageName"
            pFit="cover"
          />
        </PCol>
      </PRow>
    </main>

    <footer class="footer" data-testid="login-footer">
      <div class="footer__legal-links margin-bottom--4">
        <LegalLinks
          :hasCgu="legalLinksHasCgu"
          class="margin-top--4 font-small"
          dark
        />
      </div>
      <div class="footer__support">
        <SupportInfoCollab
          v-if="isCollabPage"
        />
        <SupportInfo
          v-else
        />
      </div>

      <PImage
        pType="logos"
        pName="brand-white"
        class="logo-footer hidden-sm-and-down"
        alt="Brand logo"
      />
    </footer>

    <!-- Session expired information modal -->
    <SessionExpiredModal
      v-if="showSessionExpiredModal === true"
      v-model:visible="showSessionExpiredModal"
      @close="removeSessionExpiredQuery"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { PCol, PImage, PRow } from '@pulse/styleguide/components'
import LegalLinks from '@app/components/LegalLinks'
import SupportInfo from '@app/components/SupportInfo'
import { OFFICIAL_WEBSITE_URL, APP_ROUTES } from '@pulse/common/constants'

import SupportInfoCollab from '@app/components/SupportInfoCollab'
import SessionExpiredModal from './SessionExpired.modal.vue'

const route = useRoute()
const router = useRouter()
const isCollabPage = computed(() => route.name === APP_ROUTES.login.collab.name)
const imageName = computed(() => isCollabPage.value ? 'login-page-collab' : 'login-page-client')

const legalLinksHasCgu = computed(() => {
  return route.name !== APP_ROUTES.login.collab.name
})

// #region session expired modal
const showSessionExpiredModal = ref(false)

watch(
  () => route.query.sessionExpired,
  (newValue) => {
    showSessionExpiredModal.value = newValue === 'true'
  },
  { immediate: true },
)

const removeSessionExpiredQuery = () => {
  const { sessionExpired, ...otherQueries } = route.query
  router.replace({
    query: otherQueries, // preserve other query params
  })
}
// #endregion
</script>

<style lang="scss" scoped>
.wrapper {
  padding: 2.4rem 1.6rem;
  background: var(--p-black-rock-900);
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
  background: var(--p-white);

  @media (min-width: 992px) {
    max-width: 920px;
    margin: 0 auto;
  }
  .content {
    @media (min-width: 992px) {
      padding: 4.8rem 4.8rem 0 4.8rem;
    }
    @media (max-width: 991px) {
      padding: 2.4rem 1.6rem 0 1.6rem;
    }

    .brand-logo-content {
      max-width: 140px;
      @media (min-width: 992px) {
        max-width: 129px;
      }
    }
  }

  &--collab {
    .brand-logo-content {
      margin-bottom: 24px;
      @media (min-width: 992px) {
        margin-bottom: 38px;
      }
    }
  }
}

$footer-margin: 24px;
.footer {
  position: relative;
  color: var(--p-white);
  &__legal-links,
  &__support {
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
