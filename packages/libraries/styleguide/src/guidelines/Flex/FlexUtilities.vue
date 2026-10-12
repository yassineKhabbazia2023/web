<template>
  <div class="flex-documentation">
    <h2 class="section-title">
      Système Flexbox Pégase
    </h2>
    <p class="intro">
      Classes utilitaires pour le système Flexbox avec justify-content, align-items, gap, et propriétés individuelles.
      Cliquez sur les boutons pour copier les classes CSS dans votre presse-papier.
    </p>

    <!-- Direction Controls -->
    <div class="section-controls">
      <label class="control-label">
        <input
          v-model="isColumnDirection"
          type="checkbox"
          class="control-checkbox"
        >
        Mode colonne (flex--direction-column)
      </label>
    </div>

    <!-- Justify Content -->
    <div class="section-group">
      <h3 class="subsection-title">
        Justify Content
      </h3>
      <p class="subsection-description">
        Contrôle l'alignement des éléments le long de l'axe principal du conteneur flex.
      </p>

      <div class="examples-grid">
        <div
          v-for="justifyClass in justifyContentClasses"
          :key="justifyClass.className"
          class="example-item"
          @click="copyToClipboard(justifyClass.className, isColumnDirection ? 'flex--direction-column' : '')"
        >
          <div class="flex-demo-container">
            <div
              class="flex-container"
              :class="{
                'flex--direction-column': isColumnDirection,
                [justifyClass.className]: true
              }"
            >
              <div
                v-for="n in 3"
                :key="n"
                class="flex-item"
                :class="subListSameSize[n-1]"
              />
            </div>
          </div>

          <div class="example-info">
            <div class="example-name">
              {{ justifyClass.name }}
            </div>
            <div class="example-class">
              .{{ justifyClass.className }}
            </div>
            <div class="example-description">
              {{ justifyClass.description }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Align Items -->
    <div class="section-group">
      <h3 class="subsection-title">
        Align Items
      </h3>
      <p class="subsection-description">
        Contrôle l'alignement des éléments le long de l'axe transversal du conteneur flex.
      </p>

      <div class="examples-grid">
        <div
          v-for="alignClass in alignItemsClasses"
          :key="alignClass.className"
          class="example-item"
          @click="copyToClipboard(alignClass.className, isColumnDirection ? 'flex--direction-column' : '')"
        >
          <div class="flex-demo-container">
            <div
              class="flex-container"
              :class="{
                'flex--direction-column': isColumnDirection,
                [alignClass.className]: true
              }"
            >
              <div
                v-for="(height, index) in subListVariable"
                :key="index"
                class="flex-item"
                :class="height"
              />
            </div>
          </div>

          <div class="example-info">
            <div class="example-name">
              {{ alignClass.name }}
            </div>
            <div class="example-class">
              .{{ alignClass.className }}
            </div>
            <div class="example-description">
              {{ alignClass.description }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Gap -->
    <div class="section-group">
      <h3 class="subsection-title">
        Gap
      </h3>
      <p class="subsection-description">
        Contrôle l'espacement entre les éléments flexibles.
      </p>

      <div class="examples-grid">
        <div
          v-for="gapClass in gapClasses"
          :key="gapClass.className"
          class="example-item"
          @click="copyToClipboard(gapClass.className, isColumnDirection ? 'flex--direction-column' : '')"
        >
          <div class="flex-demo-container">
            <div
              class="flex-container"
              :class="{
                'flex--direction-column': isColumnDirection,
                [gapClass.className]: true
              }"
            >
              <div
                v-for="n in 3"
                :key="n"
                class="flex-item"
                :class="subListSameSize[n-1]"
              />
            </div>
          </div>

          <div class="example-info">
            <div class="example-name">
              {{ gapClass.name }}
            </div>
            <div class="example-class">
              .{{ gapClass.className }}
            </div>
            <div class="example-description">
              {{ gapClass.description }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Flex Item Properties -->
    <div class="section-group">
      <h3 class="subsection-title">
        Propriétés des éléments flex
      </h3>
      <p class="subsection-description">
        Classes à appliquer aux éléments enfants pour contrôler leur comportement individuel.
      </p>

      <!-- Align Self -->
      <div class="subsection-group">
        <h4 class="property-title">
          Align Self
        </h4>
        <div class="examples-grid compact">
          <div
            v-for="alignSelfClass in alignSelfClasses"
            :key="alignSelfClass.className"
            class="example-item"
            @click="copyToClipboard(alignSelfClass.className, isColumnDirection ? 'flex--direction-column' : '')"
          >
            <div class="flex-demo-container">
              <div
                class="flex-container"
                :class="{
                  'flex--direction-column': isColumnDirection
                }"
              >
                <div
                  v-for="(height, index) in subListVariable"
                  :key="index"
                  class="flex-item"
                  :class="[
                    height,
                    { [alignSelfClass.className]: index === 1, 'darker': index === 1 }
                  ]"
                />
              </div>
            </div>
            <div class="example-info compact">
              <div class="example-name">
                {{ alignSelfClass.name }}
              </div>
              <div class="example-class">
                .{{ alignSelfClass.className }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCopyClipboard } from '../../utils/clipboard'

const isColumnDirection = ref(false)

// Helper functions for class list generation
const stringToClassList = (prefix: string, suffixes: string) => {
  return suffixes
    .split(',')
    .map(suffix => ({
      className: `${prefix}${suffix.trim()}`,
      name: suffix.trim().replace(/-/g, ' '),
      description: getFlexDescription(prefix, suffix.trim()),
    }))
}

const numbersToClassList = (prefix: string, lastIndex: number, firstIndex = 0) => {
  const suffixes = Array.from(Array(lastIndex + 1 - firstIndex).keys())
  return suffixes
    .map(suffix => ({
      className: `${prefix}${suffix + firstIndex}`,
      name: `${prefix.replace(/--/g, '').replace(/-/g, ' ')} ${suffix + firstIndex}`,
      description: getFlexDescription(prefix, (suffix + firstIndex).toString()),
    }))
}

const getFlexDescription = (prefix: string, value: string) => {
  const descriptions: Record<string, Record<string, string>> = {
    'flex--justify-content-': {
      'flex-start': 'Aligne les éléments au début de l\'axe principal',
      'flex-end': 'Aligne les éléments à la fin de l\'axe principal',
      'space-around': 'Distribue l\'espace de manière égale autour de chaque élément',
      'space-between': 'Distribue l\'espace entre les éléments, premiers et derniers collés aux bords',
      'stretch': 'Étire les éléments pour remplir le conteneur',
      'center': 'Centre les éléments sur l\'axe principal',
    },
    'flex--align-items-': {
      'baseline': 'Aligne les éléments sur la ligne de base de l\'axe transversal',
      'flex-start': 'Aligne les éléments au début de l\'axe transversal',
      'flex-end': 'Aligne les éléments à la fin de l\'axe transversal',
      'stretch': 'Étire les éléments sur l\'axe transversal',
      'center': 'Centre les éléments sur l\'axe transversal',
      'end': 'Aligne les éléments à la fin',
      'start': 'Aligne les éléments au début',
    },
    'flex-gap--': {
      '0': 'Aucun espacement entre les éléments',
      'half': 'Espacement de 2px entre les éléments',
    },
    'flex--align-self-': {
      'flex-start': 'Auto-aligne cet élément au début',
      'flex-end': 'Auto-aligne cet élément à la fin',
      'stretch': 'Auto-étire cet élément',
      'center': 'Auto-centre cet élément',
    },
  }

  for (const [prefixKey, values] of Object.entries(descriptions)) {
    if (prefix.includes(prefixKey) && values[value]) {
      return values[value]
    }
  }

  if (prefix.includes('flex-gap--') && /^\d+$/.test(value)) {
    const pixels = parseInt(value) * 4
    return `Espacement de ${pixels}px entre les éléments`
  }

  if (prefix.includes('flex--grow-')) {
    return `Permet à l'élément de grandir avec un facteur de ${value}`
  }

  if (prefix.includes('flex--shrink-')) {
    return `Permet à l'élément de rétrécir avec un facteur de ${value}`
  }

  return `Applique ${prefix}${value}`
}

// Sub lists for demo elements
const subListSameSize = ['height-40', 'height-40', 'height-40']
const subListVariable = ['height-80', 'height-40', 'height-60']

// Generate class lists
const justifyContentClasses = stringToClassList('flex--justify-content-', 'flex-start, flex-end, space-around, space-between, stretch, center')
const alignItemsClasses = stringToClassList('flex--align-items-', 'flex-start, flex-end, stretch, center, end, start')
const alignSelfClasses = stringToClassList('flex--align-self-', 'flex-start, flex-end, stretch, center, end, start')

const gapClasses = [
  ...numbersToClassList('flex-gap--', 0),
  { className: 'flex-gap--half', name: 'Gap Half', description: 'Espacement de 2px entre les éléments' },
  ...numbersToClassList('flex-gap--', 12, 1),
]

const copyToClipboard = async (className: string, additionalClass = '') => {
  const classes = [className, additionalClass].filter(Boolean).join(' ')
  await useCopyClipboard(`.${classes}`)
}
</script>

<style scoped>
.flex-documentation {
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
  padding: 16px;
  background: var( --p-surface-neutral-lighter);
  border-radius: 8px;
  border: 1px solid var(--p-stroke-neutral-lighter, #E0E6ED);
}

.control-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--p-text-basic-body, #15171A);
  font-weight: 500;
  cursor: pointer;
}

.control-checkbox {
  width: 16px;
  height: 16px;
}

.section-group {
  margin-bottom: 48px;
}

.subsection-group {
  margin-bottom: 32px;
}

.subsection-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--p-text-basic-heading, #0E0F30);
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--p-stroke-neutral-neutral, #CDD1D4);
}

.property-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--p-text-basic-heading, #0E0F30);
  margin-bottom: 12px;
}

.subsection-description {
  color: var(--p-text-basic-body, #15171A);
  margin-bottom: 24px;
  line-height: 1.5;
}

.examples-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.examples-grid.compact {
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}

.example-item {
  border: 1px solid var(--p-stroke-neutral-neutral, #CDD1D4);
  border-radius: 8px;
  background: var(--p-surface-basic-primary, #FFFFFF);
  overflow: hidden;
  cursor: pointer;
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
}

.example-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: var(--p-stroke-basic-hover, #0C4F41);
}

.flex-demo-container {
  padding: 16px;
  min-height: 120px;
}

.flex-container {
  display: flex;
  min-height: 80px;
  background: var( --p-surface-neutral-lighter);
  border: 2px dashed var(--p-stroke-neutral-neutral, #CDD1D4);
  border-radius: 8px;
  padding: 8px;
}

.flex-item {
  background: var(--p-surface-information-primary-light, #E3F2FD);
  border: 1px solid var(--p-stroke-information-primary, #1976D2);
  border-radius: 4px;
  min-width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--p-text-basic-information-primary, #126778);
  font-weight: 600;
  font-size: 12px;
}

.flex-item.darker {
  background: var(--p-surface-success-primary, #E8F5E8) !important;
  border-color: var(--p-stroke-basic-success, #00B800) !important;
  color: var(--p-text-basic-success, #0A710B) !important;
}

.example-info {
  padding: 16px;
  border-top: 1px solid var(--p-stroke-neutral-lighter, #E0E6ED);
}

.example-info.compact {
  padding: 12px;
}

.example-name {
  font-weight: 700;
  color: var(--p-text-basic-heading, #0E0F30);
  margin-bottom: 8px;
  font-size: 16px;
  text-transform: capitalize;
}

.example-class {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  color: var(--p-text-basic-highlight, #093C32);
  margin-bottom: 8px;
  font-size: 13px;
  background: rgba(9, 60, 50, 0.1);
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
}

.example-description {
  color: var(--p-text-basic-body, #15171A);
  line-height: 1.4;
  font-size: 14px;
}

/* Height utility classes for demo */
.height-40 {
  height: 40px;
}

.height-60 {
  height: 60px;
}

.height-80 {
  height: 80px;
}

@media (max-width: 768px) {
  .examples-grid,
  .examples-grid.compact {
    grid-template-columns: 1fr;
  }

  .flex-demo-container {
    min-height: 100px;
  }

  .flex-container {
    min-height: 60px;
  }

  .flex-documentation {
    padding: 16px;
  }
}
</style>
