<template>
  <Story title="2. Atoms/Button" icon="teenyicons:button-outline">
    <Variant title="Basic Usage">
      <PButton
        :pType="basicButton.basicType"
        :pPlain="basicButton.basicPlain"
        :pRound="basicButton.basicRound"
        :pCircle="basicButton.basicCircle"
        :pDisabled="basicButton.basicDisabled"
        :pLoading="basicButton.basicLoading"
        :pSize="basicButton.basicSize"
        @click="logEvent('click', { log: 'Button is clicked' })"
      >
        <PIcon class="el-button__icon--left">
          <PICalendarEvent />
        </PIcon>
        {{ basicButton.basicText }}
        <PIcon class="el-button__icon--right">
          <PIArrowRight />
        </PIcon>
      </PButton>
      <template #controls>
        <HstText v-model="basicButton.basicText" title="Text" />
        <HstCheckbox v-model="basicButton.basicPlain" title="Plain" />
        <HstCheckbox v-model="basicButton.basicRound" title="Round" />
        <HstCheckbox v-model="basicButton.basicCircle" title="Circle" />
        <HstCheckbox v-model="basicButton.basicDisabled" title="Disabled" />
        <HstCheckbox v-model="basicButton.basicLoading" title="Loading" />
        <HstRadio
          v-model="basicButton.basicType"
          title="Type"
          :options="buttonTypeList" />
        <HstRadio
          v-model="basicButton.basicSize"
          title="Size"
          :options="buttonSizeList" />
      </template>
    </Variant>
    <Variant
      title="Icon Button"
      icon="line-md:iconify2">
      <PButton
        class="el-button--icon"
        :pType="iconButton.iconButtonType"
        :pPlain="iconButton.iconButtonPlain"
        :pRound="iconButton.iconButtonRound"
        :pCircle="iconButton.iconButtonCircle"
        :pDisabled="iconButton.iconButtonDisabled"
        :pLoading="iconButton.iconButtonLoading"
        :pSize="iconButton.iconButtonSize"
        @click="logEvent('click', { log: 'Button is clicked' })"
      >
        <PIcon><PISearch /></PIcon>
      </PButton>
      <template #controls>
        <HstCheckbox v-model="iconButton.iconButtonPlain" title="Plain" />
        <HstCheckbox v-model="iconButton.iconButtonRound" title="Round" />
        <HstCheckbox v-model="iconButton.iconButtonCircle" title="Circle" />
        <HstCheckbox v-model="iconButton.iconButtonDisabled" title="Disabled" />
        <HstCheckbox v-model="iconButton.iconButtonLoading" title="Loading" />
        <HstRadio
          v-model="iconButton.iconButtonType"
          title="Type"
          :options="buttonTypeList" />
        <HstRadio
          v-model="iconButton.iconButtonSize"
          title="Size"
          :options="buttonSizeList" />
      </template>
    </Variant>
    <Variant
      title="Button Group"
      icon="clarity:blocks-group-line"
    >
      <PButtonGroup
        :pType="groupButton.buttonGroupType"
        :pSize="groupButton.buttonGroupSize">
        <PButton>
          {{ previousText }}
        </PButton>
        <PButton>
          {{  nextText }}
        </PButton>
      </PButtonGroup>
      <template #controls>
        <HstRadio
          v-model="groupButton.buttonGroupType"
          title="Type"
          :options="buttonTypeList"
        />
        <HstRadio
          v-model="groupButton.buttonGroupSize"
          title="Size"
          :options="buttonSizeList"
        />
      </template>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { logEvent } from 'histoire/client'
import { ref } from 'vue'
import PButton from './'
import PButtonGroup from '@/atoms/PButtonGroup/'
import type { PButtonTypes } from './PButtonTypes'

const basicButton = ref({
  basicType: ref<PButtonTypes['pType']>('default'),
  basicPlain: ref<PButtonTypes['pPlain']>(),
  basicRound: ref<PButtonTypes['pRound']>(),
  basicCircle: ref<PButtonTypes['pCircle']>(),
  basicDisabled: ref<PButtonTypes['pDisabled']>(),
  basicLoading: ref<PButtonTypes['pLoading']>(),
  basicSize: ref<PButtonTypes['pSize']>('default'),
  basicText: ref('')
})

const iconButton = ref({
  iconButtonType: ref<PButtonTypes['pType']>('default'),
  iconButtonPlain: ref<PButtonTypes['pPlain']>(),
  iconButtonRound: ref<PButtonTypes['pRound']>(),
  iconButtonCircle: ref<PButtonTypes['pCircle']>(true),
  iconButtonDisabled: ref<PButtonTypes['pDisabled']>(),
  iconButtonLoading: ref<PButtonTypes['pLoading']>(),
  iconButtonSize: ref<PButtonTypes['pSize']>('default')
})

const groupButton = ref({
  buttonGroupType: ref<PButtonTypes['pType']>('default'),
  buttonGroupSize: ref<PButtonTypes['pSize']>('default')
})

const buttonTypeList: { label: string; value: PButtonTypes['pType'] }[] = [
  {
    label: 'default',
    value: 'default'
  },
  {
    label: 'primary',
    value: 'primary'
  },
  {
    label: 'white',
    value: 'white'
  },
  {
    label: 'generic',
    value: 'generic'
  },
  {
    label: 'success',
    value: 'success'
  },
  {
    label: 'warning',
    value: 'warning'
  },
  {
    label: 'danger',
    value: 'danger'
  },
  {
    label: 'info',
    value: 'info'
  }
]

const buttonSizeList: { label: string; value: PButtonTypes['pSize'] }[] = [
  {
    label: 'default',
    value: 'default'
  },
  {
    label: 'small',
    value: 'small'
  }
]

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
