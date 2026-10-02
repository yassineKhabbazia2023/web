<template>
  <!-- The wordmark, spelled out for screen readers beside it -->
  <span class="key-moments-comment-wordmark">
    <span
      class="key-moments-comment-wordmark__mark flex--align-items-baseline"
      aria-hidden="true"
    >
      {{ t('keyMoments.comment.wordmark') }}

      <PIcon
        class="key-moments-comment-wordmark__monogram"
        pName="rydgeMonogram"
      />
    </span>

    <span
      class="
        key-moments-comment-wordmark__text
        position--absolute
        overflow-hidden
        no-wrap
      "
    >
      {{ t('keyMoments.comment.title') }}
    </span>
  </span>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PIcon } from '@pulse/styleguide/components'

const { t } = useI18n()
</script>

<style scoped lang="scss">
.key-moments-comment-wordmark {
  // The flex box swallows the whitespace so that the monogram closes the apostrophe
  &__mark {
    display: inline-flex;
    letter-spacing: normal;
  }

  // The R fills the upper 59% of the drawing: scaled to a capital, dropped onto the baseline
  &__monogram {
    margin-left: 1px;
    font-size: 1.3em;
    transform: translateY(0.41em);
  }

  &__text {
    width: 1px;
    height: 1px;
    margin: -1px;
    clip-path: inset(50%);
  }
}
</style>
