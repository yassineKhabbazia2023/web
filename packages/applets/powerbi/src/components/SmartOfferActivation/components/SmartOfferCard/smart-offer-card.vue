<template>
  <div
    class="smart-offer__card flex flex--direction-column padding--6"
    :class="cardClasses"
  >
    <div class="margin-bottom--3">
      <p class="font-bold">
        {{ title }}
      </p>
      <p class="smart-offer__card-subtitle text-color--persian-400 font-bold">
        {{ subtitle }}
      </p>
    </div>
    <p class="smart-offer__card-description">
      {{ description }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { SmartOfferCardProps } from './smart-offer-card.type'

const props = withDefaults(defineProps<SmartOfferCardProps>(), {
  darkMode: false,
})

const cardClasses = computed(() => {
  return props.darkMode ? ['text-color--base-white', 'bg--base-blue-pulse'] : 'bg--base-persian-light'
})
</script>

<style lang="scss" scoped>
.smart-offer__card {
  flex: 1;
  width: 400px;

  &-description {
    line-height: 20px;
  }

  @media screen and (max-width: 992px) {
    flex: 1;
    width: 100%;
    margin: 12px 0px;
  }
}
</style>
