<template>
  <div class="widgets-home">
    <div
      class="
        widgets-home__main-section
        grid
        grid-gap--10
      "
    >
      <div
        v-for="(widget, index) in widgets"
        :key="index"
        class="widgets-home__grid-item"
        :class="{
          'widgets-home__grid-item--span-1': widget.size === 1,
          'widgets-home__grid-item--span-2': widget.size === 2,
          'widgets-home__grid-item--span-3': widget.size === 3,
        }"
      >
        <component :is="widget.name" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { WidgetsHomeManager } from '@homepage/managers/widgets-home.manager'
import { useUserStore } from '@pulse/common/stores'
import { storeToRefs } from 'pinia'
import { useResponsive } from '@pulse/styleguide'

const userStore = useUserStore()
const { isCustomer } = storeToRefs(userStore)
const { isMobile } = useResponsive()

/**
 * Computed rather than loaded on mount: some entries of the layout are read
 * from a store the dossier fills asynchronously, and the grid has to take them
 * as they land rather than only at the next mount.
 */
const widgets = computed(() => WidgetsHomeManager.getWidgetsLayout(isCustomer.value, isMobile.value))
</script>

<style lang="scss" scoped>
@use '@pulse/styleguide/scss/breakpoints' as breakpoints;

.widgets-home {
  &__main-section {
    margin: 16px 0;
    grid-template-columns: repeat(3, minmax(250px, 1fr));
    min-height: 340px;
  }

  &__grid-item {
    overflow: hidden;
    min-width: 0;

    &--span-1 {
      grid-column: span 1;
    }

    &--span-2 {
      grid-column: span 2;
    }

    &--span-3 {
      grid-column: span 3;
    }
  }


  @include breakpoints.media(md) {
    &__main-section {
      grid-template-columns: repeat(2, minmax(250px, 1fr));

      .widgets-home__grid-item {
        // Both are the whole row here: spanning 3 tracks on a 2-column grid
        // would open an implicit third column the other rows do not have
        &--span-2,
        &--span-3 {
          grid-column: 1 / -1;
        }
      }
    }
  }

  @include breakpoints.media(xs) {
    &__main-section {
      grid-template-columns: 1fr;

      .widgets-home__grid-item {
        &--span-1,
        &--span-2,
        &--span-3 {
          grid-column: 1 / -1;
        }
      }
    }
  }
}
</style>
