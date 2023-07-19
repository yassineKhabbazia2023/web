<script setup lang="ts">
/* eslint-disable-next-line */
import sizeOptions from '../../constants/sizeOptions'
import { isAttribute } from '../../utils'
import { logEvent } from 'histoire/client'
import { typeOptions } from '../../constants/typeOptions'
import { reactive, computed } from 'vue'
import PButton from './PButton.vue'
/* eslint-disable-next-line */
import '@/assets/scss/histoire.scss'

// Basic-Button
const basicButtonData = reactive({
  text: 'Button',
  type: '',
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
  ${basicButtonData.text}
</PButton>`
})

// Icon Button
const iconButtonData = reactive({
  text: '',
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
<PIcon>
  <PIAdd/>
</PIcon>
${isAttribute(Boolean(iconButtonData.text), iconButtonData.text)}
</PButton>
`
})

// Color Button
const colorButtonData = reactive({
  text: 'Custom Color Button',
  color: '#626aef',
  plain: false,
  disabled: false
})

const ColorSource = computed(() => {
  return `<PButton${isAttribute(
    true,
    `color="${colorButtonData.color}"`
  )}${isAttribute(
    colorButtonData.plain,
    'plain'
  )}${isAttribute(
    colorButtonData.disabled,
    'disabled'
  )}
  @click="console.log('Button is clicked')"
>
  ${colorButtonData.text}
</PButton>`
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

<template>
  <Story title="Basic/Button" icon="teenyicons:button-outline">
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
        {{ basicButtonData.text }}
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
        <template v-if="iconButtonData.text" #default>
          {{ iconButtonData.text }}
        </template>
      </PButton>
      <template #controls>
        <HstText v-model="iconButtonData.text" title="Text" />
        <HstCheckbox v-model="iconButtonData.plain" title="Plain" />
        <HstCheckbox v-model="iconButtonData.circle" title="Circle" />
        <HstCheckbox v-model="iconButtonData.disabled" title="Disabled" />
        <HstCheckbox v-model="iconButtonData.loading" title="Loading" />

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
      title="Custom Color"
      icon="ic:outline-color-lens"
      :source="ColorSource"
    >
      <PButton
        :plain="colorButtonData.plain"
        :disabled="colorButtonData.disabled"
        :color="colorButtonData.color"
        @click="logEvent('click', $event)"
      >
        {{ colorButtonData.text }}
      </PButton>
      <template #controls>
        <HstText v-model="colorButtonData.text" title="Text" />
        <HstColor v-model="colorButtonData.color" title="Color" />
        <HstCheckbox v-model="colorButtonData.plain" title="Plain" />
        <HstCheckbox v-model="colorButtonData.disabled" title="Disabled" />
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
<docs lang="md">
  <div class="container">
    <iframe
      class="responsive-iframe"
      src="https://www.figma.com/embed?embed_host=sastdstorybook.z28.web.core.windows.net&amp;url=
      https://www.figma.com/file/xcugC6MchXrgyIq6yHrjf7/Librairie?node-id=5373%3A17809">
    </iframe>
  </div>
</docs>
