<template>
  <div
    class="prospect-home-page"
    data-testid="prospect-home-page"
  >
    <PEntityHeader
      v-if="currentEntity && isMobile === false"
      :pLegalName="currentEntity.legalName"
      :pAccountNumber="currentEntity.accountNumber"
      class="margin-bottom--4"
    />
    <div
      class="
        prospect-home-page__main-section
        grid
        grid-gap--10
        margin-y--4
      "
    >
      <div
        v-for="widget in widgets"
        :key="widget.name"
        :class="['prospect-home-page__grid-item', widget.spanClass]"
      >
        <component :is="widget.name" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useCurrentEntityStore } from '@pulse/common/stores'
import { PEntityHeader } from '@pulse/styleguide/components'
import { useResponsive } from '@pulse/styleguide'
import { WidgetsGridManager } from '@pulse/widgets/managers'
import { WidgetName } from '@pulse/widgets/enums'
import type { WidgetGridDefinition } from '@pulse/widgets/types'

interface ProspectWidget extends WidgetGridDefinition {
  spanClass: string
}

const PROSPECT_WIDGET_NAMES: WidgetName[] = [
  WidgetName.WORKSPACE_INTRO,
  WidgetName.CONTACTS,
]

const { isMobile } = useResponsive()
const currentEntityStore = useCurrentEntityStore()
const { currentEntity } = storeToRefs(currentEntityStore)

const widgets = computed<ProspectWidget[]>(() =>
  PROSPECT_WIDGET_NAMES
    .map((widgetName) => WidgetsGridManager.getWidgetGridDefinition(widgetName))
    .filter((widget): widget is WidgetGridDefinition => widget !== undefined)
    .map((widget) => ({
      ...widget,
      spanClass: `prospect-home-page__grid-item--span-${widget.size}`,
    })),
)
</script>

<style lang="scss" scoped>
@use '@pulse/styleguide/scss/breakpoints' as breakpoints;

.prospect-home-page {
  &__main-section {
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

      .prospect-home-page__grid-item {
        &--span-2 {
          grid-column: 1 / -1;
        }
      }
    }
  }

  @include breakpoints.media(xs) {
    &__main-section {
      grid-template-columns: 1fr;

      .prospect-home-page__grid-item {
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
