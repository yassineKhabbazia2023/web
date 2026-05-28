<template>
  <div class="layout-documentation">
    <h2 class="section-title">
      Système de Layout Pégase
    </h2>
    <p class="intro">
      Système de mise en page basé sur une grille et des tokens d'espacement standardisés.
      Comprend les valeurs d'espacement, breakpoints et composants de layout avec contrôles interactifs.
    </p>

    <!-- Spacing Values -->
    <div class="section-group">
      <h3 class="subsection-title">
        Valeurs d'espacement
      </h3>
      <p class="subsection-description">
        Tokens d'espacement basés sur la règle de 4, avec 16px comme unité de base.
      </p>

      <div class="spacing-table-container">
        <table class="spacing-table">
          <thead>
            <tr>
              <th>Size (px)</th>
              <th>Size (rem)</th>
              <th>Exemple d'utilisation</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="spacing in spacingValues" :key="spacing.px">
              <td><strong>{{ spacing.px }}</strong></td>
              <td>{{ spacing.rem }}</td>
              <td>{{ spacing.usage }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Breakpoints -->
    <div class="section-group">
      <h3 class="subsection-title">
        Breakpoints
      </h3>
      <p class="subsection-description">
        <strong>"Utiliser une mise en page de 100% de largeur est le meilleur moyen d'avoir une mise en page inadaptée à 100%."</strong>
        <br><br>
        C'est pourquoi nous préférons concevoir pour plusieurs points d'arrêt au lieu des 2 points d'arrêt actuels (à partir de 801px).
        Pour éviter d'avoir trop d'espaces ou des phrases trop longues sur les grands écrans.
      </p>

      <div class="breakpoints-table-container">
        <table class="breakpoints-table">
          <thead>
            <tr>
              <th>Nom du breakpoint</th>
              <th>Device</th>
              <th>Size (px)</th>
              <th>Columns</th>
              <th>Gutter</th>
              <th>Margin</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="breakpoint in breakpoints" :key="breakpoint.name">
              <td><code>{{ breakpoint.name }}</code></td>
              <td>{{ breakpoint.device }}</td>
              <td><strong>{{ breakpoint.size }}</strong></td>
              <td>{{ breakpoint.columns }}</td>
              <td>{{ breakpoint.gutter }}</td>
              <td>{{ breakpoint.margin }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Interactive Layout Demo -->
    <div class="section-group">
      <h3 class="subsection-title">
        Démo interactive du système de colonnes
      </h3>
      <p class="subsection-description">
        Testez les différents paramètres de layout avec les composants PRow et PCol.
      </p>

      <div class="layout-demo-container">
        <div class="demo-controls">
          <div class="control-row">
            <label class="control-label">
              Gutter:
              <input
                v-model.number="layoutControls.gutter"
                type="range"
                :min="0"
                :max="60"
                class="control-slider"
              >
              <span class="control-value">{{ layoutControls.gutter }}px</span>
            </label>

            <label class="control-label">
              Span:
              <input
                v-model.number="layoutControls.span"
                type="range"
                :min="0"
                :max="24"
                class="control-slider"
              >
              <span class="control-value">{{ layoutControls.span }}</span>
            </label>
          </div>

          <div class="control-row">
            <label class="control-label">
              Offset:
              <input
                v-model.number="layoutControls.offset"
                type="range"
                :min="0"
                :max="24"
                class="control-slider"
              >
              <span class="control-value">{{ layoutControls.offset }}</span>
            </label>

            <label class="control-label">
              Push:
              <input
                v-model.number="layoutControls.push"
                type="range"
                :min="0"
                :max="24"
                class="control-slider"
              >
              <span class="control-value">{{ layoutControls.push }}</span>
            </label>
          </div>

          <div class="control-row">
            <label class="control-label">
              Pull:
              <input
                v-model.number="layoutControls.pull"
                type="range"
                :min="0"
                :max="24"
                class="control-slider"
              >
              <span class="control-value">{{ layoutControls.pull }}</span>
            </label>

            <label class="control-label">
              Justify:
              <select v-model="layoutControls.justify" class="control-select">
                <option
                  v-for="option in justifyOptions"
                  :key="option"
                  :value="option"
                >
                  {{ option }}
                </option>
              </select>
            </label>
          </div>
        </div>

        <div class="layout-demo">
          <div
            class="demo-row"
            :style="{
              gap: `${layoutControls.gutter}px`,
              justifyContent: getJustifyContentValue(layoutControls.justify)
            }"
          >
            <div
              v-for="item in 4"
              :key="item"
              class="demo-col"
              :class="[
                item % 2 ? 'demo-col-dark' : 'demo-col-light'
              ]"
              :style="getColStyle()"
            >
              Col {{ item }}
            </div>
          </div>
        </div>

        <div class="demo-code">
          <h4 class="code-title">
            Configuration actuelle :
          </h4>
          <div class="code-block">
            <code>
              &lt;PRow
              :pGutter="{{ layoutControls.gutter }}"
              pJustify="{{ layoutControls.justify }}"&gt;<br>
              &nbsp;&nbsp;&lt;PCol
              :pSpan="{{ layoutControls.span }}"
              :pOffset="{{ layoutControls.offset }}"
              :pPush="{{ layoutControls.push }}"
              :pPull="{{ layoutControls.pull }}"&gt;<br>
              &nbsp;&nbsp;&nbsp;&nbsp;Contenu<br>
              &nbsp;&nbsp;&lt;/PCol&gt;<br>
              &lt;/PRow&gt;
            </code>
          </div>
          <button
            class="copy-btn"
            @click="copyLayoutCode"
          >
            📋 Copier le code
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCopyClipboard } from '../../utils/clipboard'

const layoutControls = ref({
  gutter: 0,
  span: 6,
  offset: 0,
  justify: 'start',
  push: 0,
  pull: 0,
})

const spacingValues = [
  { px: '4px', rem: '0.25rem', usage: 'Margin entre icône et texte' },
  { px: '8px', rem: '0.50rem', usage: 'Margin entre label et input' },
  { px: '12px', rem: '0.75rem', usage: 'Padding dans les cards ou tableaux' },
  { px: '16px', rem: '1rem', usage: 'Spacing de base - Margin entre les atomes et molécules' },
  { px: '20px', rem: '1.25rem', usage: 'Margin entre les molécules, les organismes et les sections' },
  { px: '24px', rem: '1.50rem', usage: 'Margin entre les molécules, les organismes et les sections' },
  { px: '32px', rem: '2rem', usage: 'Margin entre les organismes et les sections' },
  { px: '48px', rem: '3rem', usage: 'Margin entre les organismes et les sections' },
  { px: '64px', rem: '4rem', usage: 'Margin entre les organismes et les sections' },
  { px: '128px', rem: '8rem', usage: 'Margin entre les organismes et les sections' },
]

const breakpoints = [
  {
    name: 'xs',
    device: 'Mobile',
    size: '< 768 px',
    columns: 2,
    gutter: '16px',
    margin: '16px',
  },
  {
    name: 'sm',
    device: 'Tablette',
    size: '≥ 768 px',
    columns: 4,
    gutter: '16px',
    margin: '16px',
  },
  {
    name: 'md',
    device: 'Small desktop',
    size: '≥ 992 px',
    columns: 8,
    gutter: '16px',
    margin: '16px',
  },
  {
    name: 'lg',
    device: 'Medium desktop',
    size: '≥ 1440px',
    columns: 12,
    gutter: '24px',
    margin: '24px',
  },
  {
    name: 'xl',
    device: 'Large desktop',
    size: '≥ 1920px',
    columns: 12,
    gutter: '32px',
    margin: '32px',
  },
]

const justifyOptions = ['start', 'end', 'center', 'space-around', 'space-between', 'space-evenly']

const getJustifyContentValue = (value: string) => {
  const mappings: Record<string, string> = {
    'start': 'flex-start',
    'end': 'flex-end',
    'center': 'center',
    'space-around': 'space-around',
    'space-between': 'space-between',
    'space-evenly': 'space-evenly',
  }
  return mappings[value] || 'flex-start'
}

const getColStyle = () => {
  const baseWidth = `calc((100% - ${layoutControls.value.gutter * 3}px) / 4)`
  const spanWidth = `calc(${layoutControls.value.span} * (100% / 24) - ${layoutControls.value.gutter}px)`

  return {
    width: layoutControls.value.span > 0 ? spanWidth : baseWidth,
    marginLeft: layoutControls.value.offset > 0 ? `calc(${layoutControls.value.offset} * (100% / 24))` : '0',
    transform: `translateX(${layoutControls.value.push - layoutControls.value.pull}px)`,
  }
}

const copyLayoutCode = async () => {
  const code = `<PRow :pGutter="${layoutControls.value.gutter}" pJustify="${layoutControls.value.justify}">
  <PCol :pSpan="${layoutControls.value.span}" :pOffset="${layoutControls.value.offset}" :pPush="${layoutControls.value.push}" :pPull="${layoutControls.value.pull}">
    Contenu
  </PCol>
</PRow>`

  await useCopyClipboard(code)
}
</script>

<style scoped>
.layout-documentation {
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
.spacing-table-container,
.breakpoints-table-container {
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid var(--p-stroke-neutral, #CDD1D4);
}

.spacing-table,
.breakpoints-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--p-surface-primary, #FFFFFF);
}

.spacing-table thead,
.breakpoints-table thead {
  background: var( --p-surface-neutral-lighter);
  color: var(--p-text-neutral, #889BA8);
}

.spacing-table th,
.breakpoints-table th {
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid var(--p-stroke-neutral-lighter, #E0E6ED);
}

.spacing-table td,
.breakpoints-table td {
  padding: 16px;
  border-bottom: 1px solid var(--p-stroke-neutral-lighter, #E0E6ED);
  color: var(--p-text-body, #15171A);
  font-size: 14px;
  line-height: 1.4;
}

.spacing-table tr:last-child td,
.breakpoints-table tr:last-child td {
  border-bottom: none;
}

.spacing-table code,
.breakpoints-table code {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  background: var( --p-surface-neutral-lighter);
  padding: 2px 6px;
  border-radius: 3px;
  color: var(--p-text-highlight, #093C32);
}

/* Interactive Demo */
.layout-demo-container {
  border: 1px solid var(--p-stroke-neutral, #CDD1D4);
  border-radius: 8px;
  background: var(--p-surface-primary, #FFFFFF);
  padding: 24px;
}

.demo-controls {
  margin-bottom: 24px;
  padding: 20px;
  background: var( --p-surface-neutral-lighter);
  border-radius: 8px;
}

.control-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 16px;
}

.control-row:last-child {
  margin-bottom: 0;
}

.control-label {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--p-text-body, #15171A);
  font-weight: 500;
  font-size: 14px;
}

.control-slider {
  flex: 1;
  height: 6px;
  background: var(--p-stroke-neutral-lighter, #E0E6ED);
  border-radius: 3px;
  outline: none;
  appearance: none;
}

.control-slider::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  background: var(--p-surface-information-primary, #E3F2FD);
  border: 2px solid var(--p-stroke-information-primary, #1976D2);
  border-radius: 50%;
  cursor: pointer;
}

.control-select {
  flex: 1;
  padding: 6px 10px;
  border: 1px solid var(--p-stroke-neutral, #CDD1D4);
  border-radius: 4px;
  background: var(--p-surface-primary, #FFFFFF);
  color: var(--p-text-body, #15171A);
  font-size: 14px;
}

.control-value {
  min-width: 40px;
  font-weight: 600;
  color: var(--p-text-information-primary, #126778);
}

.layout-demo {
  margin-bottom: 24px;
  padding: 20px;
  background: var( --p-surface-neutral-lighter);
  border: 2px dashed var(--p-stroke-neutral, #CDD1D4);
  border-radius: 8px;
}

.demo-row {
  display: flex;
  min-height: 60px;
}

.demo-col {
  padding: 16px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: var(--p-text-body, #15171A);
  transition: all 0.3s ease;
}

.demo-col-light {
  background: var(--p-surface-information-lighter, #E3F2FD);
  border: 1px solid var(--p-stroke-information-secondary, #2C2FD6);
}

.demo-col-dark {
  background: var(--p-surface-success-lighter, #E8F5E8);
  border: 1px solid var(--p-stroke-success, #00B800);
}

.demo-code {
  padding: 16px;
  background: var( --p-surface-neutral-lighter);
  border-radius: 8px;
  border: 1px solid var(--p-stroke-neutral-lighter, #E0E6ED);
}

.code-title {
  color: var(--p-text-heading, #0E0F30);
  margin-bottom: 12px;
  font-size: 16px;
  font-weight: 600;
}

.code-block {
  margin-bottom: 16px;
  padding: 16px;
  background: var(--p-surface-primary, #FFFFFF);
  border: 1px solid var(--p-stroke-neutral-lighter, #E0E6ED);
  border-radius: 6px;
  overflow-x: auto;
}

.code-block code {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  line-height: 1.5;
  color: var(--p-text-highlight, #093C32);
  white-space: pre;
}

.copy-btn {
  padding: 8px 12px;
  font-size: 12px;
  border: 1px solid var(--p-stroke-default-primary, #ADB5BD);
  background: var(--p-surface-primary, #FFFFFF);
  color: var(--p-text-body, #15171A);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.copy-btn:hover {
  background: var(--p-surface-state-hover, #E7FFFF);
  border-color: var(--p-stroke-hover, #0C4F41);
}

.copy-btn:active {
  background: var(--p-surface-state-press, #ADE1D6);
}

/* Principles */
.principles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.principle-card {
  padding: 20px;
  background: var( --p-surface-neutral-lighter);
  border: 1px solid var(--p-stroke-neutral-lighter, #E0E6ED);
  border-radius: 8px;
}

.principle-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--p-text-heading, #0E0F30);
  margin-bottom: 12px;
}

.principle-description {
  color: var(--p-text-body, #15171A);
  line-height: 1.5;
  margin-bottom: 16px;
}

.principle-example {
  display: flex;
  gap: 8px;
  align-items: center;
}

.spacing-demo {
  background: var(--p-surface-information-primary, #E3F2FD);
  border: 1px solid var(--p-stroke-information-primary, #1976D2);
  border-radius: 4px;
  padding: 8px;
  font-size: 12px;
  font-weight: 600;
  color: var(--p-text-information-primary, #126778);
}

.spacing-4 { width: 4px; }
.spacing-8 { width: 8px; }
.spacing-16 { width: 16px; }

.principle-highlight {
  padding: 12px;
  background: var(--p-surface-success-lighter, #E8F5E8);
  border: 1px solid var(--p-stroke-success, #00B800);
  border-radius: 6px;
  text-align: center;
  color: var(--p-text-success, #0A710B);
}

.responsive-illustration {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.device {
  font-size: 24px;
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.device:hover {
  opacity: 1;
}

@media (max-width: 768px) {
  .control-row {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .demo-row {
    flex-direction: column;
    gap: 8px;
  }

  .principles-grid {
    grid-template-columns: 1fr;
  }

  .layout-documentation {
    padding: 16px;
  }
}
</style>
