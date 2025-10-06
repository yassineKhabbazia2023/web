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
import { onMounted, ref } from 'vue'
import type { WidgetGridDefinition } from '@pulse/widgets/types'
import { WidgetsHomeManager } from './widgets-home.manager'
import { useUserStore } from '@pulse/common/stores'
import { BookingManager } from '@pulse/common/managers'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { isCustomer } = storeToRefs(userStore)

const widgets = ref<WidgetGridDefinition[]>([])

onMounted(async () => {
  await BookingManager.refreshAvailableExperts()
  widgets.value = WidgetsHomeManager.getWidgetsLayout(isCustomer.value)
})
</script>

<style lang="scss" scoped>
.widgets-home {
  &__main-section {
    margin: 16px 0;
    grid-template-columns: repeat(3, minmax(250px, 1fr));
    min-height: 340px;
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


  @media (max-width: 1260px) {
    &__main-section {
      grid-template-columns: repeat(2, minmax(250px, 1fr));

      .widgets-home__grid-item {
        &--span-2 {
          grid-column: 1 / -1;
        }
      }
    }
  }

  @media (max-width: 767px) {
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
