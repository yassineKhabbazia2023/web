<template>
  <Story title="2. Atoms/Switch" icon="teenyicons:circle-outline">
    <Variant title="'ON' Default/Hover/Focus/Press">
      <PSwitch v-model="on"/>
    </Variant>
    <Variant title="'ON' Disabled">
      <PSwitch v-model="alwaysOn" pDisabled/>
    </Variant>
    <Variant title="'OFF' Default/Hover/Focus/Press">
      <PSwitch v-model="off"/>
    </Variant>
    <Variant title="'OFF' Disabled">
      <PSwitch v-model="alwaysOff" pDisabled/>
    </Variant>
    <Variant title="with text">
      <PSwitch v-model="withText.state" :pActiveText="withText.label" />
    </Variant>

    <template #controls>
      <HstText v-model="withText.label" title="active text" />
    </template>
  </Story>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const on = ref(true)
const off = ref(false)
const alwaysOn = ref(true)
const alwaysOff = ref(false)

const withText = reactive({
  state: true,
  label: 'label'
})
</script>

<docs lang="md">
  ## Switch
  This component is a simple switch.

  <div class="responsive-iframe-container">
    <iframe class="responsive-iframe" src="https://www.figma.com/file/hycpUsOrc1fFD7xcYY0ryN/%F0%9F%A6%84-Librairie-de-composants?node-id=560%3A10883&mode=dev" allowfullscreen></iframe>
  </div>
</docs>
