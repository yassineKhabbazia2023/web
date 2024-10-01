<template>
  <div
    class="
      wip
      text-center
      flex
      flex--direction-column
      flex--justify-content-center
      flex--align-items-center
      overflow-hidden
    "
  >
    <div
      class="wip__illustration flex flex--justify-content-center flex--align-items-center"
    >
      <PImage
        pType="splash"
        pName="background-wip"
        pFit="contain"
        class="wip__illustration-background"
      />
      <PImage
        pType="paupulse"
        pName="work-in-progress"
        pFit="cover"
        class="wip__illustration-image flex flex--justify-content-center flex--align-items-center"
      />
    </div>
    <div class="wip__message">
      <h3
        class="h3 font-semibold margin-bottom--4"
        data-testid="wip-message-title"
      >
        <span class="text-color--base-persian">{{
          t('thisFunctionality')
        }}</span>
        {{ t('noLongerAvailable') }}
      </h3>
      <p class="font-normal font-large" data-testid="wip-message-description">
        {{ t('description') }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PImage } from '@pulse/styleguide'
import { useI18n } from 'vue-i18n'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})
</script>

<style scoped lang="scss">
.wip {
  &__illustration {
    position: relative;
    padding: 3.2rem;
    margin-bottom: 2.4rem;
    @media screen and (min-width: 992px) {
      padding: 5rem 0 7rem;
      margin-bottom: 6rem;
    }
    &-background {
      width: 980px;
      position: absolute;
      bottom: 0;
    }
    &-image {
      width: 165px;
      @media screen and (min-width: 992px) {
        width: 308px;
      }
    }
  }
  &__message {
    max-width: 549px;
    width: 100%;
    @media screen and (max-width: 991px) {
      padding: 0 1.6rem;
    }
  }
}
</style>

<i18n lang="yaml">
en-US:
  thisFunctionality: 'This functionality'
  noLongerAvailable: 'is no longer available'
  description: >
    We are constantly working to improve your platform and add new features that meet your needs.
    We will keep you informed of the new features to come!
fr-FR:
  thisFunctionality: 'Cette fonctionnalité'
  noLongerAvailable: "n'est plus disponible"
  description: >
    Nous travaillons constamment à l'amélioration de votre plateforme
    et à l'ajout de nouvelles fonctionnalités qui répondent à vos besoins.
    Nous vous tiendrons informé des nouveautés à venir !
</i18n>
