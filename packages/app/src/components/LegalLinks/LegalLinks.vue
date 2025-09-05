<template>
  <ul
    class="legal-links list-style-none flex--align-items-center flex--wrap"
    :class="{'legal-links--dark': dark === true}"
  >
    <li class="legal-links__item flex flex--align-items-center">
      <a
        class="legal-links__link"
        :href="LEGAL_NOTICE_URL"
        target="_blank"
        rel="noopener"
      >
        {{ t('legalNotice') }}
      </a>
    </li>
    <li
      v-if="hasCgu === true"
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
        :href="PRIVACY_POLICY_URL"
        target="_blank"
        rel="noopener"
      >
        {{ t('privacyPolicy') }}
      </a>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { ref, onMounted } from 'vue'
import { fetchUrlTerms } from '@pulse/common'
import { LEGAL_NOTICE_URL, PRIVACY_POLICY_URL } from '@pulse/core'
import type { LegalLinksProps } from './LegalLinks.types'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

defineProps<LegalLinksProps>()

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
      }
    }
  }
  &__link,
  #ot-sdk-btn.ot-sdk-show-settings,
  #ot-sdk-btn.optanon-show-settings {
    background: none;
    appearance: none;
    border: none;
    padding: 0;
    cursor: pointer;

    &:hover,
    &:focus {
      text-decoration: underline;
      background: none;
    }
  }
  &--dark {
    #{$self}__link {
      color: var(--p-white);
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
