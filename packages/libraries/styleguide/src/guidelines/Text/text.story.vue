<template>
  <Story
    title="1. Basic/Typographie"
    icon="teenyicons:text-solid"
    :layout="{
      type: 'single',
      iframe: true,
    }"
  >
    <Variant
      title="Dictonary"
    >
      <ul class="list-style-none">
        <li
          v-for="groupKey in Object.keys(groups)"
          :key="groupKey"
          class="flex"
        >
          <span class="min-width">{{ groupKey }}</span>
          <ul class="list-style-none">
            <li
              v-for="cssClass in groups[groupKey]"
              :key="cssClass"
              class="
                padding-bottom--2
                width-200
                cursor-pointer
              "
              :class="cssClass"
              @click="onClickCssClass(cssClass)"
            >
              {{ cssClass }}
            </li>
          </ul>
        </li>
      </ul>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { useClipboard } from '@vueuse/core'

const size = [
  'font-xsmall',
  'font-small',
  'font-base',
  'font-large',
  'h4',
  'h3',
  'h2',
  'h1',
]

const weight = [
  'font-light',
  'font-normal',
  'font-semibold',
  'font-bold',
]

const style = [
  'font-italic',
]

const align = [
  'text-left',
  'text-center',
  'text-right',
]

const transform = [
  'text-uppercase',
  'text-capitalize',
]

const textOverflow = [
  'text-overflow--ellispis',
]

const textDecoration = [
  'text-underline',
]

const link = [
  'link',
]

const whiteSpace = [
  'no-wrap',
  'pre-line',
  'white-space--wrap',
  'white-space--no-wrap',
  'white-space--pre-line',
]

const groups: Record<string, string[]> = {
  size,
  weight,
  style,
  align,
  transform,
  whiteSpace,
  textOverFlow: textOverflow,
  textDecoration,
  link,
}

function onClickCssClass(source: string) {
  const { copy, isSupported } = useClipboard({ source })

  copy(source)
  if (isSupported) {
    ElMessage.success(`Copied ${source}`)
  }
}
</script>

<style lang="scss" scoped>
.min-width {
  min-width: 120px;
}
.width-200 {
  width: 200px;
}
</style>

<docs lang="md">
## Text
  <div class="responsive-iframe-container">
    <iframe class="responsive-iframe" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FCmAQkyvJgicN6PHwf61DBZ%2F%25F0%259F%25A6%2584-Guidelines%3Ftype%3Ddesign%26node-id%3D659%253A521%26mode%3Ddev" allowfullscreen></iframe>
  </div>
</docs>
