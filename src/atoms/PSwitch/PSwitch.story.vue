<template>
  <Story title="2. Atoms/PSwitch" icon="teenyicons:circle-outline">
    <Variant title="'ON' Default">
      <PSwitch v-model="on"/>
    </Variant>
    <Variant title="'ON' Hover">
      <PSwitch v-model="on"/>
    </Variant>
    <Variant title="'ON' Focus/Press">
      <PSwitch v-model="on"/>
    </Variant>
    <Variant title="'OFF' Disabled">
      <PSwitch v-model="on" disabled/>
    </Variant>
    <Variant title="'OFF' Default">
      <PSwitch v-model="off"/>
    </Variant>
    <Variant title="'OFF' Hover">
      <PSwitch v-model="off"/>
    </Variant>
    <Variant title="'OFF' Focus/Press">
      <PSwitch v-model="off"/>
    </Variant>
    <Variant title="'OFF' Disabled">
      <PSwitch v-model="off" disabled/>
    </Variant>
  </Story>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import PSwitch from './'

const on = ref(true)
const off = ref(false)
</script>
