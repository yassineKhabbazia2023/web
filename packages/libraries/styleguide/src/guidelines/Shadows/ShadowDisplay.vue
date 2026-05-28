<template>
  <div class="shadow-documentation">
    <h2 class="section-title">
      Système d'ombres Pégase
    </h2>
    <p class="intro">
      Le système d'ombres Pégase utilise 6 niveaux d'élévation pour créer une hiérarchie visuelle claire.
      Cliquez sur les boutons pour copier les classes CSS dans votre presse-papier.
    </p>

    <div class="shadows-grid">
      <div
        v-for="shadow in shadows"
        :key="shadow.level"
        class="shadow-item"
      >
        <div
          class="shadow-preview"
          :class="shadow.className"
        >
          <div class="shadow-content">
            Niveau {{ shadow.level }}
          </div>
        </div>

        <div class="shadow-info">
          <div class="shadow-name">
            {{ shadow.name }}
          </div>
          <div class="shadow-class">
            .{{ shadow.className }}
          </div>
          <div class="shadow-description">
            {{ shadow.description }}
          </div>
          <div class="shadow-usage">
            <strong>Usage :</strong> {{ shadow.usage }}
          </div>

          <div class="copy-buttons">
            <button
              class="copy-btn"
              title="Copier la classe CSS"
              @click="copyToClipboard(`.${shadow.className}`)"
            >
              📋 Classe CSS
            </button>
            <button
              class="copy-btn technical"
              title="Copier le CSS technique"
              @click="copyToClipboard(shadow.cssValue)"
            >
              📋 CSS Value
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="comparison-section">
      <h3 class="comparison-title">
        Comparaison des niveaux
      </h3>
      <p class="comparison-description">
        Cette section montre les différents niveaux d'ombres côte à côte pour faciliter la sélection.
      </p>

      <div class="comparison-grid">
        <div
          v-for="shadow in shadows"
          :key="`comparison-${shadow.level}`"
          class="comparison-item"
        >
          <div
            class="comparison-preview"
            :class="shadow.className"
            @click="copyToClipboard(`.${shadow.className}`)"
          >
            {{ shadow.level }}
          </div>
          <div class="comparison-label">
            {{ shadow.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCopyClipboard } from '../../utils/clipboard'

const shadows = [
  {
    level: 1,
    name: 'Léger',
    className: 'shadow--1',
    description: 'Ombre très subtile pour les éléments proches de la surface',
    usage: 'Cartes simples, champs de saisie, éléments au survol',
    cssValue: 'box-shadow: 0 1px 2px 0 rgba(112, 144, 176, 0.2), 0 0 2px 0 rgba(112, 144, 176, 0.1);',
  },
  {
    level: 2,
    name: 'Subtil',
    className: 'shadow--2',
    description: 'Ombre douce pour les éléments légèrement surélevés',
    usage: 'Boutons, petites cartes, éléments interactifs',
    cssValue: 'box-shadow: 0 3px 4px 0 rgba(112, 144, 176, 0.1), 0 2px 4px 0 rgba(112, 144, 176, 0.08), 0 1px 2px 0 rgba(112, 144, 176, 0.05), 0 0 2px 0 rgba(112, 144, 176, 0.1);',
  },
  {
    level: 3,
    name: 'Standard',
    className: 'shadow--3',
    description: 'Ombre standard pour les éléments principaux',
    usage: 'Cartes de contenu, panneaux, conteneurs principaux',
    cssValue: 'box-shadow: 0 16px 16px 0 rgba(112, 144, 176, 0.04), 0 6px 8px 0 rgba(112, 144, 176, 0.05), 0 2px 4px 0 rgba(112, 144, 176, 0.08), 0 1px 2px 0 rgba(112, 144, 176, 0.05), 0 0 2px 0 rgba(112, 144, 176, 0.1);',
  },
  {
    level: 4,
    name: 'Élevé',
    className: 'shadow--4',
    description: 'Ombre marquée pour les éléments importants',
    usage: 'Modales, popups, éléments flottants',
    cssValue: 'box-shadow: 0 12px 15px 0 rgba(112, 144, 176, 0.04), 0 8px 8px 0 rgba(112, 144, 176, 0.05), 0 4px 4px 0 rgba(112, 144, 176, 0.08), 0 2px 2px 0 rgba(112, 144, 176, 0.05), 0 1px 2px 0 rgba(112, 144, 176, 0.10);',
  },
  {
    level: 5,
    name: 'Très élevé',
    className: 'shadow--5',
    description: 'Ombre prononcée pour les éléments de premier plan',
    usage: 'Grandes modales, overlays, éléments décoratifs',
    cssValue: 'box-shadow: 0 16px 40px 1px rgba(112, 144, 176, 0.15), 0 8px 8px 0 rgba(112, 144, 176, 0.05), 0 4px 4px 0 rgba(112, 144, 176, 0.08), 0 2px 2px 0 rgba(112, 144, 176, 0.05), 0 1px 2px 0 rgba(112, 144, 176, 0.10);',
  },
  {
    level: 6,
    name: 'Maximum',
    className: 'shadow--6',
    description: 'Ombre maximale pour les éléments les plus élevés',
    usage: 'Tooltips, dropdowns, menus contextuels',
    cssValue: 'box-shadow: 0 24px 50px 0 rgba(112, 144, 176, 0.2), 0 8px 8px 0 rgba(112, 144, 176, 0.05), 0 4px 4px 0 rgba(112, 144, 176, 0.08), 0 2px 2px 0 rgba(112, 144, 176, 0.05), 0 2px 1px 0 rgba(112, 144, 176, 0.1);',
  },
]

const copyToClipboard = async (text: string) => {
  await useCopyClipboard(text)
}
</script>

<style scoped>
.shadow-documentation {
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

.shadows-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 24px;
  margin-bottom: 48px;
}

.shadow-item {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--p-stroke-neutral, #CDD1D4);
  border-radius: 8px;
  background: var(--p-surface-primary, #FFFFFF);
  overflow: hidden;
}

.shadow-preview {
  padding: 32px;
  margin: 16px;
  border-radius: 8px;
  background: var(--p-surface-primary, #FFFFFF);
  border: 1px solid var(--p-stroke-neutral-lighter, #E0E6ED);
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.shadow-content {
  font-size: 18px;
  font-weight: 600;
  color: var(--p-text-heading, #0E0F30);
  text-align: center;
}

.shadow-info {
  padding: 16px;
  border-top: 1px solid var(--p-stroke-neutral-lighter, #E0E6ED);
}

.shadow-name {
  font-weight: 700;
  color: var(--p-text-heading, #0E0F30);
  margin-bottom: 8px;
  font-size: 18px;
}

.shadow-class {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  color: var(--p-text-highlight, #093C32);
  margin-bottom: 12px;
  font-size: 14px;
  background: rgba(9, 60, 50, 0.1);
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
}

.shadow-description {
  color: var(--p-text-body, #15171A);
  margin-bottom: 8px;
  line-height: 1.5;
}

.shadow-usage {
  color: var(--p-text-neutral, #889BA8);
  margin-bottom: 16px;
  line-height: 1.5;
  font-size: 14px;
}

.copy-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
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

.copy-btn.technical {
  color: var(--p-text-information-primary, #126778);
  border-color: var(--p-stroke-information-secondary, #2C2FD6);
}

.comparison-section {
  margin-top: 48px;
  padding-top: 32px;
  border-top: 2px solid var(--p-stroke-neutral, #CDD1D4);
}

.comparison-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--p-text-heading, #0E0F30);
  margin-bottom: 16px;
}

.comparison-description {
  color: var(--p-text-body, #15171A);
  margin-bottom: 24px;
  line-height: 1.6;
}

.comparison-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
}

.comparison-item {
  text-align: center;
}

.comparison-preview {
  width: 120px;
  height: 120px;
  margin: 0 auto 12px;
  background: var(--p-surface-primary, #FFFFFF);
  border: 1px solid var(--p-stroke-neutral-lighter, #E0E6ED);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
  color: var(--p-text-heading, #0E0F30);
  cursor: pointer;
  transition: transform 0.2s ease;
}

.comparison-preview:hover {
  transform: translateY(-2px);
}

.comparison-label {
  color: var(--p-text-body, #15171A);
  font-weight: 500;
  font-size: 14px;
}

@media (max-width: 768px) {
  .shadows-grid {
    grid-template-columns: 1fr;
  }

  .comparison-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 16px;
  }

  .comparison-preview {
    width: 100px;
    height: 100px;
    font-size: 20px;
  }

  .shadow-documentation {
    padding: 16px;
  }
}
</style>
