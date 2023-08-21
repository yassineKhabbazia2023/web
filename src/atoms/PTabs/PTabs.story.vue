<template>
  <Story
    title="2. Atoms/Tabs"
    icon="ph:tabs-light"
    :layout="{
      type: 'grid',
      width: 600,
    }"
  >
    <Variant title="Basic Usage">
      <PTabs
        v-model="basicData.activeName"
        :stretch="basicData.stretch"
      >
        <PTabPane
          v-for="tab in tabs"
          :key="tab.name"
          :label="tab.label"
          :name="tab.name"
        >
          {{ tab.content }}
        </PTabPane>
      </PTabs>
    </Variant>
    <Variant title="Counter Usage">
      <PTabs :stretch="basicData.stretch">
        <PTabPane>
          <template #label>
            <span>Option A</span>
            <PPastille
              size="small"
              kind="persian"
              class="margin-left--2">
              12
            </PPastille>
          </template>
          Custom 1
        </PTabPane>
        <PTabPane>
          <template #label>
            <span>Option B</span>
            <PPastille
              size="small"
              kind="persian"
              class="margin-left--2">
              123
            </PPastille>
          </template>
          Custom 2
        </PTabPane>
        <PTabPane>
          <template #label>
            <span>Option C</span>
            <PPastille
              size="small"
              kind="persian"
              class="margin-left--2">
              1
            </PPastille>
          </template>
          Custom 3
        </PTabPane>
      </PTabs>
    </Variant>
    <Variant title="Card Usage">
      <PTabs
        v-model="basicData.activeName"
        type="card"
        :stretch="basicData.stretch"
      >
        <PTabPane
          v-for="tab in tabs"
          :key="tab.name"
          :label="tab.label"
          :name="tab.name"
        >
          {{ tab.content }}
        </PTabPane>
      </PTabs>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const basicData = reactive({
  activeName: '1',
  stretch: false
})

const tabs = ref([
  {
    label: 'Tab 1',
    name: '1',
    content: 'Tab 1 content'
  },
  {
    label: 'Tab 2',
    name: '2',
    content: 'Tab 2 content'
  },
  {
    label: 'Tab 3',
    name: '3',
    content: 'Tab 3 content'
  }
])
</script>

<docs lang="md">
  ## Tabs
  Variant with pastille, card or simple

  <div class="responsive-iframe-container">
    <iframe class="responsive-iframe" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D749%253A5606%26mode%3Ddev" allowfullscreen></iframe>
  </div>
</docs>

