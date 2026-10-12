<template>
  <div class="position--relative">
    <div
      class="
        engagement-letter-banner
        flex
        flex--align-items-center
        position--relative
        bg--surface-basic-secondary
        cursor-pointer
        overflow-hidden
      "
      @click="emit('open')"
    >
      <p
        class="
          font-bold
          font-size--28
          text-color--white
          margin--0
          padding-left--10
        "
      >
        {{ t(`${I18N_KEY}.bannerTitle`) }}
      </p>
      <PImage
        pName="cloud_with_mountain_behind"
        pFit="cover"
        class="engagement-letter-banner__photo"
      />
      <div class="engagement-letter-banner__accent" />
      <PImage
        pName="brand-white"
        pFit="contain"
        class="engagement-letter-banner__logo"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PImage } from '@pulse/styleguide/components'
import type { EngagementLetterBannerEmits } from './engagement-letter-banner.types'

const I18N_KEY = 'entities.prospect.conformity.engagementLetter'

const { t } = useI18n()

const emit = defineEmits<EngagementLetterBannerEmits>()
</script>

<style scoped lang="scss">
.engagement-letter-banner {
  height: 22rem;

  &__photo {
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    width: 34%;
    clip-path: polygon(10rem 0, 100% 0, 100% 100%, 0 100%);
  }

  &__accent {
    position: absolute;
    right: 34%;
    bottom: 0;
    width: 1.6rem;
    height: 4rem;
    background-color: var(--p-surface-state-active);
    // Same slope as the photo clip-path diagonal (10rem over 22rem)
    transform: skewX(-24.4deg);
    transform-origin: bottom;
  }

  &__logo {
    position: absolute;
    right: 3.2rem;
    bottom: 1.6rem;
    width: 9.3rem;
    height: 3.2rem;
  }
}
</style>
