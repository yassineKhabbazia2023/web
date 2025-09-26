<template>
  <div class="typography-documentation">
    <h2 class="section-title">
      Système de typographie Pégase
    </h2>
    <p class="intro">
      Classes utilitaires pour la typographie incluant les tailles, poids, styles, alignements et transformations de texte.
      Cliquez sur les exemples pour copier les classes CSS dans votre presse-papier.
    </p>

    <!-- Typography Groups -->
    <div
      v-for="(classes, groupKey) in typographyGroups"
      :key="groupKey"
      class="section-group"
    >
      <h3 class="subsection-title">
        {{ getGroupTitle(groupKey) }}
      </h3>
      <p class="subsection-description">
        {{ getGroupDescription(groupKey) }}
      </p>

      <div class="examples-grid">
        <div
          v-for="cssClass in classes"
          :key="cssClass"
          class="example-item"
          @click="copyToClipboard(cssClass)"
        >
          <div class="example-preview">
            <div
              class="typography-sample"
              :class="cssClass"
            >
              {{ sampleText }}
            </div>
          </div>

          <div class="example-info">
            <div class="example-name">
              {{ formatClassName(cssClass) }}
            </div>
            <div class="example-class">
              .{{ cssClass }}
            </div>
            <div class="example-description">
              {{ getClassDescription(cssClass, groupKey) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Interactive Demo -->
    <div class="section-group">
      <h3 class="subsection-title">
        Démonstration interactive
      </h3>
      <p class="subsection-description">
        Testez différentes combinaisons de classes typographiques et voyez le résultat en temps réel.
      </p>

      <div class="interactive-demo">
        <div class="demo-controls">
          <div class="control-group">
            <label class="control-label">
              Taille :
              <select v-model="selectedSize" class="control-select">
                <option value="">Aucune</option>
                <option
                  v-for="sizeClass in sizeClasses"
                  :key="sizeClass"
                  :value="sizeClass"
                >
                  .{{ sizeClass }}
                </option>
              </select>
            </label>

            <label class="control-label">
              Poids :
              <select v-model="selectedWeight" class="control-select">
                <option value="">Aucun</option>
                <option
                  v-for="weightClass in weightClasses"
                  :key="weightClass"
                  :value="weightClass"
                >
                  .{{ weightClass }}
                </option>
              </select>
            </label>
          </div>

          <div class="control-group">
            <label class="control-label">
              Style :
              <select v-model="selectedStyle" class="control-select">
                <option value="">Aucun</option>
                <option
                  v-for="styleClass in styleClasses"
                  :key="styleClass"
                  :value="styleClass"
                >
                  .{{ styleClass }}
                </option>
              </select>
            </label>

            <label class="control-label">
              Alignement :
              <select v-model="selectedAlign" class="control-select">
                <option value="">Aucun</option>
                <option
                  v-for="alignClass in alignClasses"
                  :key="alignClass"
                  :value="alignClass"
                >
                  .{{ alignClass }}
                </option>
              </select>
            </label>
          </div>

          <div class="control-group">
            <label class="control-label">
              Transformation :
              <select v-model="selectedTransform" class="control-select">
                <option value="">Aucune</option>
                <option
                  v-for="transformClass in transformClasses"
                  :key="transformClass"
                  :value="transformClass"
                >
                  .{{ transformClass }}
                </option>
              </select>
            </label>

            <label class="control-label">
              Utilitaires :
              <select v-model="selectedUtility" class="control-select">
                <option value="">Aucun</option>
                <option
                  v-for="utilityClass in utilityClasses"
                  :key="utilityClass"
                  :value="utilityClass"
                >
                  .{{ utilityClass }}
                </option>
              </select>
            </label>
          </div>
        </div>

        <div class="demo-preview">
          <div
            class="demo-text"
            :class="combinedClasses"
          >
            {{ customSampleText }}
          </div>
        </div>

        <div class="demo-info">
          <div class="applied-classes">
            <strong>Classes appliquées :</strong>
            <span v-if="combinedClassesArray.length === 0" class="no-classes">Aucune classe</span>
            <code
              v-for="cssClass in combinedClassesArray"
              :key="cssClass"
              class="applied-class"
            >
              .{{ cssClass }}
            </code>
          </div>
          <div class="demo-actions">
            <button
              v-if="combinedClassesArray.length > 0"
              class="copy-btn"
              @click="copyToClipboard(combinedClassesArray.join(' '))"
            >
              📋 Copier toutes les classes
            </button>
            <button
              class="reset-btn"
              @click="resetDemo"
            >
              🔄 Reset
            </button>
          </div>
        </div>

        <div class="demo-text-input">
          <label class="input-label">
            Texte personnalisé :
            <input
              v-model="customSampleText"
              type="text"
              class="text-input"
              placeholder="Entrez votre texte..."
            >
          </label>
        </div>
      </div>
    </div>

    <!-- Typography Reference -->
    <div class="section-group">
      <h3 class="subsection-title">
        Référence complète
      </h3>
      <p class="subsection-description">
        Tableau de référence avec toutes les classes de typographie disponibles et leurs CSS correspondants.
      </p>

      <div class="reference-table-container">
        <table class="reference-table">
          <thead>
            <tr>
              <th>Classe</th>
              <th>Groupe</th>
              <th>Exemple visuel</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <template
              v-for="(classes, groupKey) in typographyGroups"
              :key="groupKey"
            >
              <tr>
                <td colspan="4" class="group-header">
                  {{ getGroupTitle(groupKey) }}
                </td>
              </tr>
              <tr
                v-for="cssClass in classes"
                :key="cssClass"
                class="reference-row"
                @click="copyToClipboard(cssClass)"
              >
                <td>
                  <code>.{{ cssClass }}</code>
                </td>
                <td>{{ getGroupTitle(groupKey) }}</td>
                <td>
                  <span :class="cssClass" class="reference-sample">Sample</span>
                </td>
                <td>{{ getClassDescription(cssClass, groupKey) }}</td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCopyClipboard } from '../../utils/clipboard'

const sampleText = 'Dans une petite ville de l\'Aveyron ou des Pyrénées, le moindre incident eût été rendu décisif par le feu du climat.'

const customSampleText = ref(sampleText)

// Demo controls
const selectedSize = ref('')
const selectedWeight = ref('')
const selectedStyle = ref('')
const selectedAlign = ref('')
const selectedTransform = ref('')
const selectedUtility = ref('')

// Typography classes by group
const sizeClasses = [
  'font-xsmall',
  'font-small',
  'font-base',
  'font-large',
  'h4',
  'h3',
  'h2',
  'h1',
]

const weightClasses = [
  'font-light',
  'font-normal',
  'font-semibold',
  'font-bold',
]

const styleClasses = [
  'font-italic',
]

const alignClasses = [
  'text-left',
  'text-center',
  'text-right',
]

const transformClasses = [
  'text-uppercase',
  'text-capitalize',
]

const textOverflowClasses = [
  'text-overflow--ellispis',
]

const textDecorationClasses = [
  'text-underline',
]

const linkClasses = [
  'link',
]

const whiteSpaceClasses = [
  'white-space--no-wrap',
  'white-space--pre-line',
  'white-space--wrap',
]

const textWrapClasses = [
  'text-wrap--balance',
  'text-wrap--nowrap',
  'text-wrap--stable',
  'text-wrap--wrap',
]

const wordBreakClasses = [
  'word-break--normal text-wrap--wrap',
  'word-break--break-all text-wrap--wrap',
  'word-break--keep-all text-wrap--wrap',
  'word-break--break-word text-wrap--wrap',
  'word-break--initial text-wrap--wrap',
  'word-break--inherit text-wrap--wrap',
]

const utilityClasses = [
  ...textOverflowClasses,
  ...textDecorationClasses,
  ...linkClasses,
  ...whiteSpaceClasses.slice(0, 3), // Deduplicate
  ...textWrapClasses,
  ...wordBreakClasses,
]

const typographyGroups = {
  size: sizeClasses,
  weight: weightClasses,
  style: styleClasses,
  align: alignClasses,
  transform: transformClasses,
  whiteSpace: whiteSpaceClasses,
  textWrap: textWrapClasses,
  wordBreak: wordBreakClasses,
  textOverFlow: textOverflowClasses,
  textDecoration: textDecorationClasses,
  link: linkClasses,
}

const combinedClassesArray = computed(() => {
  return [
    selectedSize.value,
    selectedWeight.value,
    selectedStyle.value,
    selectedAlign.value,
    selectedTransform.value,
    selectedUtility.value,
  ].filter(Boolean)
})

const combinedClasses = computed(() => {
  return combinedClassesArray.value.join(' ')
})

const getGroupTitle = (groupKey: string) => {
  const titles: Record<string, string> = {
    size: 'Tailles',
    weight: 'Poids',
    style: 'Styles',
    align: 'Alignements',
    transform: 'Transformations',
    whiteSpace: 'Gestion des espaces',
    textWrap: 'Retour à la ligne',
    wordBreak: 'Césure des mots',
    textOverFlow: 'Débordement de texte',
    textDecoration: 'Décoration de texte',
    link: 'Liens',
  }
  return titles[groupKey] || groupKey
}

const getGroupDescription = (groupKey: string) => {
  const descriptions: Record<string, string> = {
    size: 'Contrôle la taille du texte avec des classes de taille prédéfinies et des niveaux de titre.',
    weight: 'Définit l\'épaisseur du texte avec différents niveaux de graisse.',
    style: 'Applique des styles typographiques comme l\'italique.',
    align: 'Contrôle l\'alignement horizontal du texte dans son conteneur.',
    transform: 'Transforme la casse du texte (majuscules, capitalisation).',
    whiteSpace: 'Gère le comportement des espaces blancs et retours à la ligne.',
    textWrap: 'Contrôle la façon dont le texte se répartit sur les lignes.',
    wordBreak: 'Définit les règles de césure des mots longs.',
    textOverFlow: 'Gère l\'affichage du texte qui dépasse de son conteneur.',
    textDecoration: 'Applique des décorations visuelles au texte.',
    link: 'Styles spéciaux pour les liens hypertexte.',
  }
  return descriptions[groupKey] || ''
}

const formatClassName = (className: string) => {
  return className
    .replace(/--/g, '-')
    .replace(/-/g, ' ')
    .replace(/text wrap wrap/g, 'text wrap')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const getClassDescription = (className: string, groupKey: string) => {
  const descriptions: Record<string, string> = {
    'font-xsmall': 'Très petite taille de police',
    'font-small': 'Petite taille de police',
    'font-base': 'Taille de police de base',
    'font-large': 'Grande taille de police',
    'h4': 'Titre de niveau 4',
    'h3': 'Titre de niveau 3',
    'h2': 'Titre de niveau 2',
    'h1': 'Titre principal de niveau 1',
    'font-light': 'Police fine',
    'font-normal': 'Poids normal de police',
    'font-semibold': 'Police semi-grasse',
    'font-bold': 'Police grasse',
    'font-italic': 'Texte en italique',
    'text-left': 'Aligne le texte à gauche',
    'text-center': 'Centre le texte',
    'text-right': 'Aligne le texte à droite',
    'text-uppercase': 'Transforme en majuscules',
    'text-capitalize': 'Capitalise la première lettre',
    'text-overflow--ellispis': 'Ajoute des points de suspension',
    'text-underline': 'Souligne le texte',
    'link': 'Style de lien par défaut',
    'white-space--no-wrap': 'Empêche le retour à la ligne',
    'white-space--pre-line': 'Préserve les retours à la ligne',
    'white-space--wrap': 'Permet le retour à la ligne normal',
  }

  return descriptions[className] || `Classe ${groupKey}`
}

const resetDemo = () => {
  selectedSize.value = ''
  selectedWeight.value = ''
  selectedStyle.value = ''
  selectedAlign.value = ''
  selectedTransform.value = ''
  selectedUtility.value = ''
  customSampleText.value = sampleText
}

const copyToClipboard = async (text: string) => {
  await useCopyClipboard(`.${text}`)
}
</script>

<style scoped>
.typography-documentation {
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

.examples-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
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
  padding: 20px;
  background: var( --p-surface-neutral-lighter);
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.typography-sample {
  color: var(--p-text-body, #15171A);
  line-height: 1.4;
  max-width: 100%;
  overflow: hidden;
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

/* Interactive Demo */
.interactive-demo {
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

.control-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.control-group:last-child {
  margin-bottom: 0;
}

.control-label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: var(--p-text-body, #15171A);
  font-weight: 500;
  font-size: 14px;
}

.control-select {
  padding: 8px 12px;
  border: 1px solid var(--p-stroke-neutral, #CDD1D4);
  border-radius: 6px;
  background: var(--p-surface-primary, #FFFFFF);
  color: var(--p-text-body, #15171A);
  font-size: 14px;
}

.demo-preview {
  padding: 32px;
  background: var( --p-surface-neutral-lighter);
  border: 2px dashed var(--p-stroke-neutral, #CDD1D4);
  border-radius: 8px;
  margin-bottom: 20px;
  min-height: 100px;
  display: flex;
  align-items: center;
}

.demo-text {
  color: var(--p-text-body, #15171A);
  max-width: 100%;
}

.demo-info {
  padding: 16px;
  background: var(--p-surface-information-lighter, #E3F2FD);
  border-radius: 6px;
  margin-bottom: 16px;
}

.applied-classes {
  margin-bottom: 12px;
  color: var(--p-text-body, #15171A);
}

.no-classes {
  color: var(--p-text-neutral, #889BA8);
  font-style: italic;
}

.applied-class {
  display: inline-block;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  background: var(--p-surface-primary, #FFFFFF);
  color: var(--p-text-highlight, #093C32);
  padding: 2px 6px;
  border-radius: 3px;
  margin: 2px 4px 2px 0;
  font-size: 12px;
}

.demo-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.copy-btn,
.reset-btn {
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

.copy-btn:hover,
.reset-btn:hover {
  background: var(--p-surface-state-hover, #E7FFFF);
  border-color: var(--p-stroke-hover, #0C4F41);
}

.copy-btn:active,
.reset-btn:active {
  background: var(--p-surface-state-press, #ADE1D6);
}

.demo-text-input {
  margin-top: 16px;
}

.input-label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: var(--p-text-body, #15171A);
  font-weight: 500;
}

.text-input {
  padding: 12px 16px;
  border: 1px solid var(--p-stroke-neutral, #CDD1D4);
  border-radius: 6px;
  background: var(--p-surface-primary, #FFFFFF);
  color: var(--p-text-body, #15171A);
  font-size: 14px;
}

.text-input:focus {
  outline: none;
  border-color: var(--p-stroke-hover, #0C4F41);
  box-shadow: 0 0 0 2px rgba(12, 79, 65, 0.1);
}

/* Reference Table */
.reference-table-container {
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid var(--p-stroke-neutral, #CDD1D4);
}

.reference-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--p-surface-primary, #FFFFFF);
}

.reference-table thead {
  background: var( --p-surface-neutral-lighter);
  color: var(--p-text-neutral, #889BA8);
}

.reference-table th {
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid var(--p-stroke-neutral-lighter, #E0E6ED);
}

.reference-table td {
  padding: 12px 16px;
  border-bottom: 1px solid var(--p-stroke-neutral-lighter, #E0E6ED);
  color: var(--p-text-body, #15171A);
  font-size: 14px;
  vertical-align: middle;
}

.group-header {
  background: var(--p-surface-information-lighter, #E3F2FD) !important;
  font-weight: 700 !important;
  color: var(--p-text-information-primary, #126778) !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 12px;
}

.reference-row {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.reference-row:hover {
  background: var(--p-surface-state-hover, #E7FFFF);
}

.reference-table code {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  background: var( --p-surface-neutral-lighter);
  padding: 2px 6px;
  border-radius: 3px;
  color: var(--p-text-highlight, #093C32);
  font-size: 12px;
}

.reference-sample {
  display: inline-block;
  max-width: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 768px) {
  .examples-grid {
    grid-template-columns: 1fr;
  }

  .control-group {
    grid-template-columns: 1fr;
  }

  .demo-actions {
    flex-direction: column;
  }

  .typography-documentation {
    padding: 16px;
  }
}
</style>
