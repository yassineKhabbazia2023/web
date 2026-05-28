<template>
  <div class="spacing-documentation">
    <h2 class="section-title">
      Système d'espacement Pégase
    </h2>
    <p class="intro">
      <strong>L'espacement apporte du rythme et de la fluidité à l'interface.</strong>
      Nos tokens d'espacement sont basés sur la règle de 4, avec 16px comme unité de base.
      Cliquez sur les exemples pour copier les classes CSS dans votre presse-papier.
    </p>

    <!-- Spacing Types -->
    <div class="section-group">
      <h3 class="subsection-title">
        Types d'espacement
      </h3>
      <p class="subsection-description">
        Différents types de classes d'espacement disponibles avec leurs syntaxes.
      </p>

      <div class="spacing-types-container">
        <table class="spacing-types-table">
          <thead>
            <tr>
              <th>Type de l'espacement + (token)</th>
              <th>Résultat</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="type in spacingTypes" :key="type.class">
              <td><code>{{ type.class }}</code></td>
              <td>{{ type.result }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Spacing Values -->
    <div class="section-group">
      <h3 class="subsection-title">
        Valeurs d'espacement
      </h3>
      <p class="subsection-description">
        Tokens d'espacement avec leurs valeurs correspondantes et usages recommandés.
      </p>

      <div class="spacing-values-container">
        <table class="spacing-values-table">
          <thead>
            <tr>
              <th>Nom de l'espacement (token)</th>
              <th>Size (rem)</th>
              <th>Size (px)</th>
              <th>Exemple d'utilisation</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="value in spacingValues" :key="value.token">
              <td><strong>{{ value.token }}</strong></td>
              <td>{{ value.rem }}</td>
              <td>{{ value.px }}</td>
              <td>{{ value.usage }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Interactive Examples -->
    <div class="section-group">
      <h3 class="subsection-title">
        Exemples interactifs
      </h3>
      <p class="subsection-description">
        Visualisez et testez les différentes classes d'espacement.
      </p>

      <div
        v-for="group in spacingGroups"
        :key="group.name"
        class="spacing-group"
      >
        <h4 class="group-title">
          {{ group.displayName }}
        </h4>
        <div class="examples-grid">
          <div
            v-for="cssClass in group.cssClasses"
            :key="cssClass.className"
            class="example-item"
            @click="copyToClipboard(cssClass.className)"
          >
            <div class="example-preview">
              <div
                class="spacing-container"
                :class="{
                  [cssClass.className]: group.applyToChild === undefined
                }"
              >
                <div
                  v-for="(subElement, indexItem) in group.subList"
                  :key="indexItem"
                  class="spacing-element"
                  :class="[
                    subElement,
                    {
                      [cssClass.className]: group.applyToChild === 1 || group.applyToChild === indexItem,
                      'spacing-highlight': group.applyToChild === 1 || group.applyToChild === indexItem
                    }
                  ]"
                />
              </div>
            </div>

            <div class="example-info">
              <div class="example-name">
                {{ cssClass.name }}
              </div>
              <div class="example-class">
                .{{ cssClass.className }}
              </div>
              <div class="example-description">
                {{ cssClass.description }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Dimensions Section -->
    <div class="section-group">
      <h3 class="subsection-title">
        Dimensions
      </h3>
      <p class="subsection-description">
        Classes utilitaires pour contrôler les dimensions minimales.
      </p>

      <div class="dimensions-table-container">
        <table class="dimensions-table">
          <thead>
            <tr>
              <th>Type de l'espacement + (token)</th>
              <th>Résultat</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="dimension in dimensionTypes" :key="dimension.class">
              <td><code>{{ dimension.class }}</code></td>
              <td>{{ dimension.result }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="examples-grid">
        <div
          v-for="minWidthClass in minWidthClasses"
          :key="minWidthClass.className"
          class="example-item"
          @click="copyToClipboard(minWidthClass.className)"
        >
          <div class="example-preview">
            <div class="spacing-container">
              <div
                class="dimension-element"
                :class="[minWidthClass.className, 'height-40']"
              >
                {{ minWidthClass.label }}
              </div>
            </div>
          </div>

          <div class="example-info">
            <div class="example-name">
              {{ minWidthClass.name }}
            </div>
            <div class="example-class">
              .{{ minWidthClass.className }}
            </div>
            <div class="example-description">
              {{ minWidthClass.description }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCopyClipboard } from '../../utils/clipboard'

// Helper functions from original implementation
const stringToClassList = (prefix: string, suffixes: string) => {
  return suffixes
    .split(',')
    .map(suffix => ({
      className: `${prefix}${suffix.trim()}`,
      name: suffix.trim().replace(/^--/, '').replace(/-/g, ' '),
      description: getSpacingDescription(prefix, suffix.trim()),
    }))
}

const numbersToClassList = (prefix: string, lastIndex: number, firstIndex = 0) => {
  const suffixes = Array.from(Array(lastIndex + 1 - firstIndex).keys())
  return suffixes
    .map(suffix => ({
      className: `${prefix}${suffix + firstIndex}`,
      name: `${prefix.replace(/--$/, '').replace(/-/g, ' ')} ${suffix + firstIndex}`,
      description: getSpacingDescription(prefix, (suffix + firstIndex).toString()),
    }))
}

const getSpacingDescription = (prefix: string, value: string) => {
  if (prefix.includes('margin') && value.includes('auto')) {
    return 'Marge automatique centrée'
  }
  if (prefix.includes('margin') && value.includes('negative')) {
    return 'Marge négative pour repositionnement'
  }
  if (prefix.includes('margin')) {
    return `Marge de ${parseFloat(value) * 4}px`
  }
  if (prefix.includes('padding')) {
    return `Padding de ${parseFloat(value) * 4}px`
  }
  if (prefix.includes('min-width')) {
    return `Largeur minimale de ${parseFloat(value) * 4}px`
  }
  if (prefix.includes('height')) {
    return `Hauteur de ${parseFloat(value) * 4}px`
  }
  return `Applique ${prefix}${value}`
}

// Sub lists for demo elements
const subListOneItem = ['height-40 width-40']
const subListTwoItems = ['height-40 width-40', 'height-40 width-40']

// Spacing types table data
const spacingTypes = [
  { class: '.margin--0', result: 'margin: 0;' },
  { class: '.margin--auto', result: 'margin: auto;' },
  { class: '.margin-{position}--auto', result: 'margin-{position}: auto;' },
  { class: '.margin--{token}', result: 'margin: 0.4rem * {token};' },
  { class: '.margin-{position}--{token}', result: 'margin-{position}: 0.4rem * {token};' },
  { class: '.padding--0', result: 'padding: 0;' },
  { class: '.padding--{token}', result: 'padding: 0.4rem * {token};' },
  { class: '.padding-{position}--{token}', result: 'padding-{position}: 0.4rem * {token};' },
  { class: '.flex-gap--{token}', result: 'gap: 0.4rem * {token}; (token * 4px)' },
  { class: '.flex-gap--half', result: 'gap: 0.2rem; (2px)' },
]

// Spacing values table data
const spacingValues = [
  { token: '1', rem: '0.4rem', px: '4px', usage: 'Margin entre icône et texte' },
  { token: '2', rem: '0.8rem', px: '8px', usage: 'Margin entre label et input' },
  { token: '3', rem: '1.2rem', px: '12px', usage: 'Padding dans les cards ou tableaux' },
  { token: '4', rem: '1.6rem', px: '16px', usage: 'Spacing de base - Margin entre les atomes et molécules' },
  { token: '5', rem: '2rem', px: '20px', usage: 'Margin entre les molécules, les organismes et les sections' },
  { token: '6', rem: '2.4rem', px: '24px', usage: 'Margin entre les molécules, les organismes et les sections' },
  { token: '8', rem: '3.2rem', px: '32px', usage: 'Margin entre les organismes et les sections' },
  { token: '12', rem: '4.8rem', px: '48px', usage: 'Margin entre les organismes et les sections' },
  { token: '16', rem: '6.4rem', px: '64px', usage: 'Margin entre les organismes et les sections' },
  { token: '32', rem: '12.8rem', px: '128px', usage: 'Margin entre les organismes et les sections' },
]

// Dimensions types
const dimensionTypes = [
  { class: '.min-width--{token}', result: 'min-width: {token} * 0.25rem;' },
  { class: '.min-width--full', result: 'min-width: 100%;' },
]

// Generate class lists
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
const marginNegativeX = numbersToClassList('margin-negative-x--', 12)
const marginNegativeY = numbersToClassList('margin-negative-y--', 12)

const minWidthClasses = [
  { className: 'min-width--full', name: 'Min Width Full', label: 'FULL', description: 'Largeur minimale 100%' },
  ...minWidth.slice(0, 6).map(item => ({
    ...item,
    label: `MW${item.className.split('--')[1]}`,
  })),
]

// Group all spacing classes
const spacingGroups = [
  {
    name: 'marginAuto',
    displayName: 'Margins automatiques',
    cssClasses: marginAuto,
    subList: subListOneItem,
    applyToChild: 0,
  },
  {
    name: 'margin',
    displayName: 'Margins',
    cssClasses: margin.slice(0, 6),
    subList: subListOneItem,
    applyToChild: 0,
  },
  {
    name: 'marginDirectional',
    displayName: 'Margins directionnelles',
    cssClasses: [
      ...marginTop.slice(0, 3),
      ...marginBottom.slice(0, 3),
      ...marginLeft.slice(0, 3),
      ...marginRight.slice(0, 3),
    ],
    subList: subListOneItem,
    applyToChild: 0,
  },
  {
    name: 'marginAxis',
    displayName: 'Margins par axes',
    cssClasses: [
      ...marginX.slice(0, 4),
      ...marginY.slice(0, 4),
    ],
    subList: subListTwoItems,
    applyToChild: 0,
  },
  {
    name: 'padding',
    displayName: 'Paddings',
    cssClasses: padding.slice(0, 6),
    subList: subListOneItem,
  },
  {
    name: 'paddingDirectional',
    displayName: 'Paddings directionnels',
    cssClasses: [
      ...paddingTop.slice(0, 3),
      ...paddingBottom.slice(0, 3),
      ...paddingLeft.slice(0, 3),
      ...paddingRight.slice(0, 3),
    ],
    subList: subListOneItem,
  },
  {
    name: 'paddingAxis',
    displayName: 'Paddings par axes',
    cssClasses: [
      ...paddingX.slice(0, 4),
      ...paddingY.slice(0, 4),
    ],
    subList: subListOneItem,
  },
  {
    name: 'marginNegative',
    displayName: 'Margins négatives',
    cssClasses: [
      ...marginNegativeTop.slice(0, 2),
      ...marginNegativeBottom.slice(0, 2),
      ...marginNegativeX.slice(0, 2),
      ...marginNegativeY.slice(0, 2),
    ],
    subList: subListTwoItems,
    applyToChild: 1,
  },
]

const copyToClipboard = async (className: string) => {
  await useCopyClipboard(`.${className}`)
}
</script>

<style scoped>
.spacing-documentation {
  padding: 24px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--p-surface-primary, #FFFFFF);
}

.section-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--p-text-heading, #0E0F30);
  margin-bottom: 16px;
}

.intro {
  margin-bottom: 32px;
  color: var(--p-text-body, #15171A);
  line-height: 1.6;
  font-size: 16px;
}

.section-group {
  margin-bottom: 48px;
}

.subsection-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--p-text-heading, #0E0F30);
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--p-stroke-neutral, #CDD1D4);
}

.subsection-description {
  color: var(--p-text-body, #15171A);
  margin-bottom: 24px;
  line-height: 1.5;
}

/* Tables */
.spacing-types-container,
.spacing-values-container,
.dimensions-table-container {
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid var(--p-stroke-neutral, #CDD1D4);
  margin-bottom: 32px;
}

.spacing-types-table,
.spacing-values-table,
.dimensions-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--p-surface-primary, #FFFFFF);
}

.spacing-types-table thead,
.spacing-values-table thead,
.dimensions-table thead {
  background: var( --p-surface-neutral-lighter);
  color: var(--p-text-neutral, #889BA8);
}

.spacing-types-table th,
.spacing-values-table th,
.dimensions-table th {
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid var(--p-stroke-neutral-lighter, #E0E6ED);
}

.spacing-types-table td,
.spacing-values-table td,
.dimensions-table td {
  padding: 16px;
  border-bottom: 1px solid var(--p-stroke-neutral-lighter, #E0E6ED);
  color: var(--p-text-body, #15171A);
  font-size: 14px;
  line-height: 1.4;
}

.spacing-types-table tr:last-child td,
.spacing-values-table tr:last-child td,
.dimensions-table tr:last-child td {
  border-bottom: none;
}

.spacing-types-table code,
.spacing-values-table code,
.dimensions-table code {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  background: var( --p-surface-neutral-lighter);
  padding: 4px 8px;
  border-radius: 4px;
  color: var(--p-text-highlight, #093C32);
  font-size: 13px;
}

/* Spacing Groups */
.spacing-group {
  margin-bottom: 40px;
}

.group-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--p-text-heading, #0E0F30);
  margin-bottom: 20px;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--p-stroke-neutral-lighter, #E0E6ED);
}

.examples-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.example-item {
  border: 1px solid var(--p-stroke-neutral, #CDD1D4);
  border-radius: 8px;
  background: var(--p-surface-primary, #FFFFFF);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
}

.example-item:hover {
  border-color: var(--p-stroke-hover, #0C4F41);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.example-preview {
  padding: 16px;
  background: var( --p-surface-neutral-lighter);
}

.spacing-container {
  display: flex;
  background: var(--p-surface-primary, #FFFFFF);
  border: 2px dashed var(--p-stroke-neutral, #CDD1D4);
  border-radius: 6px;
  min-height: 80px;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.spacing-element {
  background: var(--p-surface-information-primary, #E3F2FD);
  border: 1px solid var(--p-stroke-information-primary, #1976D2);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--p-text-information-primary, #126778);
  font-weight: 600;
  font-size: 12px;
}

.spacing-element.spacing-highlight {
  background: var(--p-surface-success-primary, #E8F5E8) !important;
  border-color: var(--p-stroke-success, #00B800) !important;
  color: var(--p-text-success, #0A710B) !important;
}

.dimension-element {
  background: var(--p-surface-warning-primary, #FFF8E1);
  border: 1px solid var(--p-stroke-warning, #FFA500);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--p-text-warning, #BB5502);
  font-weight: 600;
  font-size: 12px;
  padding: 8px;
}

.example-info {
  padding: 16px;
  border-top: 1px solid var(--p-stroke-neutral-lighter, #E0E6ED);
}

.example-name {
  font-weight: 700;
  color: var(--p-text-heading, #0E0F30);
  margin-bottom: 8px;
  font-size: 16px;
  text-transform: capitalize;
}

.example-class {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  color: var(--p-text-highlight, #093C32);
  margin-bottom: 8px;
  font-size: 13px;
  background: rgba(9, 60, 50, 0.1);
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
}

.example-description {
  color: var(--p-text-body, #15171A);
  line-height: 1.4;
  font-size: 14px;
}

/* Utility classes for demo */
.height-40 {
  height: 40px;
}

.width-40 {
  width: 40px;
}

.height-40.width-40 {
  min-width: 40px;
  min-height: 40px;
}

@media (max-width: 768px) {
  .examples-grid {
    grid-template-columns: 1fr;
  }

  .spacing-documentation {
    padding: 16px;
  }
}
</style>
