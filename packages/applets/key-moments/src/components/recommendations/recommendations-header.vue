<template>
  <div
    class="
      key-moments-recommendations-header
      flex
      flex--align-items-center
      flex--justify-content-space-between
      flex--wrap
      flex-gap--4
    "
    data-testid="key-moments-recommendations-header"
  >
    <div>
      <p class="key-moments-recommendations-header__overline margin--0">
        {{ t('keyMoments.recommendations.header.overline') }}
      </p>
      <p
        class="key-moments-recommendations-header__label margin--0"
        data-testid="key-moments-recommendations-header-category"
      >
        {{ categoryLabel ?? t('keyMoments.recommendations.header.unknownCategory') }}
      </p>
      <p
        class="key-moments-recommendations-header__meta margin--0"
        data-testid="key-moments-recommendations-header-count"
      >
        {{ t('keyMoments.recommendations.header.count', { total: totalCount, visible: visibleCount }, totalCount) }}
      </p>
    </div>

    <!-- Saved as it is edited: the only word said of it is when it is being written, or was refused -->
    <span
      v-if="isSaving || hasSaveFailed"
      class="key-moments-recommendations-header__meta"
      data-testid="key-moments-recommendations-header-save-status"
    >
      {{ isSaving ? t('keyMoments.recommendations.header.saving') : t('keyMoments.recommendations.header.saveFailed') }}
    </span>

    <!-- No confirmation here: nothing is erased before a new category is chosen -->
    <PButton
      pSize="small"
      pType="white"
      pTestId="key-moments-recommendations-header-change-button"
      @click="emit('changeCategory')"
    >
      {{ t('keyMoments.recommendations.header.change') }}
    </PButton>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PButton } from '@pulse/styleguide/components'

defineProps<{
  categoryLabel: string | undefined
  totalCount: number
  visibleCount: number
  isSaving: boolean
  hasSaveFailed: boolean
}>()

const emit = defineEmits<{
  changeCategory: []
}>()

const { t } = useI18n()
</script>

<style lang="scss" scoped>
.key-moments-recommendations-header {
  padding: 18px 24px;
  color: var(--p-white);
  background-color: var(--p-black-rock-800);

  &__overline {
    font-size: 10.5px;
    font-weight: 800;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    opacity: 0.7;
  }

  &__label {
    font-size: 18px;
    font-weight: 800;
  }

  &__meta {
    font-size: 13px;
    opacity: 0.85;
  }
}
</style>
