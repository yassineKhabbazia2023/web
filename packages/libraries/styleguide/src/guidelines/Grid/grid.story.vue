<template>
  <Story
    title="1. Basic/Grid"
    icon="teenyicons:text-solid"
    :layout="{
      type: 'single',
      iframe: true,
    }"
  >
    <Variant
      title="nominal grid"
    >
      <div
        class="
          grid
          grid-gap--1
        "
        :class="cssClasses"
      >
        <span
          v-for="(_, index) in list"
          :key="index"
          class="
            flex
            flex--justify-content-center
            flex--align-items-center
            text-center
            padding--6
            bg--persian-300
            height-40
          "
        >
          {{ index }}
        </span>
      </div>

      <template #controls>
        <HstSelect
          v-model="gridCols"
          title="GridCols"
          :options="gridColsList"
        />
        <HstSelect
          v-model="gridFlow"
          title="GridFlow"
          :options="gridFlowList"
        />
      </template>
    </Variant>

    <Variant
      title="with col and row spans"
    >
      <div
        class="
          grid
          grid-gap--1
        "
        :class="cssClasses"
      >
        <span
          v-for="({ cssClass }, index) in list"
          :key="index"
          :class="cssClass"
          class="
            flex
            flex--justify-content-center
            flex--align-items-center
            text-center
            padding--6
            bg--persian-300
            height-40
          "
        >
          {{ index }}
          <br>
          {{ cssClass }}
        </span>
      </div>
    </Variant>

    <Variant
      title="with breakpoints"
    >
      <div
        class="
          grid
          with-breakpoints
          grid-cols--4
          grid-gap--1
        "
      >
        <span
          v-for="(_, index) in list"
          :key="index"
          class="
            flex
            flex--justify-content-center
            flex--align-items-center
            text-center
            padding--6
            bg--persian-300
            height-40
          "
        >
          {{ index }}
        </span>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
const COUNT = 11

const gridColsList = [
  1,
  2,
  3,
  4,
  5,
  6,
]
const gridFlowList = [
  'row',
  'column',
]

const gridCols = ref(gridColsList[0])
const gridFlow = ref(gridFlowList[0])

const cssClasses = computed(() => {
  const cssClasses = [
    `grid-cols--${gridCols.value}`,
    `grid-flow--${gridFlow.value}`,
  ]

  return cssClasses
})

function getCssClass(index: number) {
  if (index === 0) {
    return 'grid-row-span--2'
  }
  if (index === 2) {
    return 'grid-col-span--2'
  }
  if (index === 6) {
    return 'grid-col-span--3'
  }
  if (index === 8) {
    return 'grid-col-span--4'
  }
  return ''
}

const list = Array.from(Array(COUNT))
  .map((_, index) => {
    const cssClass = getCssClass(index)

    return {
      cssClass,
    }
  })
</script>

<style lang="scss" scoped>
@use '../../assets/scss/pegase/breakpoints';

.with-breakpoints {
  grid-template-columns: repeat(4, auto);

  &::before {
    position: absolute;
    font-weight: bold;
    padding: 5px;
  }

  @media only screen and (width < 480px) {
    &::before {
      content: 'xxs'
    }
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }

  @media only screen and (width >= 480px) and (width < 768px) {
    &::before {
      content: 'xs'
    }
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media only screen and (width >= 768px) and (width < 992px) {
    &::before {
      content: 'sm'
    }
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
