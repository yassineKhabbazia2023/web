<template>
  <Story title="2. Atoms/Skewed Button" icon="teenyicons:button-outline">
    <Variant title="Initial">
      <PSkewedButton
        :pContent="basicButton.pContent"
        :pDisabled="basicButton.pDisabled"
        @click="logEvent('click', { log: 'Skewed button clciked' })"
      />
    </Variant>
    <Variant title="Disabled">
      <PSkewedButton
        :pContent="disabledButton.pContent"
        :pDisabled="disabledButton.pDisabled"
        @click="logEvent('click', { log: 'Should not log anything as it\'s disabled' })"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { logEvent } from 'histoire/client'
import { ref } from 'vue'
import PSkewedButton from './'
// eslint-disable-next-line import/extensions
import type { PSkewedButtonProps } from './PSkewedButton.types'

const basicButton = ref<PSkewedButtonProps>({
  pContent: 'Skewed Button',
  pDisabled: false,
})

const disabledButton = ref<PSkewedButtonProps>({
  pContent: 'Skewed Button',
  pDisabled: true,
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
