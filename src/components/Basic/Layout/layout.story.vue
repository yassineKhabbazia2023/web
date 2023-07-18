<script setup lang="ts">
import { justifyOptions } from './constants'
import { reactive } from 'vue'

// Basic Usage
const basicData = reactive({
  span: 6,
  gutter: 0,
  offset: 0,
  justify: 'start',
  align: 'top',
  push: 0,
  pull: 0
})
</script>

<template>
  <Story
    title="Basic/Layout"
    icon="lucide:layout-dashboard"
    :layout="{
      type: 'single'
    }"
  >
    <Variant title="Basic Usage">
      <p class="h4">
        Valeurs d’espacement
      </p>

      <table>
        <thead>
          <th>Size (px)</th>
          <th>Size (rem)</th>
          <th>Exemple d’utilisation</th>
        </thead>
        <tbody>
          <tr>
            <td>4px</td>
            <td>0.25rem</td>
            <td>Margin entre icône et texte</td>
          </tr>
          <tr>
            <td>8px</td>
            <td>0.50rem</td>
            <td>Margin entre label et input</td>
          </tr>
          <tr>
            <td>12px</td>
            <td>0.75rem</td>
            <td>Padding dans les cards ou tableaux</td>
          </tr>
          <tr>
            <td>16px</td>
            <td>1rem</td>
            <td><strong>Spacing de base</strong>. Margin entre les atomes et molécules</td>
          </tr>
          <tr>
            <td>20px</td>
            <td>1.25rem</td>
            <td>Margin entre les molécules, les organismes et les sections</td>
          </tr>
          <tr>
            <td>24px</td>
            <td>1.50rem</td>
            <td>Margin entre les molécules, les organismes et les sections</td>
          </tr>
          <tr>
            <td>32px</td>
            <td>2rem</td>
            <td>Margin entre les organismes et les sections</td>
          </tr>
          <tr>
            <td>48px</td>
            <td>3rem</td>
            <td>Margin entre les organismes et les sections</td>
          </tr>
          <tr>
            <td>64px</td>
            <td>4rem</td>
            <td>Margin entre les organismes et les sections</td>
          </tr>
          <tr>
            <td>128px</td>
            <td>8rem</td>
            <td>Margin entre les organismes et les sections</td>
          </tr>
        </tbody>
      </table>

      <p class="h4">
        Breakpoints
      </p>
      <p><strong>“Utiliser une mise en page de 100% de largeur est le
          meilleur moyen d'avoir une mise en page inadaptée à 100%.”</strong>
        <br>
        C'est pourquoi nous préférons concevoir pour plusieurs points d'arrêt
        au lieu des 2 points d'arrêt actuels (à partir de 801px).
        Pour éviter d'avoir trop d'espaces ou des phrases trop longues sur les grands écrans.
        Une définition générale de breakpoint sont des valeurs de résolutions
        qui un changement de résolution, alors les marges et gouttières changent de valeur.
        En créant des groupes des principaux appareils utilisés,
        nous pouvons facilement définir des breakpoints.
      </p>
      <table>
        <thead>
          <th>Nom du breakpoint</th>
          <th>Device</th>
          <th>Size (px)</th>
          <th>Columns</th>
          <th>Gutter</th>
          <th>Margin</th>
        </thead>
        <tbody>
          <tr>
            <td>xs</td>
            <td>Mobile</td>
            <td>&lt; 768 px</td>
            <td>2</td>
            <td>16px</td>
            <td>16px</td>
          </tr>
          <tr>
            <td>sm</td>
            <td>Tablette</td>
            <td>≥ 768 px</td>
            <td>4</td>
            <td>16px</td>
            <td>16px</td>
          </tr>
          <tr>
            <td>md</td>
            <td>Small desktop</td>
            <td>≥ 992 px</td>
            <td>8</td>
            <td>16px</td>
            <td>16px</td>
          </tr>
          <tr>
            <td>lg</td>
            <td>Medium desktop</td>
            <td>≥ 1200px</td>
            <td>12</td>
            <td>24px</td>
            <td>24px</td>
          </tr>
          <tr>
            <td>xl</td>
            <td>Large desktop</td>
            <td>≥ 1920px</td>
            <td>12</td>
            <td>32px</td>
            <td>32px</td>
          </tr>
        </tbody>
      </table>

      <el-row :gutter="basicData.gutter" :justify="basicData.justify">
        <el-col
v-for="item in 4"
          :key="item"
          :span="basicData.span"
          :offset="basicData.offset"
          :push="basicData.push"
          :pull="basicData.pull">
          <div class="grid-item" :class="item % 2 ? 'grid-item-dark' : 'grid-item-light'" />
        </el-col>
      </el-row>
      <template #controls>
        <HstSlider
v-model="basicData.gutter"
title="Gutter"
:min="0"
:max="60" />
        <HstSlider
v-model="basicData.span"
title="Span"
:min="0"
:max="24" />
        <HstSlider
v-model="basicData.offset"
title="Offset"
:min="0"
:max="24" />
        <HstSlider
v-model="basicData.push"
title="Push"
:min="0"
:max="24" />
        <HstSlider
v-model="basicData.pull"
title="Pull"
:min="0"
:max="24" />
        <HstRadio
v-model="basicData.justify"
title="Justify"
:options="justifyOptions" />
      </template>
    </Variant>
  </Story>
</template>

<style lang="scss">
table {
  width: 100%;
  border: 0;
  border-collapse: collapse;
}

thead {
  background: #F5F5F5;
  color: #666666;
  border-bottom: 1px solid #DBDBDB;
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
  border-bottom: 1px solid #DBDBDB;
  color: #171717;
  font-weight: 400;
  font-size: 14px;
  line-height: 120%;
}

.el-col {
  margin-bottom: 10px;
}

.grid-item {
  min-height: 36px;
}

.grid-item-light {
  background: #d3dce6;
}

.grid-item-dark {
  background: #e5e9f2;
}
</style>
<docs lang="md">
## Layout
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
améliorer la communication entre les designers et les développeurs. Nous avons choisi
une unité 8 car la plupart des tailles d'écran sont divisibles par 4 et 4 lui-même est
également un nombre facilement divisible.</p>
</div>
</docs>
