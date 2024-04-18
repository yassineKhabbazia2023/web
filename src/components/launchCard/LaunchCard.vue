<template>
  <div
    class="
      launch-card
      padding--6
      radius--2
      flex
      flex--direction-column
      flex-gap--2
    "
  >
    <div class="flex flex--justify-content-center margin-bottom--1">
      <PImage
        class="launch-card__image"
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
      <PButton
        v-if="sanitizedDownloadUrl"
        :href="sanitizedDownloadUrl"
        pType="white"
        pSize="small"
        tag="a"
        target="_blank"
      >
        {{ t('download') }}
      </PButton>

      <PButton
        v-if="actionLabel"
        pType="primary"
        pSize="small"
        @click="emit('click-action')"
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
import { computed } from 'vue'
import { sanitizeUrl } from '@braintree/sanitize-url'
import { useI18n } from 'vue-i18n'
import { PImage, PIcon, PButton, PIArrowRight } from '@kpmg/styleguide'
import type { LaunchCardProps } from './LaunchCardTypes'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

defineEmits<{
  'click-action': []
}>()

const props = defineProps<LaunchCardProps>()

const sanitizedDownloadUrl = computed(() => {
  return props.downloadUrl
    ? sanitizeUrl(props.downloadUrl)
    : ''

})
</script>

<style lang="scss" scoped>
.launch-card {
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
