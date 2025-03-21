<template>
  <Story
    title="2. Atoms/Strength"
    icon="teenyicons:button-outline"
  >
    <Variant title="Basic">
      <PStrength
        :modelValue="modelValue"
        :labels="strengthLabelsMock"
      />
      <template #controls>
        <HstSelect
          v-model="modelValue"
          :options="strengthLevels"
          title="modelValue"
        />
      </template>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { PStrengthLevel } from './PStrength.types'
import { strengthLabelsMock } from './PStrength.mocks'
import PStrength from './'

const modelValue = ref<PStrengthLevel>(2)
const strengthLevels: PStrengthLevel[] = [
  0,
  1,
  2,
  3,
  4,
]
</script>