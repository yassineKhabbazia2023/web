<template>
  <div data-testid="key-moments-recommendations-category-picker">
    <div
      class="
        flex
        flex--align-items-flex-start
        flex--justify-content-space-between
        flex-gap--4
        margin-bottom--5
      "
    >
      <div>
        <h3 class="key-moments-category-picker__title margin--0">
          {{ t('keyMoments.recommendations.categoryPicker.title') }}
        </h3>
        <p class="key-moments-category-picker__text margin-top--2">
          {{ t('keyMoments.recommendations.categoryPicker.text') }}
        </p>
      </div>

      <!-- Nothing is erased yet: cancelling brings the current recommendations back untouched -->
      <PButton
        v-if="isChanging"
        pSize="small"
        pType="secondary"
        pTestId="key-moments-recommendations-category-picker-cancel-button"
        @click="emit('cancel')"
      >
        {{ t('keyMoments.recommendations.categoryPicker.cancel') }}
      </PButton>
    </div>

    <p
      v-if="categories.length === 0"
      class="text-color--text-neutral"
      data-testid="key-moments-recommendations-category-picker-empty"
    >
      {{ t('keyMoments.recommendations.categoryPicker.empty') }}
    </p>

    <div
      v-else
      class="key-moments-category-picker__grid"
    >
      <button
        v-for="category in categories"
        :key="category.id"
        type="button"
        class="
          key-moments-category-picker__card
          flex
          flex--direction-column
          flex--align-items-flex-start
          flex-gap--2
          cursor-pointer
        "
        :data-testid="`key-moments-recommendations-category-${category.id}-choose-button`"
        @click="emit('choose', category.id)"
      >
        <span class="key-moments-category-picker__label text-color--text-heading">
          {{ category.label }}
        </span>
        <span class="key-moments-category-picker__text">
          {{ category.pitch }}
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PButton } from '@pulse/styleguide/components'
import type { CategoryPayload } from '../../services/recommendations.service.types'

defineProps<{
  categories: CategoryPayload[]
  /** A category already copied: choosing another one replaces it, and can be cancelled */
  isChanging: boolean
}>()

const emit = defineEmits<{
  choose: [categoryId: number]
  cancel: []
}>()

const { t } = useI18n()
</script>

<style lang="scss" scoped>
@use '@pulse/styleguide/scss/breakpoints' as breakpoints;
@use '../../styles/screen';

.key-moments-category-picker {
  &__title {
    font-size: 20px;
    font-weight: 800;
  }

  &__text {
    @include screen.card-text;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;

    @include breakpoints.media(xs) {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  &__card {
    @include screen.block;

    text-align: left;
    transition: border-color 120ms ease;

    &:hover,
    &:focus-visible {
      border-color: var(--p-jungle-400);
    }
  }


  &__label {
    @include screen.card-title;
  }
}
</style>
