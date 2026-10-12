<template>
  <div class="grid-documentation">
    <h2 class="section-title">
      Système CSS Grid Pégase
    </h2>
    <p class="intro">
      Classes utilitaires pour le système CSS Grid avec contrôle des colonnes, du flow et des spans.
      Testez les différentes configurations et cliquez pour copier les classes CSS.
    </p>

    <!-- Grid Controls -->
    <div class="section-controls">
      <div class="control-group">
        <label class="control-label">
          Colonnes :
          <select v-model="selectedCols" class="control-select">
            <option
              v-for="cols in gridColsList"
              :key="cols"
              :value="cols"
            >
              {{ cols }} colonnes
            </option>
          </select>
        </label>

        <label class="control-label">
          Direction :
          <select v-model="selectedFlow" class="control-select">
            <option
              v-for="flow in gridFlowList"
              :key="flow"
              :value="flow"
            >
              {{ flow }}
            </option>
          </select>
        </label>
      </div>
    </div>

    <!-- Basic Grid -->
    <div class="section-group">
      <h3 class="subsection-title">
        Grid de base
      </h3>
      <p class="subsection-description">
        Démonstration d'une grille simple avec contrôles interactifs pour les colonnes et la direction.
      </p>

      <div class="example-item">
        <div class="grid-demo-container">
          <div
            class="grid-container"
            :class="currentGridClasses"
          >
            <div
              v-for="n in itemCount"
              :key="n"
              class="grid-item basic"
            >
              {{ n - 1 }}
            </div>
          </div>
        </div>

        <div class="example-info">
          <div class="example-name">
            Grid {{ selectedCols }} colonnes - {{ selectedFlow }}
          </div>
          <div class="example-classes">
            <span
              v-for="cssClass in currentGridClasses"
              :key="cssClass"
              class="example-class"
            >
              .{{ cssClass }}
            </span>
          </div>
          <div class="example-description">
            Configuration de grille avec {{ selectedCols }} colonnes et direction {{ selectedFlow }}
          </div>

          <div class="copy-buttons">
            <button
              class="copy-btn"
              @click="copyToClipboard(currentGridClasses.join(' '))"
            >
              📋 Copier les classes
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Grid with Spans -->
    <div class="section-group">
      <h3 class="subsection-title">
        Grid avec spans de colonnes et lignes
      </h3>
      <p class="subsection-description">
        Exemples avec des éléments qui s'étendent sur plusieurs colonnes ou lignes.
      </p>

      <div class="example-item">
        <div class="grid-demo-container">
          <div
            class="grid-container"
            :class="currentGridClasses"
          >
            <div
              v-for="(item, index) in spanItems"
              :key="index"
              class="grid-item span-item"
              :class="item.cssClass"
            >
              <div class="item-content">
                {{ index }}
                <br>
                <span class="item-class">{{ item.cssClass }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="example-info">
          <div class="example-name">
            Grid avec spans
          </div>
          <div class="span-examples">
            <div
              v-for="(item, index) in spanItems"
              :key="index"
              class="span-example"
            >
              <span class="span-index">{{ index }}:</span>
              <code class="span-class">.{{ item.cssClass }}</code>
              <button
                class="copy-btn small"
                :title="`Copier .${item.cssClass}`"
                @click="copyToClipboard(item.cssClass)"
              >
                📋
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Responsive Grid -->
    <div class="section-group">
      <h3 class="subsection-title">
        Grid responsive avec breakpoints
      </h3>
      <p class="subsection-description">
        Exemple de grille qui s'adapte aux différentes tailles d'écran.
      </p>

      <div class="example-item">
        <div class="grid-demo-container">
          <div class="responsive-grid-container">
            <div
              v-for="n in itemCount"
              :key="n"
              class="grid-item responsive"
            >
              {{ n - 1 }}
            </div>
          </div>
        </div>

        <div class="example-info">
          <div class="example-name">
            Grid responsive
          </div>
          <div class="responsive-info">
            <div class="breakpoint-info">
              <strong>Breakpoints :</strong>
              <ul class="breakpoint-list">
                <li><code>&lt; 480px</code>: 1 colonne (xxs)</li>
                <li><code>480px - 768px</code>: 2 colonnes (xs)</li>
                <li><code>768px - 992px</code>: 3 colonnes (sm)</li>
                <li><code>≥ 992px</code>: 4 colonnes (md+)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Grid Properties Reference -->
    <div class="section-group">
      <h3 class="subsection-title">
        Référence des classes Grid
      </h3>
      <p class="subsection-description">
        Liste complète des classes CSS Grid disponibles.
      </p>

      <div class="reference-grid">
        <div class="reference-category">
          <h4 class="category-title">
            Colonnes
          </h4>
          <div class="reference-items">
            <div
              v-for="cols in gridColsList"
              :key="cols"
              class="reference-item"
              @click="copyToClipboard(`grid-cols--${cols}`)"
            >
              <code>.grid-cols--{{ cols }}</code>
              <span class="reference-description">{{ cols }} colonnes</span>
            </div>
          </div>
        </div>

        <div class="reference-category">
          <h4 class="category-title">
            Direction du flow
          </h4>
          <div class="reference-items">
            <div
              v-for="flow in gridFlowList"
              :key="flow"
              class="reference-item"
              @click="copyToClipboard(`grid-flow--${flow}`)"
            >
              <code>.grid-flow--{{ flow }}</code>
              <span class="reference-description">Direction {{ flow }}</span>
            </div>
          </div>
        </div>

        <div class="reference-category">
          <h4 class="category-title">
            Spans de colonnes
          </h4>
          <div class="reference-items">
            <div
              v-for="span in [2, 3, 4, 5, 6]"
              :key="span"
              class="reference-item"
              @click="copyToClipboard(`grid-col-span--${span}`)"
            >
              <code>.grid-col-span--{{ span }}</code>
              <span class="reference-description">Étend sur {{ span }} colonnes</span>
            </div>
          </div>
        </div>

        <div class="reference-category">
          <h4 class="category-title">
            Spans de lignes
          </h4>
          <div class="reference-items">
            <div
              v-for="span in [2, 3, 4]"
              :key="span"
              class="reference-item"
              @click="copyToClipboard(`grid-row-span--${span}`)"
            >
              <code>.grid-row-span--{{ span }}</code>
              <span class="reference-description">Étend sur {{ span }} lignes</span>
            </div>
          </div>
        </div>

        <div class="reference-category">
          <h4 class="category-title">
            Espacement
          </h4>
          <div class="reference-items">
            <div
              v-for="gap in [0, 1, 2, 3, 4]"
              :key="gap"
              class="reference-item"
              @click="copyToClipboard(`grid-gap--${gap}`)"
            >
              <code>.grid-gap--{{ gap }}</code>
              <span class="reference-description">Gap de {{ gap * 4 }}px</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCopyClipboard } from '../../utils/clipboard'

const selectedCols = ref(4)
const selectedFlow = ref('row')
const itemCount = 11

const gridColsList = [1, 2, 3, 4, 5, 6]
const gridFlowList = ['row', 'column']

const currentGridClasses = computed(() => [
  `grid-cols--${selectedCols.value}`,
  `grid-flow--${selectedFlow.value}`,
  'grid-gap--1',
])

const getCssClass = (index: number) => {
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

const spanItems = computed(() =>
  Array.from({ length: itemCount }, (_, index) => ({
    cssClass: getCssClass(index) || 'grid-item-default',
  })),
)

const copyToClipboard = async (text: string) => {
  await useCopyClipboard(`.${text}`)
}
</script>

<style scoped>
.grid-documentation {
  padding: 24px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--p-surface-basic-primary, #FFFFFF);
}

.section-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--p-text-basic-heading, #0E0F30);
  margin-bottom: 16px;
}

.intro {
  margin-bottom: 32px;
  color: var(--p-text-basic-body, #15171A);
  line-height: 1.6;
  font-size: 16px;
}

.section-controls {
  margin-bottom: 32px;
  padding: 20px;
  background: var( --p-surface-neutral-lighter);
  border-radius: 8px;
  border: 1px solid var(--p-stroke-neutral-lighter, #E0E6ED);
}

.control-group {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.control-label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: var(--p-text-basic-body, #15171A);
  font-weight: 500;
  min-width: 150px;
}

.control-select {
  padding: 8px 12px;
  border: 1px solid var(--p-stroke-neutral-neutral, #CDD1D4);
  border-radius: 6px;
  background: var(--p-surface-basic-primary, #FFFFFF);
  color: var(--p-text-basic-body, #15171A);
  font-size: 14px;
}

.section-group {
  margin-bottom: 48px;
}

.subsection-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--p-text-basic-heading, #0E0F30);
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--p-stroke-neutral-neutral, #CDD1D4);
}

.subsection-description {
  color: var(--p-text-basic-body, #15171A);
  margin-bottom: 24px;
  line-height: 1.5;
}

.example-item {
  border: 1px solid var(--p-stroke-neutral-neutral, #CDD1D4);
  border-radius: 8px;
  background: var(--p-surface-basic-primary, #FFFFFF);
  overflow: hidden;
}

.grid-demo-container {
  padding: 20px;
}

.grid-container {
  display: grid;
  gap: 4px;
  background: var( --p-surface-neutral-lighter);
  padding: 16px;
  border: 2px dashed var(--p-stroke-neutral-neutral, #CDD1D4);
  border-radius: 8px;
}

.responsive-grid-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
  background: var( --p-surface-neutral-lighter);
  padding: 16px;
  border: 2px dashed var(--p-stroke-neutral-neutral, #CDD1D4);
  border-radius: 8px;
  position: relative;
}

.responsive-grid-container::before {
  position: absolute;
  top: 8px;
  right: 8px;
  font-weight: bold;
  padding: 4px 8px;
  background: var(--p-surface-basic-primary, #FFFFFF);
  border-radius: 4px;
  font-size: 12px;
  color: var(--p-text-basic-body, #15171A);
  content: 'md+';
}

.grid-item {
  background: var(--p-surface-information-primary-light, #E3F2FD);
  border: 1px solid var(--p-stroke-information-primary, #1976D2);
  border-radius: 4px;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: var(--p-text-basic-information-primary, #126778);
  font-size: 14px;
  min-height: 40px;
}

.grid-item.span-item {
  background: var(--p-surface-success-primary, #E8F5E8);
  border-color: var(--p-stroke-basic-success, #00B800);
  color: var(--p-text-basic-success, #0A710B);
}

.grid-item.responsive {
  background: var(--p-surface-warning-primary, #FFF8E1);
  border-color: var(--p-stroke-basic-warning, #FFA500);
  color: var(--p-text-basic-warning, #BB5502);
}

.item-content {
  text-align: center;
}

.item-class {
  font-size: 10px;
  opacity: 0.8;
}

.example-info {
  padding: 20px;
  border-top: 1px solid var(--p-stroke-neutral-lighter, #E0E6ED);
}

.example-name {
  font-weight: 700;
  color: var(--p-text-basic-heading, #0E0F30);
  margin-bottom: 12px;
  font-size: 18px;
}

.example-classes {
  margin-bottom: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.example-class {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  color: var(--p-text-basic-highlight, #093C32);
  font-size: 13px;
  background: rgba(9, 60, 50, 0.1);
  padding: 4px 8px;
  border-radius: 4px;
}

.example-description {
  color: var(--p-text-basic-body, #15171A);
  margin-bottom: 16px;
  line-height: 1.4;
}

.span-examples {
  margin-bottom: 16px;
}

.span-example {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  padding: 8px;
  background: var( --p-surface-neutral-lighter);
  border-radius: 4px;
}

.span-index {
  font-weight: 600;
  color: var(--p-text-basic-body, #15171A);
  min-width: 20px;
}

.span-class {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  color: var(--p-text-basic-highlight, #093C32);
  background: rgba(9, 60, 50, 0.1);
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
  flex: 1;
}

.responsive-info {
  margin-bottom: 16px;
}

.breakpoint-info strong {
  color: var(--p-text-basic-heading, #0E0F30);
}

.breakpoint-list {
  list-style: none;
  padding: 0;
  margin: 8px 0;
}

.breakpoint-list li {
  padding: 4px 0;
  color: var(--p-text-basic-body, #15171A);
}

.breakpoint-list code {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  background: var( --p-surface-neutral-lighter);
  padding: 2px 4px;
  border-radius: 3px;
  color: var(--p-text-basic-information-primary, #126778);
}

.copy-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.copy-btn {
  padding: 8px 12px;
  font-size: 12px;
  border: 1px solid var(--p-stroke-neutral-default-primary, #ADB5BD);
  background: var(--p-surface-basic-primary, #FFFFFF);
  color: var(--p-text-basic-body, #15171A);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.copy-btn.small {
  padding: 4px 8px;
  font-size: 10px;
  min-width: 32px;
}

.copy-btn:hover {
  background: var(--p-surface-state-hover, #E7FFFF);
  border-color: var(--p-stroke-basic-hover, #0C4F41);
}

.copy-btn:active {
  background: var(--p-surface-state-press, #ADE1D6);
}

/* Reference Grid */
.reference-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.reference-category {
  border: 1px solid var(--p-stroke-neutral-lighter, #E0E6ED);
  border-radius: 8px;
  padding: 16px;
  background: var( --p-surface-neutral-lighter);
}

.category-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--p-text-basic-heading, #0E0F30);
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--p-stroke-neutral-lighter, #E0E6ED);
}

.reference-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.reference-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: var(--p-surface-basic-primary, #FFFFFF);
  border: 1px solid var(--p-stroke-neutral-lighter, #E0E6ED);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.reference-item:hover {
  border-color: var(--p-stroke-basic-hover, #0C4F41);
  background: var(--p-surface-state-hover, #E7FFFF);
}

.reference-item code {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  color: var(--p-text-basic-highlight, #093C32);
  font-size: 12px;
  font-weight: 600;
}

.reference-description {
  color: var(--p-text-neutral-neutral, #889BA8);
  font-size: 12px;
}

/* Responsive Grid CSS */
@media only screen and (max-width: 480px) {
  .responsive-grid-container {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
  .responsive-grid-container::before {
    content: 'xxs';
  }
}

@media only screen and (min-width: 480px) and (max-width: 768px) {
  .responsive-grid-container {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .responsive-grid-container::before {
    content: 'xs';
  }
}

@media only screen and (min-width: 768px) and (max-width: 992px) {
  .responsive-grid-container {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .responsive-grid-container::before {
    content: 'sm';
  }
}

@media (max-width: 768px) {
  .control-group {
    flex-direction: column;
    gap: 16px;
  }

  .reference-grid {
    grid-template-columns: 1fr;
  }

  .span-example {
    flex-wrap: wrap;
  }

  .grid-documentation {
    padding: 16px;
  }
}
</style>
