<template>
  <div class="widgets-home">
    <!-- Temporary way of switching templates -->
    <!-- TODO delete -->
    <section>
      <button class="margin-right--4" @click="setWidgetConfigurationListPennylane">
        Avec Pennylane
      </button>
      <button @click="setWidgetConfigurationListDefault">
        Sans Pennylane
      </button>
    </section>
    <div class="widgets-home__top-section">
      <div
        v-for="(widget, index) in topSectionWidgets"
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
    <div class="widgets-home__main-section">
      <div
        v-for="(widget, index) in mainSectionWidgets"
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
import { computed, onMounted, ref } from 'vue'
import type { WidgetConfiguration } from '@pulse/widgets/types'
import { WidgetName, WidgetSections } from '@pulse/widgets/enums'
import { WidgetsManager } from '@pulse/widgets/managers'
import { logger } from '@pulse/core'

const widgetConfigurationList = ref<WidgetConfiguration[]>([])
const topSectionWidgets = computed(() => {
  return widgetConfigurationList.value.filter((widget) => widget.section === WidgetSections.TOP)
})
const mainSectionWidgets = computed(() => {
  return widgetConfigurationList.value.filter((widget) => widget.section === WidgetSections.MAIN)
})

// TODO Logic to be moved in a manager in the future
const setWidgetConfigurationList = (widgets: WidgetConfiguration[]) => {
  widgetConfigurationList.value = []
  // ensure the widgets are sorted by order before adding them
  widgets.sort((a, b) => a.order - b.order)
  widgets.forEach((widget) => {
    // Retrieve the widget definition from WidgetsManager
    const widgetDefinition = WidgetsManager.getWidgetDefinition(widget.name)

    if (widgetDefinition) {
      // if the definition exists, the widget is valid so add it to the list
      widgetConfigurationList.value.push({
        ...widgetDefinition,
        order: widget.order,
        section: widget.section,
      })
    } else {
      logger.warn(`Widget ${widget.name} not found in WidgetsManager. It will not be displayed.`)
    }
  })
}

const setWidgetConfigurationListPennylane = () => {
  const widgetsToAdd: WidgetConfiguration[] = [
    { name: WidgetName.SSO, order: 0, section: WidgetSections.TOP },
    { name: WidgetName.PENNYLANE_INTRO, order: 1, section: WidgetSections.MAIN },
    { name: WidgetName.DIGILAB, order: 2, section: WidgetSections.MAIN },
    { name: WidgetName.RSS_NEWS, order: 3, section: WidgetSections.MAIN },
    { name: WidgetName.POWERBI_INTRO, order: 4, section: WidgetSections.MAIN },
  ]
  setWidgetConfigurationList(widgetsToAdd)
}

const setWidgetConfigurationListDefault = () => {
  const widgetsToAdd = [
    { name: WidgetName.RSS_NEWS, order: 1, section: WidgetSections.MAIN },
    { name: WidgetName.DIGILAB, order: 2, section: WidgetSections.MAIN },
  ]
  setWidgetConfigurationList(widgetsToAdd)
}

onMounted(() => {
  setWidgetConfigurationListPennylane()
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
