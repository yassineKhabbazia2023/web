<template>
  <Story title="2. Atoms/Button" icon="teenyicons:button-outline">
    <Variant title="Basic Usage">
      <PButton
        :pType="basicButton.pType"
        :pPlain="basicButton.pPlain"
        :pRound="basicButton.pRound"
        :pCircle="basicButton.pCircle"
        :pDisabled="basicButton.pDisabled"
        :pIsActive="basicButton.pIsActive"
        :pLoading="basicButton.pLoading"
        :pSize="basicButton.pSize"
        @click="logEvent('click', { log: 'Button is clicked' })"
      >
        <PIcon class="el-button__icon--left">
          <PICalendarEvent />
        </PIcon>
        {{ buttonText }}
        <PIcon class="el-button__icon--right">
          <PIArrowRight />
        </PIcon>
      </PButton>
      <template #controls>
        <HstText v-model="buttonText" title="Text" />
        <HstCheckbox v-model="basicButton.pPlain" title="Plain" />
        <HstCheckbox v-model="basicButton.pRound" title="Round" />
        <HstCheckbox v-model="basicButton.pCircle" title="Circle" />
        <HstCheckbox v-model="basicButton.pDisabled" title="Disabled" />
        <HstCheckbox v-model="basicButton.pIsActive" title="Active" />
        <HstCheckbox v-model="basicButton.pLoading" title="Loading" />
        <HstRadio
          v-model="basicButton.pType"
          title="Type"
          :options="buttonTypeList" />
        <HstRadio
          v-model="basicButton.pSize"
          title="Size"
          :options="buttonSizeList" />
      </template>
    </Variant>
    <Variant
      title="Icon Button"
      icon="line-md:iconify2">
      <PButton
        pIconOnly
        :pType="iconButton.pType"
        :pPlain="iconButton.pPlain"
        :pRound="iconButton.pRound"
        :pCircle="iconButton.pCircle"
        :pDisabled="iconButton.pDisabled"
        :pLoading="iconButton.pLoading"
        :pSize="iconButton.pSize"
        @click="logEvent('click', { log: 'Button is clicked' })"
      >
        <PIcon><PISearch /></PIcon>
      </PButton>
      <template #controls>
        <HstCheckbox v-model="iconButton.pPlain" title="Plain" />
        <HstCheckbox v-model="iconButton.pRound" title="Round" />
        <HstCheckbox v-model="iconButton.pCircle" title="Circle" />
        <HstCheckbox v-model="iconButton.pDisabled" title="Disabled" />
        <HstCheckbox v-model="iconButton.pLoading" title="Loading" />
        <HstRadio
          v-model="iconButton.pType"
          title="Type"
          :options="buttonTypeList" />
        <HstRadio
          v-model="iconButton.pSize"
          title="Size"
          :options="buttonSizeList" />
      </template>
    </Variant>
    <Variant
      title="Button Group"
      icon="clarity:blocks-group-line"
    >
      <PButtonGroup
        :pType="groupButton.pType"
        :pSize="groupButton.pSize">
        <PButton>
          {{ previousText }}
        </PButton>
        <PButton>
          {{  nextText }}
        </PButton>
      </PButtonGroup>
      <template #controls>
        <HstRadio
          v-model="groupButton.pType"
          title="Type"
          :options="buttonTypeList"
        />
        <HstRadio
          v-model="groupButton.pSize"
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
import PButtonGroup from '@styleguide/atoms/PButtonGroup/'
import type { PButtonProps } from './PButtonTypes'
import type { PButtonGroupProps } from '@styleguide/atoms/PButtonGroup/PButtonGroupTypes'

const basicButton = ref<PButtonProps>({
  pType: 'default',
  pPlain: false,
  pRound: false,
  pCircle: false,
  pDisabled: false,
  pIsActive: false,
  pLoading: false,
  pSize: 'default',
})

const buttonText = ref('')

const iconButton = ref<PButtonProps>({
  pType: 'default',
  pPlain: false,
  pRound: false,
  pCircle: true,
  pDisabled: false,
  pLoading: false,
  pSize: 'default',
})

const groupButton = ref<PButtonGroupProps>({
  pType: 'default',
  pSize: 'default',
})

const buttonTypeList: { label: string, value: PButtonProps['pType'] }[] = [
  {
    label: 'default',
    value: 'default',
  },
  {
    label: 'primary',
    value: 'primary',
  },
  {
    label: 'white',
    value: 'white',
  },
  {
    label: 'generic',
    value: 'generic',
  },
  {
    label: 'success',
    value: 'success',
  },
  {
    label: 'warning',
    value: 'warning',
  },
  {
    label: 'danger',
    value: 'danger',
  },
  {
    label: 'info',
    value: 'info',
  },
]

const buttonSizeList: { label: string, value: PButtonProps['pSize'] }[] = [
  {
    label: 'default',
    value: 'default',
  },
  {
    label: 'small',
    value: 'small',
  },
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
</docs>
