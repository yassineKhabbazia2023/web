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
        type="button"
        class="legal-links__link"
        @click="handleClick"
        @click.stop.prevent
        data-testid="legal-links-notices"
      >
        {{ t('cookiesNotices') }}
      </button>
    </li>
    <li class="legal-links__item flex flex--align-items-center">
      <!-- OneTrust Cookies Settings button start -->
      <button
        @click.stop.prevent
        type="button"
        id="ot-sdk-btn"
        class="legal-links__link ot-sdk-show-settings"
      >
        {{ t('cookiesParameters') }}
      </button>
      <!-- OneTrust Cookies Settings button end -->
    </li>
    <li
      v-if="!isCollab && route.name !== 'login'"
      class="legal-links__item flex flex--align-items-center"
      data-testid="legal-links-cgu"
    >
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
  <div
    v-show="drawerVisibility"
    :class="drawerVisibility ? 'open' : 'close'"
    data-testid="cookies-notices-drawer"
  >
    <PDrawer
      modelValue
      @close-drawer-button="drawerVisibility = false"
      :pTitle="t('cookiesNotices')"
      :class="{
        'padding-top--12': isAuthenticated
      }"
      :closeOnClickModal="false"
    >
      <!-- OneTrust Cookies List start -->
      <div id="ot-sdk-cookie-policy"></div>
      <!-- OneTrust Cookies List end -->

      <template #footer>
        <PButton
          @click="drawerVisibility = false"
          pType="primary"
          data-testid="drawer-close-button"
        >
          {{ t('close') }}
        </PButton>
      </template>
    </PDrawer>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import { PButton, PDrawer } from '@pulse/styleguide'
import { commonStore, fetchUrlTerms } from '@pulse/common'
import { ReloadOneTrust } from '@app/plugins/OneTrust'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const { isCollab, isAuthenticated } = storeToRefs(commonStore())
const route = useRoute()

const drawerVisibility = ref(false)

const handleClick = () => {
  drawerVisibility.value = !drawerVisibility.value
  ReloadOneTrust()
}
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
  &__link,
  #ot-sdk-btn.ot-sdk-show-settings,
  #ot-sdk-btn.optanon-show-settings {
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
      text-decoration: underline;
      background: none;
      color: var(--el-color-primary);
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
