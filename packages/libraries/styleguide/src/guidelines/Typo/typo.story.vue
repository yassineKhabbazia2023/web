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
      v-for="groupKey in Object.keys(groups)"
      :key="groupKey"
      :title="groupKey"
      class="flex"
    >
      <ul class="list-style-none">
        <li
          v-for="cssClass in groups[groupKey]"
          :key="cssClass"
          class="
            flex
            flex-gap--2
            padding-bottom--2
            cursor-pointer
          "
          @click="onClickCssClass(cssClass)"
        >
          <div
            class="
              flex--basis-30
              flex--grow-0
              flex--shrink-0
            "
          >
            {{ cssClass }}
          </div>
          <div :class="cssClass">
            {{ loremIpsum }}
          </div>
        </li>
      </ul>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { useClipboard } from '@vueuse/core'

const loremIpsum = `Dans une petite ville de l’Aveyron ou des Pyrénées,
le moindre incident eût été rendu décisif par le feu du climat.`
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
  'white-space--no-wrap',
  'white-space--pre-line',
  'white-space--wrap',
  'white-space--no-wrap',
  'white-space--pre-line',
]

const textWrap = [
  'text-wrap--balance',
  'text-wrap--nowrap',
  'text-wrap--stable',
  'text-wrap--wrap',
]

const wordBreak = [
  'word-break--normal text-wrap--wrap',
  'word-break--break-all text-wrap--wrap',
  'word-break--keep-all text-wrap--wrap',
  'word-break--break-word text-wrap--wrap',
  'word-break--initial text-wrap--wrap',
  'word-break--inherit text-wrap--wrap',
]

const groups: Record<string, string[]> = {
  size,
  weight,
  style,
  align,
  transform,
  whiteSpace,
  textWrap,
  wordBreak,
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
