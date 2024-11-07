<template>
  <Story
    title="1. Basic/Flex"
    icon="teenyicons:text-solid"
    :layout="{
      type: 'single',
      iframe: true,
    }"
  >
    <Variant
      :title="group.name"
      v-for="(group, index) in groups"
      :key="index"
    >
      <ul class="list-style-none">
        <li
          v-for="cssClass in group.cssClasses"
          :key="cssClass"
          class="
            padding--1
            margin-bottom--2
            width-500
            cursor-pointer
          "
          @click="onClickCssClass(cssClass, flexDirectionColumn ? flexDirectionColumnLabel : '')"
        >
          <div>
            <span>{{ cssClass }}</span>
            <span
              v-if="flexDirectionColumn"
              class="margin-left--2"
            >
              {{ flexDirectionColumnLabel }}
            </span>
          </div>
          <div
            class="
              flex
              bg--neutral-gray-100
            "
            :class="{
              'flex--direction-column': flexDirectionColumn,
              [cssClass]: group.applyToChild === undefined,
            }"
          >
            <div
              v-for="(subElement, indexItem) in group.subList"
              :key="indexItem"
              class="
                padding-x--6
                bg--persian-300
                radius--3
              "
              :class="{
                [subElement]: true,
                [cssClass]: group.applyToChild === 'all' || group.applyToChild === indexItem,
                'darker': group.applyToChild === 'all' || group.applyToChild === indexItem,
              }"
            />
          </div>
        </li>
      </ul>
      <template #controls>
        <HstCheckbox
          v-model="flexDirectionColumn"
          title="Column"
        />
      </template>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { stringToClassList, numbersToClassList, onClickCssClass } from '@styleguide/utils/histoireHelpers'

const subListSameSize = ['40', '40', '40'].map((size) => `height-${size}`)
const subListVariable = ['80', '40', '60'].map((size) => `height-${size}`)

const justifyContentAttributes = 'flex-start, flex-end, space-around, space-between, stretch, center'
const alignAttributes = 'flex-start, flex-end, stretch, center, end, start'

const justifyContent = stringToClassList('flex--justify-content-', justifyContentAttributes)
const alignItems = stringToClassList('flex--align-items-', alignAttributes)
const gaps = numbersToClassList('flex-gap--', 12)
const alignSelves = stringToClassList('flex--align-self-', alignAttributes)
const flexGrows = numbersToClassList('flex--grow-', 6)
const flexShrinks = numbersToClassList('flex--shrink-', 6)
const flexBasises = numbersToClassList('flex--basis-', 100)
const flexDirectionColumn = ref(false)
const flexDirectionColumnLabel = 'flex--direction-column'

type Group = {
  name: string
  cssClasses: string[]
  subList: string[]
  applyToChild?: number | 'all'
}

const groups: Group[] = [{
  name: 'justifyContent',
  cssClasses: justifyContent,
  subList: subListSameSize,
}, {
  name: 'alignItem',
  cssClasses: alignItems,
  subList: subListVariable,
}, {
  name: 'gap',
  cssClasses: gaps,
  subList: subListSameSize,
}, {
  name: 'alignSelf',
  cssClasses: alignSelves,
  subList: subListVariable,
  applyToChild: 1,
}, {
  name: 'flexGrow',
  cssClasses: flexGrows,
  subList: subListVariable,
  applyToChild: 1,
}, {
  name: 'flexShrink',
  cssClasses: flexShrinks,
  subList: subListVariable,
  applyToChild: 1,
}, {
  name: 'flexBasis',
  cssClasses: flexBasises,
  subList: subListVariable,
  applyToChild: 1,
}]
</script>

<style lang="scss" scoped>
.min-width {
min-width: 120px;
}
.width-500 {
width: 500px;
}
.height-40 {
height: 40px;
}
.height-60 {
height: 60px;
}
.height-80 {
height: 80px;
}

.darker {
  background-color: var(--el-color-persian-900) !important;
}
</style>

<docs lang="md">
  ## Text
  <div class="responsive-iframe-container">
    <iframe class="responsive-iframe" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FCmAQkyvJgicN6PHwf61DBZ%2F%25F0%259F%25A6%2584-Guidelines%3Ftype%3Ddesign%26node-id%3D659%253A521%26mode%3Ddev" allowfullscreen></iframe>
  </div>
</docs>
