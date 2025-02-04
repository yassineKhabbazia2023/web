<template>
  <Story title="2. Atoms/Skewed Button" icon="teenyicons:button-outline">
    <Variant title="Initial">
      <PSkewedButton
        :pContent="basicButton.pContent"
        :pDisabled="basicButton.pDisabled"
        :pHasLoader="basicButton.pHasLoader"
        @click="logEvent('click', { log: 'Skewed button clicked' })"
      />
      <template #controls>
        <HstText v-model="basicButton.pContent" title="pContent" />
        <HstCheckbox v-model="basicButton.pDisabled" title="pDisabled" />
        <HstCheckbox v-model="basicButton.pHasLoader" title="pHasLoader" />
      </template>
    </Variant>
    <Variant title="Disabled">
      <PSkewedButton
        :pContent="disabledButton.pContent"
        :pDisabled="disabledButton.pDisabled"
        :pHasLoader="disabledButton.pHasLoader"
        @click="logEvent('click', { log: 'Should not log anything as it\'s disabled' })"
      />
      <template #controls>
        <HstText v-model="disabledButton.pContent" title="pContent" />
        <HstCheckbox v-model="disabledButton.pDisabled" title="pDisabled" />
        <HstCheckbox v-model="disabledButton.pHasLoader" title="pHasLoader" />
      </template>
    </Variant>
    <Variant title="With loader">
      <PSkewedButton
        :pContent="buttonWithLoader.pContent"
        :pDisabled="buttonWithLoader.pDisabled"
        :pHasLoader="buttonWithLoader.pHasLoader"
        @click="logEvent('click', { log: 'Skewed button clicked' })"
      />
      <template #controls>
        <HstText v-model="buttonWithLoader.pContent" title="pContent" />
        <HstCheckbox v-model="buttonWithLoader.pDisabled" title="pDisabled" />
        <HstCheckbox v-model="buttonWithLoader.pHasLoader" title="pHasLoader" />
      </template>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { logEvent } from 'histoire/client'
import { ref } from 'vue'
import PSkewedButton from './'
import type { PSkewedButtonProps } from './PSkewedButton.types'

const basicButton = ref<PSkewedButtonProps>({
  pContent: 'Skewed Button',
  pDisabled: false,
  pHasLoader: false,
})

const disabledButton = ref<PSkewedButtonProps>({
  pContent: 'Skewed Button',
  pDisabled: true,
  pHasLoader: false,
})

const buttonWithLoader = ref<PSkewedButtonProps>({
  pContent: 'Skewed Button',
  pDisabled: false,
  pHasLoader: true,
})
</script>

<docs lang="md">
  ## Button
  2 sizes : default / small
  <br>
  <strong>Colors styleguide to Element Plus:</strong>
  <ul>
    <li>Default / primary</li>
    <li>Secondary / Primary Plain</li>
    <li>White / white</li>
    <li>Tertiary / Default</li>
    <li>Generic / Generic</li>
  </ul>
  <strong>Classes to add to your icon :</strong>
  <ul>
    <li>For left icon : .el-button__icon--left</li>
    <li>For right icon : .el-button__icon--right</li>
  </ul>
</docs>
