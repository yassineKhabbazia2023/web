<template>
  <Story title="2. Atoms/Button" icon="teenyicons:button-outline">
    <Variant title="Basic Usage" :source="basicSource">
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
          :options="basicButtonData.typeOptions" />
        <HstRadio
          v-model="basicButtonData.size"
          title="Size"
          :options="basicButtonData.sizeOptions" />
      </template>
    </Variant>
    <Variant
      title="Icon Button"
      :source="iconSource"
      icon="line-md:iconify2">
      <PButton
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
          :options="iconButtonData.typeOptions"
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
      :source="buttonGroupSource"
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
          :options="buttonGroupData.typeOptions"
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
import sizeOptions from '@/constants/sizeOptions'
import { isAttribute } from '@/utils'
import { logEvent } from 'histoire/client'
import { typeOptions } from '@/constants/typeOptions'
import { reactive, computed } from 'vue'
import PButton from './'
/* eslint-disable-next-line */
import '@/assets/scss/histoire.scss'

// Basic-Button
const basicButtonData = reactive({
  text: 'Button',
  type: 'primary',
  typeOptions,
  size: 'default',
  sizeOptions,
  plain: false,
  round: false,
  circle: false,
  loading: false,
  disabled: false
})

const basicSource = computed(() => {
  return `<PButton${isAttribute(
    basicButtonData.type !== '',
    `type="${basicButtonData.type}"`
  )}${isAttribute(
    basicButtonData.size !== 'default',
    `size="${basicButtonData.size}"`
  )}${isAttribute(
    basicButtonData.plain,
    'plain'
  )}${isAttribute(
    basicButtonData.round,
    'round'
  )}${isAttribute(
    basicButtonData.circle,
    'circle'
  )}${isAttribute(
    basicButtonData.loading,
    'loading'
  )}${isAttribute(
    basicButtonData.disabled,
    'disabled'
  )}
  @click="console.log('Button is clicked')"
>
  <PIcon class="el-button__icon--left">
    <PICalendarEvent />
  </PIcon>
  ${basicButtonData.text}
  <PIcon class="el-button__icon--right">
    <PIArrowRight />
  </PIcon>
</PButton>`
})

// Icon Button
const iconButtonData = reactive({
  type: '',
  typeOptions,
  size: 'default',
  sizeOptions,
  circle: true,
  plain: false,
  loading: false,
  disabled: false
})
const iconSource = computed(() => {
  return `<script setup lang="ts">
<script>

<PButton
  ${isAttribute(
    iconButtonData.type !== '',
    `type="${iconButtonData.type}"`
  )}${isAttribute(
    iconButtonData.size !== 'default',
    `size="${iconButtonData.size}"`
  )}${isAttribute(
    iconButtonData.plain,
    'plain'
  )}${isAttribute(
    iconButtonData.circle,
    'circle'
  )}${isAttribute(
    iconButtonData.loading,
    'loading'
  )}${isAttribute(
    iconButtonData.disabled,
    'disabled'
  )}
  @click="console.log('Button is clicked')"
>
  <PIcon><PISearch /></PIcon>
</PButton>
`
})

// Button Group
const buttonGroupData = reactive({
  type: '',
  typeOptions,
  size: 'default',
  sizeOptions
})

const buttonGroupSource = computed(() => {
  return `<el-button-group${isAttribute(
    buttonGroupData.type !== '',
    `type="${buttonGroupData.type}"`
  )}${isAttribute(
    buttonGroupData.size !== 'default',
    `size="${buttonGroupData.size}"`
  )}
>
  <PButton>Previous Page</PButton>
  <PButton>Next Page</PButton>
</el-button-group>`
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
    <li>Tertiary / Tertiary</li>
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
