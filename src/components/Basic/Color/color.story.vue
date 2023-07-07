<template>
  <Story
    title="Basic/Color"
    :layout="{
      type: 'single',
      iframe: true,
    }"
    icon="ic:outline-color-lens"
  >
    <Variant title="Basic Usage" source=" ">
      <h1>
        Color
      </h1>
      <p>
        Element Plus uses a specific set of palettes to specify colors
        to provide a consistent look and feel for the products you build.
      </p>
      <h2>Main Color</h2>
      <p>
        The main color of Element Plus is bright and friendly blue.
      </p>
      <MainColor />
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
      <h2>Functionnal Colors Pegase</h2>
      <p>
        Cette palette de variantes de couleurs est conçue pour toujours
        rendre nos interfaces accessibles et compréhensibles.
        Elles sont utilisées pour donner des indications ou des feedbacks aux utilisateurs.
        <br>
        Nous les utiliserons principalement pour les notifications, informations ou pictogrammes.
      </p>
      <FunctionnalColorsPegase />
      <h2>Secondary Colors Element Plus</h2>
      <p>
        Used for basical elements of Element Plus.
        Better to use the Technical Colors when its for custom content or override Element Plus.
      </p>
      <SecondaryColors />
      <h2>
        Neutral Color
      </h2>
      <p>
        Neutral colors are for text, background and border colors.
        You can use different neutral colors to represent the hierarchical structure.
      </p>
      <NeutralColor />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import MainColor from './main-color.vue'
import SecondaryColors from './secondary-colors.vue'
import NeutralColor from './neutral-color.vue'
import SecondaryColorsPegase from './secondary-colors-pegase.vue'
import FunctionnalColorsPegase from './functionnal-colors-pegase.vue'
</script>

<style lang="scss">
.demo-color-box {
  position: relative;
  border-radius: 4px;
  padding: 20px;
  margin: 8px 0;
  height: 112px;
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
    width: 100%;
    height: 40px;
    left: 0;
    bottom: 0;
    position: absolute;

    .bg-blue-sub-item {
      height: 100%;
      display: inline-block;

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
</style>
