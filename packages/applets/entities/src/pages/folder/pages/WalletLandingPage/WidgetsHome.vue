<template>
  <div class="widgets-home">
    <div class="widgets-home__main-section">
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
import { onMounted, ref } from 'vue'
import type { WidgetDefinition } from '@pulse/widgets/types'
import { WidgetsHomeManager } from './widgets-home.manager'

const widgets = ref<WidgetDefinition[]>([])

onMounted(() => {
  widgets.value = WidgetsHomeManager.getWidgetsLayout()
})
</script>

<style lang="scss" scoped>
.widgets-home {
  &__top-section,
  &__main-section {
    margin: 16px 0;
    display: grid;
    grid-template-columns: repeat(3, minmax(250px, 1fr));
    grid-gap: 16px;
  }

  &__grid-item {
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

  &__top-section {
    .widgets-home__grid-item {
      min-height: 75px;
    }
  }

  &__main-section {
    .widgets-home__grid-item {
      min-height: 340px;
    }
  }

  @media (max-width: 992px) {
    &__top-section,
    &__main-section {
      grid-template-columns: repeat(2, minmax(250px, 1fr));

      .widgets-home__grid-item {
        &--span-2 {
          grid-column: 1 / -1;
        }
      }

      .widgets-home__grid-item--span-1:nth-of-type(2) {
        order: 1;
      }
    }
  }

  @media (max-width: 767px) {
    &__top-section,
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
