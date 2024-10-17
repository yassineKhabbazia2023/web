<template>
  <Story
    title="1. Basic/Spacing"
    icon="radix-icons:margin"
    :layout="{
      type: 'single'
    }"
  >
    <Variant title="Basic Usage">
      <p class="h4">
        Types d’espacement
      </p>

      <table class="table-spacing" aria-label="Types d'espacement">
        <thead>
          <tr>
            <th>Type de l’espacement + (token)</th>
            <th>Résultat</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>.margin--0</td>
            <td>margin: 0;</td>
          </tr>
          <tr>
            <td>.margin--auto</td>
            <td>0.50rem</td>
          </tr>
          <tr>
            <td>.margin-{position}--auto</td>
            <td>margin-{position}: auto;</td>
          </tr>
          <tr>
            <td>.margin--{token}</td>
            <td>margin: 0.4rem * {token};</td>
          </tr>
          <tr>
            <td>.margin-{position}--{token}</td>
            <td>margin-{position}: 0.4rem * {token};</td>
          </tr>
          <tr>
            <td>.padding--0</td>
            <td>padding: 0;</td>
          </tr>
          <tr>
            <td>.padding--{token}</td>
            <td>padding: 0.4rem * {token};</td>
          </tr>
          <tr>
            <td>.padding-{position}--{token}</td>
            <td>padding-{position}: 0.4rem * {token};</td>
          </tr>
          <tr>
            <td>.flex-gap--{token}</td>
            <td>gap: 0.4rem * {token};</td>
          </tr>
        </tbody>
      </table>

      <p class="h4">
        Valeurs d’espacement
      </p>

      <table class="table-spacing" aria-label="Valeurs d'espacement">
        <thead>
          <tr>
            <th>Nom de l’espacement (token)</th>
            <th>Size (rem)</th>
            <th>Exemple d’utilisation</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>0.4rem</td>
            <td>Margin entre icône et texte</td>
          </tr>
          <tr>
            <td>2</td>
            <td>0.50rem</td>
            <td>Margin entre label et input</td>
          </tr>
          <tr>
            <td>3</td>
            <td>0.75rem</td>
            <td>Padding dans les cards ou tableaux</td>
          </tr>
          <tr>
            <td>4</td>
            <td>1rem</td>
            <td><strong>Spacing de base</strong>. Margin entre les atomes et molécules</td>
          </tr>
          <tr>
            <td>5</td>
            <td>1.25rem</td>
            <td>Margin entre les molécules, les organismes et les sections</td>
          </tr>
          <tr>
            <td>6</td>
            <td>1.50rem</td>
            <td>Margin entre les molécules, les organismes et les sections</td>
          </tr>
          <tr>
            <td>8</td>
            <td>2rem</td>
            <td>Margin entre les organismes et les sections</td>
          </tr>
          <tr>
            <td>12</td>
            <td>3rem</td>
            <td>Margin entre les organismes et les sections</td>
          </tr>
          <tr>
            <td>16</td>
            <td>4rem</td>
            <td>Margin entre les organismes et les sections</td>
          </tr>
          <tr>
            <td>32</td>
            <td>8rem</td>
            <td>Margin entre les organismes et les sections</td>
          </tr>
        </tbody>
      </table>
      <p class="h4">
        Dimensions
      </p>

      <table class="table-spacing" aria-label="Types d'espacement">
        <thead>
          <tr>
            <th>Type de l’espacement + (token)</th>
            <th>Résultat</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>.min-width--{token}</td>
            <td>min-width: {token} * 0.25;</td>
          </tr>
        </tbody>
      </table>
    </Variant>
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
          @click="onClickCssClass(cssClass)"
        >
          <div>
            {{ cssClass }}
          </div>
          <div
            class="
              flex
              bg--neutral-gray-100
            "
            :class="{
              [cssClass]: group.applyToChild === undefined,
            }"
          >
            <div
              v-for="(subElement, indexItem) in group.subList"
              :key="indexItem"
              class="
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
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { stringToClassList, numbersToClassList, onClickCssClass } from '@/utils/histoireHelpers'

const subListOneItem = ['40'].map((size) => `height-${size} width-${size}`)
const subListTwoItems = ['40', '40'].map((size) => `height-${size} width-${size}`)
const subListNoSize = ['40'].map((size) => `height-${size}`)

const autoAttributes = '--auto,-top--auto,-bottom--auto,-right--auto,-left--auto,-x--auto,-y--auto'

const marginAuto = stringToClassList('margin', autoAttributes)
const minWidth = numbersToClassList('min-width--', 12)

const margin = numbersToClassList('margin--', 12)
const marginTop = numbersToClassList('margin-top--', 12)
const marginBottom = numbersToClassList('margin-bottom--', 12)
const marginLeft = numbersToClassList('margin-left--', 12)
const marginRight = numbersToClassList('margin-right--', 12)
const marginX = numbersToClassList('margin-x--', 12)
const marginY = numbersToClassList('margin-y--', 12)

const padding = numbersToClassList('padding--', 12)
const paddingTop = numbersToClassList('padding-top--', 12)
const paddingBottom = numbersToClassList('padding-bottom--', 12)
const paddingLeft = numbersToClassList('padding-left--', 12)
const paddingRight = numbersToClassList('padding-right--', 12)
const paddingX = numbersToClassList('padding-x--', 12)
const paddingY = numbersToClassList('padding-y--', 12)

const marginNegativeTop = numbersToClassList('margin-negative-top--', 12)
const marginNegativeBottom = numbersToClassList('margin-negative-bottom--', 12)
const marginNegativeLeft = numbersToClassList('margin-negative-left--', 12)
const marginNegativeRight = numbersToClassList('margin-negative-right--', 12)
const marginNegativeX = numbersToClassList('margin-negative-x--', 12)
const marginNegativeY = numbersToClassList('margin-negative-y--', 12)

type Group = {
  name: string
  cssClasses: string[]
  subList: string[]
  applyToChild?: number | 'all'
}

const groups: Group[] = [{
  name: 'marginAuto',
  cssClasses: marginAuto,
  subList: subListOneItem,
  applyToChild: 0,
}, {
  name: 'minWidth',
  cssClasses: minWidth,
  subList: subListNoSize,
  applyToChild: 0,
}, {
  name: 'margin',
  cssClasses: margin,
  subList: subListOneItem,
  applyToChild: 0,
}, {
  name: 'marginTop',
  cssClasses: marginTop,
  subList: subListOneItem,
  applyToChild: 0,
}, {
  name: 'marginBottom',
  cssClasses: marginBottom,
  subList: subListOneItem,
  applyToChild: 0,
}, {
  name: 'marginLeft',
  cssClasses: marginLeft,
  subList: subListOneItem,
  applyToChild: 0,
}, {
  name: 'marginRight',
  cssClasses: marginRight,
  subList: subListTwoItems,
  applyToChild: 0,
}, {
  name: 'marginX',
  cssClasses: marginX,
  subList: subListTwoItems,
  applyToChild: 0,
}, {
  name: 'marginY',
  cssClasses: marginY,
  subList: subListTwoItems,
  applyToChild: 0,
}, {
  name: 'padding',
  cssClasses: padding,
  subList: subListOneItem,
}, {
  name: 'paddingTop',
  cssClasses: paddingTop,
  subList: subListOneItem,
}, {
  name: 'paddingBottom',
  cssClasses: paddingBottom,
  subList: subListOneItem,
}, {
  name: 'paddingLeft',
  cssClasses: paddingLeft,
  subList: subListOneItem,
}, {
  name: 'paddingRight',
  cssClasses: paddingRight,
  subList: subListOneItem,
}, {
  name: 'paddingX',
  cssClasses: paddingX,
  subList: subListOneItem,
}, {
  name: 'paddingY',
  cssClasses: paddingY,
  subList: subListOneItem,
}, {
  name: 'marginNegativeTop',
  cssClasses: marginNegativeTop,
  subList: subListTwoItems,
  applyToChild: 1,
}, {
  name: 'marginNegativeBottom',
  cssClasses: marginNegativeBottom,
  subList: subListTwoItems,
  applyToChild: 1,
}, {
  name: 'marginNegativeLeft',
  cssClasses: marginNegativeLeft,
  subList: subListTwoItems,
  applyToChild: 1,
}, {
  name: 'marginNegativeRight',
  cssClasses: marginNegativeRight,
  subList: subListTwoItems,
  applyToChild: 0,
}, {
  name: 'marginNegativeX',
  cssClasses: marginNegativeX,
  subList: subListTwoItems,
  applyToChild: 1,
}, {
  name: 'marginNegativeY',
  cssClasses: marginNegativeY,
  subList: subListTwoItems,
  applyToChild: 1,
}]

</script>

<style lang="scss">
.table-spacing {
  width: 100%;
  border: 0;
  border-collapse: collapse;

  thead {
    background: var(--el-color-neutral-gray-50);
    color: var(--el-color-neutral-gray-500);
    border-bottom: 1px solid var(--el-color-neutral-gray-100);
  }

  th {
    padding: 11px 16px;
    text-align: left;
    font-weight: 400;
    font-size: 12px;
    line-height: 18px;

    &:first-child {
      border-top-left-radius: 8px;
    }

    &:last-child {
      border-top-right-radius: 8px;
    }
  }

  td {
    padding: 12px 16px;
    border-bottom: 1px solid var(--el-color-neutral-gray-100);
    color: var(--el-color-neutral-gray-900);
    font-weight: 400;
    font-size: 14px;
    line-height: 120%;
  }
}
.min-width {
  min-width: 120px;
}
.width-500 {
  width: 500px;
}
.height-40 {
  height: 40px;
}
.width-40 {
  width: 40px;
}

.darker {
  background-color: var(--el-color-persian-900) !important;
  border: 1px solid var(--el-color-persian-900);
}
</style>
<docs lang="md">
## Spacing
  <div class="container">
      <p><strong>L'espacement apporte du rythme et de la fluidité à l'interface.</strong>
  Nos tokens d'espacement sont basés sur la règle de 4, avec 16px comme unité de base.
  L'espacement peut être utilisé via les paddings et la margins dans les composants web et mobile.
      <br>
  La plupart des mesures s'alignent sur une grille de base 8/12/16 appliquée,
  c'est notre unité de base pour mobile, tablette et laptop.
  Les composants plus petits, tels que les icônes et les types, peuvent s'aligner
  sur une grille de base 4.
      <br>
  Ces unités de base nous aideront à maintenir la cohérence de la conception et à
  améliorer la communication entre les designers et les développeurs. Nous avons
  choisi une unité 8 car la plupart des tailles d'écran sont divisibles par 4 et 4
  lui-même est également un nombre facilement divisible.</p>
  </div>
  <div class="reponsive-iframe-container">
  <iframe class="responsive-iframe" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FCmAQkyvJgicN6PHwf61DBZ%2F%25F0%259F%25A6%2584-Guidelines%3Ftype%3Ddesign%26node-id%3D87%253A2427%26mode%3Ddev" allowfullscreen></iframe>
</div>
</docs>
