<template>
  <div class="color-documentation">
    <div v-if="type === 'pegase'" class="pegase-colors">
      <h2 class="section-title">
        Couleurs primitives Pégase
      </h2>
      <p class="intro">
        Couleurs primitives du design system Pégase. Cliquez sur les boutons pour copier les variables CSS,
        classes utilitaires ou codes hexadécimaux dans votre presse-papier.
      </p>

      <div
        v-for="(colorGroup, groupName) in colorGroups"
        :key="groupName"
        class="color-group"
      >
        <h3 class="color-group-title">
          {{ formatGroupName(groupName) }}
        </h3>

        <div class="color-palette">
          <div
            v-for="(colorValue, shadeName) in colorGroup"
            :key="`${groupName}-${shadeName}`"
            class="color-item"
          >
            <div
              class="color-preview"
              :style="{ backgroundColor: colorValue }"
              :title="`${groupName}-${shadeName}: ${colorValue}`"
            />

            <div class="color-info">
              <div class="color-name">
                {{ groupName }}-{{ shadeName }}
              </div>
              <div class="color-variable">
                --p-{{ groupName }}-{{ shadeName }}
              </div>
              <div class="color-hex">
                {{ colorValue }}
              </div>

              <div class="copy-buttons">
                <button
                  class="copy-btn"
                  title="Copier la variable CSS"
                  @click="copyToClipboard(`--p-${groupName}-${shadeName}`)"
                >
                  📋 CSS Var
                </button>
                <button
                  class="copy-btn bg-class"
                  title="Copier la classe de fond"
                  @click="copyToClipboard(`.bg--${groupName}-${shadeName}`)"
                >
                  📋 .bg-
                </button>
                <button
                  class="copy-btn text-class"
                  title="Copier la classe de texte"
                  @click="copyToClipboard(`.text-color--${groupName}-${shadeName}`)"
                >
                  📋 .text-
                </button>
                <button
                  class="copy-btn"
                  title="Copier le code hexadécimal"
                  @click="copyToClipboard(colorValue)"
                >
                  📋 Hex
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Single colors -->
      <div class="color-group">
        <h3 class="color-group-title">
          Couleurs individuelles
        </h3>

        <div class="color-palette">
          <div
            v-for="(colorValue, colorName) in singleColors"
            :key="colorName"
            class="color-item"
          >
            <div
              class="color-preview"
              :style="{ backgroundColor: colorValue }"
              :title="`${colorName}: ${colorValue}`"
            />

            <div class="color-info">
              <div class="color-name">
                {{ colorName }}
              </div>
              <div class="color-variable">
                --p-{{ colorName }}
              </div>
              <div class="color-hex">
                {{ colorValue }}
              </div>

              <div class="copy-buttons">
                <button
                  class="copy-btn"
                  title="Copier la variable CSS"
                  @click="copyToClipboard(`--p-${colorName}`)"
                >
                  📋 CSS Var
                </button>
                <button
                  class="copy-btn bg-class"
                  title="Copier la classe de fond"
                  @click="copyToClipboard(`.bg--${colorName}`)"
                >
                  📋 .bg-
                </button>
                <button
                  class="copy-btn text-class"
                  title="Copier la classe de texte"
                  @click="copyToClipboard(`.text-color--${colorName}`)"
                >
                  📋 .text-
                </button>
                <button
                  class="copy-btn"
                  title="Copier le code hexadécimal"
                  @click="copyToClipboard(colorValue)"
                >
                  📋 Hex
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Figma Tokens -->
    <div v-else-if="type === 'tokens'" class="figma-tokens">
      <h2 class="section-title">
        Tokens sémantiques Figma
      </h2>
      <p class="intro">
        Tokens sémantiques basés sur les couleurs Figma. Ces tokens définissent l'utilisation contextuelle
        des couleurs dans l'interface utilisateur.
      </p>

      <div
        v-for="(tokenGroup, groupName) in tokenGroups"
        :key="groupName"
        class="token-group"
      >
        <h3 class="token-group-title">
          {{ formatGroupName(groupName) }}
        </h3>
        <p class="token-group-description">
          {{ getGroupDescription(groupName) }}
        </p>

        <div class="token-grid">
          <div
            v-for="(tokenValue, tokenName) in getFlattenedTokens(tokenGroup)"
            :key="`${groupName}-${tokenName}`"
            class="token-item"
          >
            <div
              class="token-preview"
              :style="{ backgroundColor: tokenValue }"
              :title="`${groupName}-${tokenName}: ${tokenValue}`"
            />

            <div class="token-info">
              <div class="token-name">
                {{ tokenName }}
              </div>
              <div class="token-variable">
                --p-{{ groupName }}-{{ tokenName }}
              </div>
              <div class="token-hex">
                {{ tokenValue }}
              </div>
              <div class="token-usage">
                {{ getTokenUsage(groupName, tokenName) }}
              </div>

              <div class="copy-buttons">
                <button
                  class="copy-btn"
                  title="Copier la variable CSS"
                  @click="copyToClipboard(`--p-${groupName}-${tokenName}`)"
                >
                  📋 CSS Var
                </button>
                <button
                  class="copy-btn bg-class"
                  title="Copier la classe de fond"
                  @click="copyToClipboard(`.bg--${groupName}-${tokenName}`)"
                >
                  📋 .bg-
                </button>
                <button
                  class="copy-btn text-class"
                  title="Copier la classe de texte"
                  @click="copyToClipboard(`.text-color--${groupName}-${tokenName}`)"
                >
                  📋 .text-
                </button>
                <button
                  class="copy-btn"
                  title="Copier la valeur hexadécimale"
                  @click="copyToClipboard(tokenValue)"
                >
                  📋 Hex
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Legacy Mapping -->
    <div v-else-if="type === 'legacy'" class="legacy-mapping">
      <h2 class="section-title">
        Correspondance Legacy vers Nouveau
      </h2>
      <p class="intro">
        Guide de migration des anciennes variables de couleur (Element Plus) vers le nouveau système Pégase.
      </p>

      <div class="search-container">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Rechercher une couleur... (ex: blue-pulse, neutral-gray, persian-400)"
          class="search-input"
        >
        <div class="search-info">
          {{ filteredMappings.length }} couleur(s) trouvée(s)
        </div>
      </div>

      <div
        v-for="(categoryMappings, categoryName) in groupedFilteredMappings"
        :key="categoryName"
        class="mapping-category"
      >
        <h3 class="category-title">
          {{ formatCategoryName(categoryName) }}
        </h3>

        <div class="mapping-table">
          <div class="table-header">
            <div class="col-preview">
              Aperçu
            </div>
            <div class="col-legacy">
              Ancienne variable
            </div>
            <div class="col-new">
              Nouvelle variable
            </div>
            <div class="col-hex">
              Valeur
            </div>
            <div class="col-actions">
              Actions
            </div>
          </div>

          <div
            v-for="mapping in categoryMappings"
            :key="mapping.legacyVar"
            class="mapping-row"
          >
            <div class="col-preview">
              <div
                class="color-preview"
                :style="{ backgroundColor: mapping.hexValue }"
                :title="`${mapping.hexValue}`"
              />
            </div>

            <div class="col-legacy">
              <code class="legacy-var">{{ mapping.legacyVar }}</code>
              <div class="var-category">
                {{ mapping.category }}
              </div>
            </div>

            <div class="col-new">
              <code class="new-var">{{ mapping.newVar }}</code>
            </div>

            <div class="col-hex">
              <code class="hex-value">{{ mapping.hexValue }}</code>
            </div>

            <div class="col-actions">
              <button
                class="copy-btn legacy"
                title="Copier l'ancienne variable"
                @click="copyToClipboard(mapping.legacyVar)"
              >
                📋 Legacy
              </button>
              <button
                class="copy-btn new"
                title="Copier la nouvelle variable"
                @click="copyToClipboard(mapping.newVar)"
              >
                📋 New
              </button>
              <button
                class="copy-btn hex"
                title="Copier la valeur hexadécimale"
                @click="copyToClipboard(mapping.hexValue)"
              >
                📋 Hex
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="filteredMappings.length === 0" class="no-results">
        <p>Aucune couleur trouvée pour "{{ searchTerm }}"</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, type PropType } from 'vue'
import { useCopyClipboard } from '../../utils/clipboard'
import { pegaseColors } from '../../design-system/pegase-colors.config'

interface ColorMapping {
  legacyVar: string
  newVar: string
  hexValue: string
  category: string
  searchText: string
}

const _props = defineProps({
  type: {
    type: String as PropType<'pegase' | 'tokens' | 'legacy'>,
    required: true,
  },
  colors: {
    type: Object,
    required: true,
  },
})

const searchTerm = ref('')

// Pegase colors logic
const colorGroups = computed(() => {
  if (_props.type !== 'pegase') {
    return {}
  }
  const groups: Record<string, Record<string, string>> = {}
  Object.entries(_props.colors).forEach(([key, value]) => {
    if (typeof value === 'object' && value !== null) {
      groups[key] = value as Record<string, string>
    }
  })
  return groups
})

const singleColors = computed(() => {
  if (_props.type !== 'pegase') {
    return {}
  }
  const singles: Record<string, string> = {}
  Object.entries(_props.colors).forEach(([key, value]) => {
    if (typeof value === 'string') {
      singles[key] = value
    }
  })
  return singles
})

// Figma tokens logic
const tokenGroups = computed(() => _props.type === 'tokens' ? _props.colors : {})

const getFlattenedTokens = (tokenGroup: any, parentKey = '') => {
  const flattened: Record<string, string> = {}
  Object.entries(tokenGroup).forEach(([key, value]) => {
    const fullKey = parentKey ? `${parentKey}-${key}` : key
    if (typeof value === 'string') {
      flattened[fullKey] = value
    } else if (typeof value === 'object' && value !== null) {
      Object.assign(flattened, getFlattenedTokens(value, fullKey))
    }
  })
  return flattened
}

// Legacy mapping logic
const allMappings = computed((): ColorMapping[] => {
  if (_props.type !== 'legacy') {
    return []
  }
  const mappings: ColorMapping[] = []

  // Helper function to find the corresponding Pégase variable name for a hex value
  const findPegaseVariable = (hexValue: string): string => {
    // Search through all Pégase colors to find matching hex value
    for (const [groupName, group] of Object.entries(pegaseColors)) {
      if (typeof group === 'object' && group !== null) {
        for (const [variantName, color] of Object.entries(group)) {
          if (color === hexValue) {
            return `--p-${groupName}-${variantName}`
          }
        }
      } else if (typeof group === 'string' && group === hexValue) {
        return `--p-${groupName}`
      }
    }
    // If not found, return unknown (should not happen with proper mappings)
    return '--p-unknown'
  }

  const processObject = (obj: any, parentKey = '', category = '') => {
    Object.entries(obj).forEach(([key, value]) => {
      const currentKey = parentKey ? `${parentKey}-${key}` : key
      const currentCategory = category || key
      if (typeof value === 'string') {
        const legacyVar = `--el-color-${currentKey}`
        const newVar = findPegaseVariable(value)
        mappings.push({
          legacyVar,
          newVar,
          hexValue: value,
          category: currentCategory,
          searchText: `${currentKey} ${legacyVar} ${newVar} ${value} ${currentCategory}`.toLowerCase(),
        })
      } else if (typeof value === 'object' && value !== null) {
        processObject(value, currentKey, currentCategory)
      }
    })
  }
  processObject(_props.colors)
  return mappings
})

const filteredMappings = computed(() => {
  if (!searchTerm.value.trim()) {
    return allMappings.value
  }
  const search = searchTerm.value.toLowerCase().trim()
  return allMappings.value.filter(mapping =>
    mapping.searchText.includes(search),
  )
})

const groupedFilteredMappings = computed(() => {
  const grouped: Record<string, ColorMapping[]> = {}
  filteredMappings.value.forEach(mapping => {
    if (!grouped[mapping.category]) {
      grouped[mapping.category] = []
    }
    grouped[mapping.category].push(mapping)
  })
  Object.keys(grouped).forEach(category => {
    grouped[category].sort((a, b) => a.legacyVar.localeCompare(b.legacyVar))
  })
  return grouped
})

// Helper functions
const formatGroupName = (groupName: string) => {
  return groupName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const getGroupDescription = (groupName: string) => {
  const descriptions: Record<string, string> = {
    'surface': 'Couleurs de fond et surfaces des composants',
    'stroke': 'Couleurs des bordures et contours',
    'text': 'Couleurs de texte et typographie',
    'button': 'Couleurs spécifiques aux boutons et leurs états',
    'icon': 'Couleurs pour les icônes et pictogrammes',
    'navbar': 'Couleurs de la barre de navigation',
  }
  return descriptions[groupName] || 'Tokens de couleur'
}

const getTokenUsage = (groupName: string, tokenName: string) => {
  const usages: Record<string, Record<string, string>> = {
    'surface': {
      'primary': 'Fond principal',
      'secondary': 'Fond secondaire',
      'success': 'Fond de succès',
      'error': 'Fond d\'erreur',
      'warning': 'Fond d\'avertissement',
      'state-hover': 'État de survol',
      'state-active': 'État actif',
      'state-disabled': 'État désactivé',
    },
    'text': {
      'heading': 'Titres principaux',
      'body': 'Texte de corps',
      'highlight': 'Texte mis en évidence',
      'neutral': 'Texte neutre',
      'success': 'Texte de succès',
      'error': 'Texte d\'erreur',
      'warning': 'Texte d\'avertissement',
    },
  }
  return usages[groupName]?.[tokenName] || 'Usage contextuel'
}

const formatCategoryName = (categoryName: string) => {
  const names: Record<string, string> = {
    'base': 'Couleurs de base',
    'pennylane': 'Couleurs partenaires (Pennylane)',
    'persian': 'Couleurs Persian (dégradés)',
    'secondary': 'Couleurs secondaires',
    'neutral': 'Couleurs neutres (grays)',
    'functionnal': 'Couleurs fonctionnelles',
    'polar': 'Couleurs Polar (legacy)',
  }
  return names[categoryName] || categoryName
}

const copyToClipboard = async (text: string) => {
  await useCopyClipboard(text)
}
</script>

<style scoped>
.color-documentation {
  padding: 24px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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

.color-group, .token-group, .mapping-category {
  margin-bottom: 48px;
}

.color-group-title, .token-group-title, .category-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--p-text-heading, #0E0F30);
  margin-bottom: 24px;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--p-stroke-neutral, #CDD1D4);
}

.token-group-description {
  color: var(--p-text-neutral, #889BA8);
  margin-bottom: 24px;
  font-style: italic;
}

.color-palette, .token-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.token-grid {
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
}

.color-item, .token-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border: 1px solid var(--p-stroke-neutral, #CDD1D4);
  border-radius: 8px;
  background: var(--p-surface-primary, #FFFFFF);
  transition: box-shadow 0.2s ease;
}

.color-item:hover, .token-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.color-preview, .token-preview {
  width: 48px;
  height: 48px;
  border-radius: 6px;
  margin-right: 16px;
  border: 1px solid var(--p-stroke-neutral, #CDD1D4);
  flex-shrink: 0;
}

.token-preview {
  width: 40px;
  height: 40px;
}

.color-info, .token-info {
  flex: 1;
}

.color-name, .token-name {
  font-weight: 600;
  color: var(--p-text-heading, #0E0F30);
  margin-bottom: 4px;
  font-size: 14px;
}

.color-variable, .token-variable {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  color: var(--p-text-highlight, #093C32);
  margin-bottom: 4px;
  font-size: 13px;
}

.color-hex, .token-hex {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  color: var(--p-text-neutral, #889BA8);
  margin-bottom: 12px;
  font-size: 13px;
}

.token-usage {
  color: var(--p-text-neutral, #889BA8);
  font-size: 12px;
  margin-bottom: 12px;
  font-style: italic;
}

.copy-buttons {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.copy-btn {
  padding: 4px 8px;
  font-size: 11px;
  border: 1px solid var(--p-stroke-default-primary, #ADB5BD);
  background: var(--p-surface-primary, #FFFFFF);
  color: var(--p-text-body, #15171A);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.copy-btn:hover {
  background: var(--p-surface-state-hover, #E7FFFF);
  border-color: var(--p-stroke-hover, #0C4F41);
}

.copy-btn:active {
  background: var(--p-surface-state-press, #ADE1D6);
}

.copy-btn.legacy {
  color: var(--p-text-error, #B10303);
  border-color: var(--p-stroke-error, #FF0000);
}

.copy-btn.new {
  color: var(--p-text-success, #0A710B);
  border-color: var(--p-stroke-success, #00B800);
}

.copy-btn.hex {
  color: var(--p-text-neutral, #889BA8);
}

.copy-btn.bg-class {
  color: var(--p-text-information-primary, #126778);
  border-color: var(--p-stroke-information-secondary, #2C2FD6);
}

.copy-btn.text-class {
  color: var(--p-text-warning, #BB5502);
  border-color: var(--p-stroke-warning, #FFA500);
}

/* Legacy mapping specific styles */
.search-container {
  margin-bottom: 32px;
}

.search-input {
  width: 100%;
  max-width: 500px;
  padding: 12px 16px;
  font-size: 16px;
  border: 1px solid var(--p-stroke-neutral, #CDD1D4);
  border-radius: 8px;
  background: var(--p-surface-primary, #FFFFFF);
  color: var(--p-text-body, #15171A);
  margin-bottom: 8px;
}

.search-input:focus {
  outline: none;
  border-color: var(--p-stroke-active, #1AAB8E);
  box-shadow: 0 0 0 2px rgba(26, 171, 142, 0.1);
}

.search-info {
  color: var(--p-text-neutral, #889BA8);
  font-size: 14px;
}

.mapping-table {
  border: 1px solid var(--p-stroke-neutral, #CDD1D4);
  border-radius: 8px;
  overflow: hidden;
  background: var(--p-surface-primary, #FFFFFF);
}

.table-header {
  display: grid;
  grid-template-columns: 60px 1fr 1fr 120px 200px;
  background: var(--p-surface-neutral-lighter, #F8F9FA);
  padding: 12px;
  font-weight: 600;
  color: var(--p-text-heading, #0E0F30);
  font-size: 14px;
  border-bottom: 1px solid var(--p-stroke-neutral, #CDD1D4);
}

.mapping-row {
  display: grid;
  grid-template-columns: 60px 1fr 1fr 120px 200px;
  padding: 12px;
  border-bottom: 1px solid var(--p-stroke-neutral, #CDD1D4);
  align-items: center;
  transition: background-color 0.2s ease;
}

.mapping-row:last-child {
  border-bottom: none;
}

.mapping-row:hover {
  background: var(--p-surface-state-hover, #E7FFFF);
}

.col-preview {
  display: flex;
  justify-content: center;
}

.legacy-var,
.new-var,
.hex-value {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  padding: 2px 4px;
  border-radius: 3px;
  background: rgba(0, 0, 0, 0.05);
}

.legacy-var {
  color: var(--p-text-error, #B10303);
}

.new-var {
  color: var(--p-text-success, #0A710B);
}

.hex-value {
  color: var(--p-text-neutral, #889BA8);
}

.var-category {
  font-size: 11px;
  color: var(--p-text-neutral, #889BA8);
  margin-top: 2px;
}

.col-actions {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.no-results {
  text-align: center;
  padding: 48px 24px;
  color: var(--p-text-neutral, #889BA8);
}

@media (max-width: 1024px) {
  .table-header,
  .mapping-row {
    grid-template-columns: 50px 1fr 1fr 100px 150px;
    font-size: 12px;
  }

  .col-actions {
    flex-direction: column;
    gap: 2px;
  }

  .copy-btn {
    font-size: 9px;
  }
}

@media (max-width: 768px) {
  .color-palette, .token-grid {
    grid-template-columns: 1fr;
  }

  .color-item, .token-item {
    padding: 12px;
  }

  .copy-buttons {
    justify-content: flex-start;
  }

  .mapping-table {
    overflow-x: auto;
  }

  .table-header,
  .mapping-row {
    min-width: 600px;
  }

  .color-documentation {
    padding: 16px;
  }
}
</style>
