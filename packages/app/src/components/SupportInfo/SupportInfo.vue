<template>
  <p class="support font-small">
    {{ t('contactSupport') }}
    <a :href="phoneSanitizedUrl" class="link">
      {{ t('phoneNumber') }}
    </a>
    {{ t('emailLabel') }}
    <a :href="emailSanitizedUrl" class="link">
      {{ t('SAVEmail') }}
    </a>
  </p>
  <p>
    <button
      class="link support__copyright cursor-pointer"
      data-testid="copyright-link"
      @click.prevent="handleCopyrightLink"
    >
      {{ t('copyright') }}
    </button>
  </p>

  <PDrawer
    v-model="isCopyrightDrawerOpened"
    pTitle="Copyright"
    data-testid="login-copyright-drawer"
    @close-drawer-button="handleCloseDrawer"
  >
    <p class="font-small text-left">
      {{ t('copyrightContent') }}
    </p>
    <template #footer>
      <PButton pType="primary" @click="handleCloseDrawer">
        {{ t('close') }}
      </PButton>
    </template>
  </PDrawer>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { sanitizeUrl } from '@braintree/sanitize-url'
import { computed } from 'vue'
import { PButton, PDrawer } from '@pulse/styleguide/components'
import { useFooterLink } from '@app/composables/useFooterLink'
const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const { handleCopyrightLink, isCopyrightDrawerOpened, handleCloseDrawer } =
  useFooterLink()

const phoneSanitizedUrl = computed(() => {
  return sanitizeUrl(`tel:${t('phoneNumberLink')}`)
})
const emailSanitizedUrl = computed(() => {
  return sanitizeUrl(`mailto:${t('SAVEmail')}`)
})
</script>

<style lang="scss" scoped>
.support {
  color: var(--el-color-white);

  &__copyright {
    appearance: none;
    background: none;
    border: none;
  }
}
.link {
  font-size: 1.2rem;
  color: var(--el-color-white)
}
</style>

<i18n lang="yaml">
en-US:
  contactSupport: 'Contact support : '
  phoneNumberLink: '+33973733000'
  phoneNumber: '09 73 73 3000'
  emailLabel: ' — email : '
  SAVEmail: "relation-client{'@'}rydgeconseil.fr"
  copyright: 'Ⓒ RYDGE CONSEIL'
  copyrightContent: >-
    © 2024 KPMG S.A., public accounting and auditing company,
    French member of the global KPMG organization made up of independent firms
    affiliated with KPMG International Limited, a company incorporated under English
    law (“private company limited by guarantee”). All rights reserved.
    The KPMG name and logo are trademarks used under license by independent member firms of
    the global KPMG organization. To learn more about the structure of
    the KPMG global organization, visit https://kpmg.com/governance.
  close: 'Close'
fr-FR:
  contactSupport: 'Contact support : '
  phoneNumberLink: '+33973733000'
  phoneNumber: '09 73 73 3000'
  emailLabel: ' — email : '
  SAVEmail: "relation-client{'@'}rydgeconseil.fr"
  copyright: 'Ⓒ RYDGE CONSEIL'
  copyrightContent: >-
    © 2024 KPMG S.A., société anonyme d'expertise comptable et de commissariat aux comptes,
    membre français de l’organisation mondiale KPMG constituée de cabinets indépendants
    affiliés à KPMG International Limited, une société de droit anglais (« private company
    limited by guarantee »). Tous droits réservés. Le nom et le logo KPMG sont des
    marques utilisées sous licence par les cabinets indépendants membres de l’organisation
    mondiale KPMG. Pour en savoir plus sur la structure de l’organisation mondiale KPMG,
    rendez-vous sur la page https://kpmg.com/governance (en anglais).
  close: 'Fermer'
</i18n>
