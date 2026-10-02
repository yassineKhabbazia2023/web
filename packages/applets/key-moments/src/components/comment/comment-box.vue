<template>
  <section class="key-moments-comment-box font-size--13">
    <header class="key-moments-comment-box__title margin-bottom--1">
      <CommentWordmark />
    </header>

    <p
      class="key-moments-comment-box__text margin--0"
      :data-testid="`${testIdPrefix}-text`"
    >
      {{ text }}
    </p>
  </section>
</template>

<script setup lang="ts">
import CommentWordmark from './comment-wordmark.vue'

defineProps<{
  /** Prefix applied to the `-text` test id */
  testIdPrefix: string
  text?: string
}>()
</script>

<style scoped lang="scss">
.key-moments-comment-box {
  padding: 15px 18px;
  background-color: var(--p-humming-bird-100);
  line-height: 1.6;

  &__title {
    font-size: 10.5px;
    font-weight: 800;
    letter-spacing: 0.1em;
    color: var(--p-jungle-500);
  }

  &__text {
    min-height: 40px;
    white-space: pre-wrap;
    overflow-wrap: break-word;
  }
}
</style>
