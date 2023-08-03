<template>
  <Story title="2. Atoms/Button" icon="teenyicons:button-outline">
    <Variant title="Basic Usage">
      <PButton
        :type="basicButtonData.type"
        :size="basicButtonData.size"
        :plain="basicButtonData.plain"
        :round="basicButtonData.round"
        :disabled="basicButtonData.disabled"
        :loading="basicButtonData.loading"
        @click="logEvent('click', { log: 'Button is clicked' })"
      >
        <PIcon class="el-button__icon--left">
          <PICalendarEvent />
        </PIcon>
        {{ basicButtonData.text }}
        <PIcon class="el-button__icon--right">
          <PIArrowRight />
        </PIcon>
      </PButton>
      <template #controls>
        <HstText v-model="basicButtonData.text" title="Text" />
        <HstCheckbox v-model="basicButtonData.plain" title="Plain" />
        <HstCheckbox v-model="basicButtonData.round" title="Round" />
        <HstCheckbox v-model="basicButtonData.disabled" title="Disabled" />
        <HstCheckbox v-model="basicButtonData.loading" title="Loading" />
        <HstRadio
          v-model="basicButtonData.type"
          title="Type"
          :options="typeOptions" />
        <HstRadio
          v-model="basicButtonData.size"
          title="Size"
          :options="basicButtonData.sizeOptions" />
      </template>
    </Variant>
    <Variant
      title="Icon Button"
      icon="line-md:iconify2">
      <PButton
        class="el-button--icon"
        :type="iconButtonData.type"
        :size="iconButtonData.size"
        :plain="iconButtonData.plain"
        :circle="iconButtonData.circle"
        :disabled="iconButtonData.disabled"
        :loading="iconButtonData.loading"
        @click="logEvent('click', { log: 'Button is clicked' })"
      >
        <PIcon><PISearch /></PIcon>
      </PButton>
      <template #controls>
        <HstCheckbox v-model="iconButtonData.plain" title="Plain" />
        <HstCheckbox v-model="iconButtonData.circle" title="Circle" />
        <HstCheckbox v-model="iconButtonData.disabled" title="Disabled" />

        <HstRadio
          v-model="iconButtonData.type"
          title="Type"
          :options="typeOptions"
        />
        <HstRadio
          v-model="iconButtonData.size"
          title="Size"
          :options="iconButtonData.sizeOptions"
        />
      </template>
    </Variant>
    <Variant
      title="Button Group"
      icon="clarity:blocks-group-line"
    >
      <el-button-group
        :size="buttonGroupData.size"
        :type="buttonGroupData.type"
      >
        <PButton>
          {{ previousText }}
        </PButton>
        <PButton>
          {{  nextText }}
        </PButton>
      </el-button-group>
      <template #controls>
        <HstRadio
          v-model="buttonGroupData.type"
          title="Type"
          :options="groupOptions"
        />
        <HstRadio
          v-model="buttonGroupData.size"
          title="Size"
          :options="buttonGroupData.sizeOptions"
        />
      </template>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { type SizeOptions } from '@/constants/sizeOptions'
import { logEvent } from 'histoire/client'
import { ref } from 'vue'
import { type TypeOptions, type GroupTypeOptions, typeOptions, groupOptions } from '@/constants/typeOptions'
import PButton from './'

const radioSizeOptions: { label: string; value:string }[] = [
  {
    label: 'default',
    value: 'default'
  },
  {
    label: 'small',
    value: 'small'
  }
]

// Basic-Button
const basicButtonData = ref({
  text: 'Button',
  type: 'primary' as TypeOptions,
  size: 'default' as SizeOptions,
  sizeOptions: radioSizeOptions,
  plain: false,
  round: false,
  circle: false,
  loading: false,
  disabled: false
})

// Icon Button
const iconButtonData = ref({
  type: 'primary' as TypeOptions,
  size: 'default' as SizeOptions,
  sizeOptions: radioSizeOptions,
  circle: true,
  plain: false,
  loading: false,
  disabled: false
})

// Button Group
const buttonGroupData = ref({
  type: 'text' as GroupTypeOptions,
  size: 'default' as SizeOptions,
  sizeOptions: radioSizeOptions
})

const previousText = 'Previous Page'
const nextText = 'Next Page'
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
  <div class="responsive-iframe-container">
    <iframe class="responsive-iframe" width="800" height="450" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D278%253A761%26mode%3Ddev" allowfullscreen></iframe>
  </div>
</docs>
