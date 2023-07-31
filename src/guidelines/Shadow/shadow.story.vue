<template>
  <Story
    title="1. Basic/Shadow"
    icon="radix-icons:shadow-inner"
    source=" "
    :layout="{
      type: 'grid',
      width: '100%',
    }"
  >
    <Variant title="Shadow Custom Pegase">
      <div class="shadow-box">
        <div class="shadow-item">
          <div class="shadow shadow--1" />
          <code class="code-value">.shadow--1</code>
        </div>
        <div class="shadow-item">
          <div class="shadow shadow--2" />
          <code class="code-value">.shadow--2</code>
        </div>
        <div class="shadow-item">
          <div class="shadow shadow--3" />
          <code class="code-value">.shadow--3</code>
        </div>
        <div class="shadow-item">
          <div class="shadow shadow--4" />
          <code class="code-value">.shadow--4</code>
        </div>
        <div class="shadow-item">
          <div class="shadow shadow--5" />
          <code class="code-value">.shadow--5</code>
        </div>
        <div class="shadow-item">
          <div class="shadow shadow--6" />
          <code class="code-value">.shadow--6</code>
        </div>
      </div>
    </Variant>
    <Variant title="Shadow Element Plus">
      <div class="shadow-box">
        <div
          v-for="(shadow, i) in shadowGroup"
          :key="i"
          class="shadow-item"
        >
          <div
            class="shadow"
            :style="{
              boxShadow: `var(${getCssVarName(shadow.type)})`,
            }"
          />
          <span>
            {{ shadow.name }}
          </span>
          <code
            class="code-value"
          >
            {{ getCssVarName(shadow.type) }}
          </code>
        </div>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const shadowGroup = ref([
  {
    name: 'Basic Shadow',
    type: ''
  },
  {
    name: 'Light Shadow',
    type: 'light'
  },
  {
    name: 'Lighter Shadow',
    type: 'lighter'
  },
  {
    name: 'Dark Shadow',
    type: 'dark'
  }
])

function getCssVarName(type: string) {
  return `--el-box-shadow${type ? '-' : ''}${type}`
}
</script>

<style scoped>
.shadow-box {
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.shadow-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: calc(50% - 40px);
  margin: 20px;
}

.shadow {
  display: inline-flex;
  width: 7.5rem;
  height: 7.5rem;
  margin: 0.5rem;
}

.code-value {
  border: 1px solid var(--el-border-color);
  background-color: var(--el-fill-color-light);
  font-size: 16px;
  margin: 10px 0;
  white-space: nowrap;
  color: black;
}
</style>
<docs lang="md">
## Shadow
<div class="container">
  <p>Les ombres sont un excellent moyen de créer une perception de la profondeur. Nous l'utilisons
    principalement lorsque nous voulons mettre en évidence certaines zones - à la fois sur
    l'interaction au survol et sur les composants statiques. La densité des ombres se multiplie
    à chaque itération. Chaque poids double à mesure que vous augmentez. Nous essayons de ne pas
    utiliser les ombres trop souvent car cela peut rapidement devenir trop puissant.</p>
</div>
<div class="reponsive-iframe-container">
  <iframe class="responsive-iframe" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FCmAQkyvJgicN6PHwf61DBZ%2F%25F0%259F%25A6%2584-Guidelines%3Ftype%3Ddesign%26node-id%3D68%253A180%26mode%3Ddev" allowfullscreen></iframe>
</div>
</docs>
