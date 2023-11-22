<template>
  <div
    class="
      bg-gray--50
      padding-top--6
      text-center
      color-gray--500
    "
  >
    <p class="font-large margin-bottom--2">
      {{ t('oops') }}
    </p>
    <p class="font-base">
      {{ t('noResult') }}
    </p>
    <PImage
      pType="paupulse"
      pName="empty-state"
      class="image-no-result"
    />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PImage } from '@kpmg/styleguide'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})
</script>

<style lang="scss" scoped>
.bg-gray--50 {
  background: var(--el-color-neutral-gray-50);
}

.color-gray--500 {
  color: var(--el-color-neutral-gray-500);
}

.image-no-result {
  max-width: 31.6rem;
}
</style>

<i18n lang="yaml">
en-US:
  oops: 'Oops'
  noResult: 'It looks like there are no results for your search.'
fr-FR:
  oops: 'Oups'
  noResult: "Il semblerait qu'il n'y ait pas de résultats à votre recherche."
</i18n>
