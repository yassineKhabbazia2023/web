<template>
  <Story
    title="3. Molecules/FileCard"
    icon="fluent-emoji-high-contrast:card-file-box"
    :layout="{ type: 'single', iframe: true }">
    <Variant title="Default">
      <div class="padding--4">
        <PFileCard
          :pName="defaultState.pName"
          :pFormat="defaultState.pFormat"
          :pSize="defaultState.pSize"
          :pHasIcon="defaultState.pHasIcon"
          :pHasButton="defaultState.pHasButton"
        >
          <template #icon>
            <PIcon pName="filetypePdf" />
          </template>
          <template #buttons>
            <PButton
              class="el-button--icon"
              pType="white"
              :pPlain="false"
              @click="logEvent('click', { log: 'Button is clicked' })"
            >
              <PIcon pName="download" />
            </PButton>
            <PButton
              class="el-button--icon"
              pType="white"
              :pPlain="false"
              @click="logEvent('click', { log: 'Button is clicked' })"
            >
              <PIcon pName="eye" />
            </PButton>
          </template>
        </PFileCard>
        <PFileCard
          :pName="testName"
          :pFormat="defaultState.pFormat"
          :pSize="defaultState.pSize"
          :pHasIcon="defaultState.pHasIcon"
          :pHasButton="defaultState.pHasButton"
        >
          <template #buttons>
            <PButton
              class="el-button--icon"
              pType="white"
              :pPlain="false"
              @click="logEvent('click', { log: 'Button is clicked' })"
            >
              <PIcon pName="download" />
            </PButton>
            <PButton
              class="el-button--icon"
              pType="white"
              :pPlain="false"
              @click="logEvent('click', { log: 'Button is clicked' })"
            >
              <PIcon pName="eye" />
            </PButton>
          </template>
        </PFileCard>
      </div>
      <template #controls>
        <HstText v-model="defaultState.pName" title="pName" />
        <HstText v-model="defaultState.pFormat" title="pFormat" />
        <HstText v-model="defaultState.pSize" title="File size" />
      </template>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import PFileCard from './'
import PButton from '../../atoms/PButton'
import { logEvent } from 'histoire/client'
import PIcon from '../../atoms/PIcon'

const defaultState = reactive({
  pName: 'mandat-1000308253-12248236612-signature.pdf',
  pFormat: 'PDF',
  pSize: '25KB',
  pHasIcon: true,
  pHasButton: true,
})
const testName = 'mandat-1000308253-12248236612-signature.png'
</script>

<docs lang="md">
  <div class="responsive-iframe-container">
    <iframe class="responsive-iframe" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D1074%253A5508%26mode%3Ddev" allowfullscreen></iframe>
  </div>
</docs>
