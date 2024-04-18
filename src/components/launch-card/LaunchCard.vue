<template>
  <div
    class="
    launchCard
    padding--6
    radius--2
    flex
    flex--direction-column
    flex-gap--2
    "
  >
    <div class="flex flex--justify-content-center margin-bottom--1">
      <PImage
        class="launchCard__image"
        :pType="imageType"
        :pName="imageName"
      />
    </div>

    <p class="text-center font-large font-bold">
      {{ title }}
    </p>
    <p class="text-center flex--grow-1 margin-bottom--4">
      {{ subtitle }}
    </p>
    <div
      class="
        flex
        flex--justify-content-center
        flex--align-items-center
        flex-gap--2
      "
    >
      <a
        v-if="downloadHref"
        :href="downloadHref"
        target="_blank"
        class="padding--2 text-color--persian-500 font-small font-semibold"
      >
        {{ t('download') }}
      </a>

      <PButton
        v-if="actionLabel"
        pType="primary"
        pSize="small"
      >
        {{ actionLabel }}
        <PIcon
          class="el-button__icon--right"
        >
          <PIArrowRight />
        </PIcon>
      </PButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PImage, PIcon, PButton, PIArrowRight } from '@kpmg/styleguide'
import type { LaunchCardProps } from './LaunchCardTypes'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

defineProps<LaunchCardProps>()
</script>

<style lang="scss" scoped>
.launchCard {
  border: 1px solid var(--el-color-neutral-gray-100);

  &__image {
    height: 6rem;
  }
}
</style>

<i18n lang="yaml">
  en-US:
    download: 'Download'
  fr-FR:
    download: 'Télécharger'
</i18n>
