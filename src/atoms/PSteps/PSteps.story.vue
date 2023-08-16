<template>
  <Story
    title="2. Atoms/Steps"
    icon="fluent:arrow-step-in-right-16-regular"
    :layout="{
      type: 'single'
    }"
  >
    <Variant
      title="Basic Usage">
      <div :style="{ height: basicData.direction === 'vertical' ? '300px' : '' }">
        <PSteps
          :active="basicData.active"
          :direction="basicData.direction"
          :processStatus="basicData.processStatus"
          :finishStatus="basicData.finishStatus"
        >
          <PStepItem :title="basicDataTitles.step1" />
          <PStepItem :title="basicDataTitles.step2" />
          <PStepItem :title="basicDataTitles.step3" />
        </PSteps>
      </div>
      <template #controls>
        <HstInputNumber
          v-model="basicData.active"
          title="Active"
          :min="0"
          :max="3" />
        <HstButtonGroup
          v-model="basicData.direction"
          title="Direction"
          :options="stepperDirection"
        />
        <HstSelect
          v-model="basicData.processStatus"
          title="ProcessStatus"
          :options="stateOptions" />
        <HstSelect
          v-model="basicData.finishStatus"
          title="finishStatus"
          :options="stateOptions" />
        <el-divider borderStyle="dotted" contentPosition="left">
          <span>title</span>
        </el-divider>
        <HstText v-model="basicDataTitles.step1" title="Step 1" />
        <HstText v-model="basicDataTitles.step2" title="Step 2" />
        <HstText v-model="basicDataTitles.step3" title="Step 3" />
      </template>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { type StateOptions, stateOptions } from '@/constants/stateOptions'

type basicDataOptions = { active: number, direction: 'horizontal' | 'vertical', processStatus: StateOptions, finishStatus: StateOptions }

const basicData = ref<basicDataOptions>({
  active: 0,
  direction: 'horizontal',
  processStatus: 'process',
  finishStatus: 'finish'
})

const basicDataTitles = ref({
  step1: 'step 1',
  step2: 'step 2',
  step3: 'step 3'
})

const stepperDirection: { label: string; value:string }[] = [{
  label: 'vertical',
  value: 'vertical'
}, {
  label: 'horizontal',
  value: 'horizontal'
}]
</script>

<docs lang="md">
  <div class="responsive-iframe-container">
    <iframe class="responsive-iframe" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D749%253A4747%26mode%3Ddev" allowfullscreen></iframe>
  </div>
</docs>
