<template>
  <Story
    title="1. Basic/Color"
    :layout="{
      type: 'single',
      iframe: true,
    }"
    icon="ic:outline-color-lens"
  >
    <Variant title="Basic Usage" source="">
      <div class="margin-bottom--4">
        <h1 class="margin-bottom--2">
          Color
        </h1>
        <p>
          Vous trouverez dans cette page, en premier, les différentes couleurs utilisées dans Pégase et leur variable css.
          Puis en seconde partie, les classes utilitaires créées pour les background et text-color.
        </p>
      </div>
      <div class="margin-bottom--4">
        <h2 class="margin-bottom--2"> Couleur principale
        </h2>
        <p class="margin-bottom--4">
          C’est LA touche de couleur de KPMG Pulse. Elle apporte du dynamisme à nos interfaces.
          Cette couleur qui représente la marque, utilisées comme couleur primaire et accents.
        </p>
        <MainColor />
      </div>
      <div class="margin-bottom--4">
        <h2>Secondary Colors Pegase</h2>
        <p>
          There are the secondary colors for Pegase.
          From Figma : Extraites du dégradé KPMG Pulse, les couleurs vives
          vous permettront d’apporter des touches de couleurs à vos contenus.
          Ces touches de couleurs vives fonctionnent en duo,
          par exemple : un picto fuschia et un cercle de soutien avec un fond en fuschia-bg
          et un label fuschia-txt.
          <br>
          Nous les utiliserons principalement pour les infographies ou pictogrammes.
        </p>
        <SecondaryColorsPegase />
      </div>
      <div class="margin-bottom--4">
        <h2>Functionnal Colors Pegase</h2>
        <p>
          Cette palette de variantes de couleurs est conçue pour toujours
          rendre nos interfaces accessibles et compréhensibles.
          Elles sont utilisées pour donner des indications ou des feedbacks aux utilisateurs.
          <br>
          Nous les utiliserons principalement pour les notifications, informations ou pictogrammes.
        </p>
        <FunctionnalColorsPegase />
      </div>
      <div class="margin-bottom--4">
        <h2 class="margin-bottom--2">
          Utilitaires de couleur Pegase
        </h2>
        <p class="margin-bottom--4">
          Classes créées dans le but d'éviter de créer dans les MFE, des classes à chaque fois que l'on souhaite utiliser une couleur.
        </p>
        <h3 class="margin-bottom--2">
          Les classes de texte
        </h3>
        <p class="margin-bottom--2">Les couleurs de texte seront préfixées par : <span class="bold">text-color--</span>
          <br>
          Suivi ensuite par la catégorie de couleur, puis de son idenfiant.
          <br>
          La classe sera donc ainsi <span class="bold">text-color--{catégorie}-{identifiant}</span>
        </p>
        <p class="bold margin-bottom--2">
          Quelques exemples :
        </p>
        <ul class="margin-bottom--4">
          <li><span class="text-color--persian-500">text-color--persian-500</span></li>
          <li><span class="text-color--neutral-gray-500">text-color--neutral-gray-500</span></li>
          <li><span class="text-color--functionnal-red-txt">text-color--functionnal-red-txt</span></li>
          <li><span class="text-color--secondary-cyan-txt">text-color--secondary-cyan-txt</span></li>
        </ul>
        <h3 class="margin-bottom--2">
          Les classes de background
        </h3>
        <p class="margin-bottom--2">Les couleurs de background seront préfixées par : <span class="bold">bg--</span>
          <br>
          Suivi ensuite par la catégorie de couleur, puis de son idenfiant.
          <br>
          La classe sera donc ainsi <span class="bold">bg--{catégorie}-{identifiant}</span>
        </p>
        <p
          class="
            bold margin-bottom--2
            hover-bg--persian-500
            hover-text-color--secondary-cyan-txt
          ">
          Quelques exemples :
        </p>
        <ul>
          <li>
            <pre
              class="
                padding--4
                bg--persian-500
                text-color--base-white
                hover-bg--base-white
                hover-text-color--persian-500
              "
            >
              bg--persian-500
              text-color--base-white
              hover-bg--base-white
              hover-text-color--persian-500
            </pre>
          </li>
          <li>
            <pre
              class="
                padding--4
                bg--neutral-gray-500
                text-color--base-white
                hover-bg--base-white
                hover-text-color--neutral-gray-500
              "
            >
              bg--neutral-gray-500
              text-color--base-white
              hover-bg--base-white
              hover-text-color--neutral-gray-500
            </pre>
          </li>
          <li>
            <pre
              class="
                padding--4
                bg--functionnal-red-bg
                text-color--functionnal-red-txt
                hover-bg--functionnal-red-txt
                hover-text-color--functionnal-red-bg
              "
            >
              bg--functionnal-red-bg
              text-color--functionnal-red-txt
              hover-bg--functionnal-red-txt
              hover-text-color--functionnal-red-bg
            </pre>
          </li>
          <li>
            <pre
              class="
                padding--4
                bg--secondary-cyan-bg
                text-color--secondary-cyan-txt
                hover-text-color--secondary-cyan-bg
                hover-bg--secondary-cyan-txt
              "
            >
              bg--secondary-cyan-bg
              text-color--secondary-cyan-txt
              hover-text-color--secondary-cyan-bg
              hover-bg--secondary-cyan-txt
            </pre>
          </li>
        </ul>
      </div>
    </Variant>
    <Variant title="Dictionary" source="">
      <ColorDictionary :groupKey="groupKey" :prefix="prefix" />
      <template #controls>
        <HstSelect
          v-model="prefix"
          title="Prefix"
          :options="prefixes" />
        <HstSelect
          v-model="groupKey"
          title="Group"
          :options="groupKeys" />
      </template>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MainColor from './main-color.vue'
import ColorDictionary from './ColorDictionary.vue'
import SecondaryColorsPegase from './secondary-colors-pegase.vue'
import FunctionnalColorsPegase from './functionnal-colors-pegase.vue'
import type { Prefix } from './ColorsDictionaryTypes'
import { colorsConfig } from './colorsConfig'

const groupKeys = [
  '',
  ...Object.keys(colorsConfig),
].reduce((groupKeys, key) => {
  groupKeys[key] = key || '-all-'

  return groupKeys
}, {} as Record<string, string>)

const prefixes: Prefix[] = [
  'bg',
  'text-color',
  'hover-bg',
  'hover-text-color',
]

const groupKey = ref(Object.keys(groupKeys)[0])
const prefix = ref<Prefix>(prefixes[0])
</script>

<style lang="scss">
.demo-color-box {
  position: relative;
  border-radius: 4px;
  padding: 20px;
  margin: 8px 0;
  height: 152px;
  box-sizing: border-box;
  color: var(--el-color-white);
  font-size: 14px;

  &--pegase.demo-color-box {
    height: auto;
    padding: 0;

    .bg-color-sub {
      position: relative;
      display: flex;
      flex-wrap: wrap;
      height: 120px;
      overflow: hidden;
      border-radius: var(--el-border-radius-base);

      &--functionnal.bg-color-sub {
        height: 200px;

        .bg-secondary-sub-item {
          height: calc(100% / 5);
        }
      }

      .bg-secondary-sub-item {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        height: calc(100% / 3);
        font-size: 12px;

        &:first-child {
          border-radius: 0;
        }

        &:nth-child(3n) {
          color: black;
        }
      }
    }
  }

  .bg-color-sub {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    left: 0;
    bottom: 0;
    position: absolute;

    .bg-blue-sub-item {
      display: inline-block;
      height: 40px;

      &:first-child {
        border-radius: 0 0 0 var(--el-border-radius-base);
      }
    }

    .bg-secondary-sub-item {
      height: 100%;
      display: inline-block;

      &:first-child {
        border-radius: 0 0 0 var(--el-border-radius-base);
      }
    }
  }

  .value {
    margin-top: 2px;
  }
}

.demo-color-box-lite {
  color: var(--el-text-color-primary);
}

pre {
  white-space: pre-line;
}
</style>
<docs lang="md">
## Colors
<div class="container">
  Au click sur une case de couleur, sera copié la variable css de la couleur, à utiliser dans vos
  composants.
</div>
<div class="reponsive-iframe-container">
  <iframe class="responsive-iframe" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FCmAQkyvJgicN6PHwf61DBZ%2F%25F0%259F%25A6%2584-Guidelines%3Ftype%3Ddesign%26node-id%3D525%253A416%26mode%3Ddev" allowfullscreen></iframe>
</div>
</docs>
