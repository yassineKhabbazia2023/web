<template>
  <ul
    class="legal-links list-style-none flex--align-items-center flex--wrap"
  >
    <li class="legal-links__item flex flex--align-items-center">
      <a
        class="legal-links__link"
        href="https://kpmg.com/fr/fr/home/misc/legal.html"
        target="_blank"
        rel="noopener"
      >
        {{ t('legalNotice') }}
      </a>
    </li>
    <li class="legal-links__item flex flex--align-items-center">
      <button
        class="legal-links__link"
        @click="drawerNotices.openDrawer = !drawerNotices.openDrawer"
        data-testid="legal-links-notices"
      >
        {{ t('cookiesNotices') }}
      </button>
    </li>
    <li class="legal-links__item flex flex--align-items-center">
      <!-- OneTrust Cookies Settings button start -->
      <button
        id="ot-sdk-btn"
        class="legal-links__link ot-sdk-show-settingbutton is"
      >
        {{ t('cookiesParameters') }}
      </button>
      <!-- OneTrust Cookies Settings button end -->
    </li>
    <!-- Miss link -->
    <li class="legal-links__item flex flex--align-items-center">
      <a
        class="legal-links__link"
        :href="urlTerms"
        target="_blank"
        rel="noopener"
      >
        {{ t('CGU') }}
      </a>
    </li>
    <li class="legal-links__item flex flex--align-items-center">
      <a
        class="legal-links__link"
        href="https://kpmg.com/fr/fr/home/misc/confidentialite-gestion-donnees.html"
        target="_blank"
        rel="noopener"
      >
        {{ t('privacyPolicy') }}
      </a>
    </li>
  </ul>
  <PDrawer
    v-model="drawerNotices.openDrawer"
    @close-drawer-button="drawerNotices.openDrawer = false"
    :pTitle="t('cookiesNotices')"
  >
    <!-- OneTrust Cookies List start -->
    <div id="ot-sdk-cookie-policy"></div>
    <!-- OneTrust Cookies List end -->

    <template #footer>
      <PButton
        @click="drawerNotices.openDrawer = false"
        pType="primary"
      >
        {{ t('close') }}
      </PButton>
    </template>
  </PDrawer>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { reactive, ref, onMounted } from 'vue'
import { PButton, PDrawer } from '@kpmg/styleguide'
import { fetchUrlTerms } from '@kpmg/common'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const drawerNotices = reactive({
  openDrawer: false,
})
const urlTerms = ref()
onMounted(async () => {
  urlTerms.value = await fetchUrlTerms()
})
</script>

<style lang="scss" scoped>
.legal-links {
  $self: &;
  display: inline-flex;

  &__item {
    margin-right: 0.4rem;

    &:last-child {
      margin-right: 0;
    }

    & + #{$self}__item {
      &:before {
        content: '•';
        display: inline-block;
        margin-right: 0.4rem;
        color: var(--el-color-primary);
        font-size: 1.2rem;
      }
    }
  }
  &__link {
    color: var(--el-color-primary);
    font-style: italic;
    font-size: 1.2rem;
    background: none;
    appearance: none;
    border: none;
    padding: 0;
    cursor: pointer;

    &:hover,
    &:focus {
      text-decoration: underline
    }
  }
}
</style>

<i18n lang="yaml">
  en-US:
    legalNotice: 'Legal Notice'
    cookiesNotices: 'Cookies notices'
    cookiesParameters: 'Cookies parameters'
    CGU: 'CGU'
    privacyPolicy: 'Privacy Policy'
    close: 'Close'
  fr-FR:
    legalNotice: 'Mentions légales'
    cookiesNotices: 'Notices de cookies'
    cookiesParameters: 'Paramètres de cookies'
    CGU: 'CGU'
    privacyPolicy: 'Politique de confidentialité'
    close: 'Fermer'
</i18n>
