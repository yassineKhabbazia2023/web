<template>
  <i18n-t
    keypath="sentence"
    tag="div"
    class="
      offers-catalog-header
      padding--8
      bg--base-blue-pulse
      text-color--base-white
      text-center
    "
  >
    <template #need>
      <span class="text-color--secondary-amethyste">{{ t('need') }}</span>
    </template>
    <template #theOffer>
      <span class="text-color--secondary-amethyste">{{ t('theOffer') }}</span>
    </template>
  </i18n-t>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})
</script>

<i18n lang="yaml">
  en-US:
    sentence: 'Got a customer {need}? Find {theOffer}!'
    need: 'need'
    theOffer: 'the right offer'
  fr-FR:
    sentence: 'Un {need} client ? Trouvez {theOffer} correspondante !'
    need: 'besoin'
    theOffer: "l'offre"
</i18n>

<style type="scss" scoped>
.offers-catalog-header {
  font-size: 3.2rem;
  font-weight: 700;
}
</style>
