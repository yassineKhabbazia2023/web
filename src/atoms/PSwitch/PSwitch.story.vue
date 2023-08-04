<template>
  <Story title="2. Atoms/Switch" icon="teenyicons:circle-outline">
    <Variant title="'ON' Default/Hover/Focus/Press">
      <ElSwitch v-model="on"/>
    </Variant>
    <Variant title="'ON' Disabled">
      <ElSwitch v-model="on" disabled/>
    </Variant>
    <Variant title="'OFF' Default/Hover/Focus/Press">
      <ElSwitch v-model="off"/>
    </Variant>
    <Variant title="'OFF' Disabled">
      <ElSwitch v-model="off" disabled/>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElSwitch } from 'element-plus'

const on = ref(true)
const off = ref(false)
</script>

<docs lang="md">
  ## Pastille
  This component is a simple switch.

  <div class="responsive-iframe-container">
    <iframe class="responsive-iframe" src="https://www.figma.com/file/hycpUsOrc1fFD7xcYY0ryN/%F0%9F%A6%84-Librairie-de-composants?node-id=560%3A10883&mode=dev" allowfullscreen></iframe>
  </div>
</docs>
